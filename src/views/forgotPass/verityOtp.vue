<template>
  <div class="otp-wrapper">
    <!-- Background -->
    <div class="bg-circle bg-one"></div>
    <div class="bg-circle bg-two"></div>
    
    <div class="otp-card">
      <!-- Top -->
      <div class="top-section">
        <button class="back-btn" @click="router.back()">
          <i class="bi bi-chevron-left"></i>
        </button>
      </div>

      <!-- Icon -->
      <div class="icon-wrapper">
        <div class="icon-circle">
          <i class="bi bi-shield-lock-fill"></i>
        </div>
      </div>

      <!-- Title -->
      <h1 class="title">ផ្ទៀងផ្ទាត់ OTP</h1>

      <!-- Description -->
      <p class="description">
        សូមបញ្ចូលលេខកូដ OTP 6 ខ្ទង់ដែលបានផ្ញើទៅ Email របស់អ្នក
      </p>

      <!-- OTP Inputs -->
      <div class="otp-inputs">
        <input
          v-for="(item, index) in otp"
          :key="index"
          ref="otpInputs"
          type="text"
          maxlength="1"
          class="otp-input"
          v-model="otp[index]"
          @input="handleInput($event, index)"
          @keydown.backspace="handleBackspace($event, index)"
          @paste="handlePaste"
        />
      </div>

      <!-- Message -->
      <div class="message-box">
        <transition name="fade">
          <small v-if="errorMessage" class="error-text">
            <i class="bi bi-exclamation-circle-fill"></i>
            {{ errorMessage }}
          </small>
        </transition>

        <transition name="fade">
          <small v-if="successMessage" class="success-text">
            <i class="bi bi-check-circle-fill"></i>
            {{ successMessage }}
          </small>
        </transition>
      </div>

      <!-- Verify Button -->
      <button class="verify-btn" @click="verifyOtp" :disabled="loading">
        <span v-if="loading" class="loading-content">
          <span class="loader"></span>
          កំពុងផ្ទៀងផ្ទាត់...
        </span>

        <span v-else> ផ្ទៀងផ្ទាត់ </span>
      </button>

      <!-- Bottom -->
      <div class="bottom-section">
        <p class="resend-text">
          មិនទាន់ទទួលបាន OTP?

          <span :class="{ disabled: countdown > 0 }" @click="resendOtp">
            {{
              countdown > 0 ? `បញ្ជូនឡើងវិញ (${countdown}s)` : "បញ្ជូនម្តងទៀត"
            }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/API/api";
const router = useRouter();
/* -------------------------
   STATES
------------------------- */
const otp = ref(["", "", "", "", "", ""]);
const otpInputs = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const countdown = ref(0);
const email = localStorage.getItem("email");
/* -------------------------
   AUTO FOCUS
------------------------- */
onMounted(() => {
  nextTick(() => {
    otpInputs.value[0]?.focus();
  });
});
/* -------------------------
   CLEAR MESSAGE
------------------------- */
const clearMessages = () => {
  errorMessage.value = "";
  successMessage.value = "";
};
/* -------------------------
   HANDLE INPUT
------------------------- */
const handleInput = (event, index) => {
  const value = event.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  otp.value[index] = value;
  if (value && index < otp.value.length - 1) {
    otpInputs.value[index + 1]?.focus();
  }
  clearMessages();
};
/* -------------------------
   BACKSPACE
------------------------- */
const handleBackspace = (event, index) => {
  if (!otp.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus();
  }
};
/* -------------------------
   PASTE OTP
------------------------- */
const handlePaste = (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData
    .getData("text")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .split("");
  pastedData.forEach((char, index) => {
    otp.value[index] = char;
  });
  nextTick(() => {
    const nextIndex = pastedData.length >= 6 ? 5 : pastedData.length;
    otpInputs.value[nextIndex]?.focus();
  });
};
/* -------------------------
   VERIFY OTP
------------------------- */
const verifyOtp = async () => {
  clearMessages();
  // Join OTP
  const otpCode = otp.value.join("");
  /* ---------------------
     VALIDATION
  --------------------- */
  if (!email) {
    errorMessage.value = "Email មិនមាន";
    return;
  }
  if (otpCode.length !== 6) {
    errorMessage.value = "សូមបញ្ចូល OTP 6 ខ្ទង់";
    return;
  }
  try {
    loading.value = true;
    console.log("EMAIL:", email);
    console.log("OTP:", otpCode);
    /* ---------------------
       API
    --------------------- */
    const response = await api.post("/api/forgot/verify-otp", {
      email,
      otp: otpCode,
    });
    console.log(response.data);
    /* ---------------------
       SAVE OTP
    --------------------- */
    localStorage.setItem("otp", otpCode);
    /* ---------------------
       SUCCESS MESSAGE
    --------------------- */
    successMessage.value = response.data.message || "OTP ត្រឹមត្រូវ";
    /* ---------------------
       REDIRECT
    --------------------- */
    setTimeout(() => {
      router.push("/resetpassword");
    }, 1500);
  } catch (err) {
    console.log(err);
    /* ---------------------
       TIMEOUT
    --------------------- */
    if (err.code === "ECONNABORTED") {
      errorMessage.value = "Request timeout";
    } else if (err.response) {
      /* ---------------------
       API ERROR
    --------------------- */
      errorMessage.value = err.response.data.message || "OTP មិនត្រឹមត្រូវ";
    } else if (err.request) {
      /* ---------------------
       NO RESPONSE
    --------------------- */
      errorMessage.value = "Server មិនឆ្លើយតប";
    } else {
      /* ---------------------
       OTHER ERROR
    --------------------- */
      errorMessage.value = err.message;
    }
  } finally {
    loading.value = false;
  }
};
/* -------------------------
   RESEND OTP
------------------------- */
const resendOtp = async () => {
  clearMessages();
  if (countdown.value > 0) return;
  try {
    loading.value = true;
    const response = await api.post("/api/forgot/resend-otp", {
      email,
    });
    successMessage.value = response.data.message || "បានផ្ញើ OTP ម្តងទៀត";
    startCountdown();
  } catch (err) {
    console.log(err);
    if (err.response) {
      errorMessage.value = err.response.data.message;
    } else {
      errorMessage.value = "មិនអាចផ្ញើ OTP បាន";
    }
  } finally {
    loading.value = false;
  }
};
/* -------------------------
   COUNTDOWN
------------------------- */
const startCountdown = () => {
  countdown.value = 30;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.otp-wrapper {
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Kantumruy Pro", sans-serif;
}
.otp-card {
  width: 450px;
  height: 600px;
  background: white;
  border-radius: 30px;
  border: 2px solid #d9d9d9;
  padding: 35px 45px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
/* Back */
.back-btn {
  font-size: 35px;
  color: #333;
  cursor: pointer;
  transition: 0.3s;
  border: none;
  background-color: #fff;
}
.back-btn:hover {
  transform: translateX(-4px);
}
/* Icon */
.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-top: -5px;
}
.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #4d6cf0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-circle i {
  color: white;
  font-size: 38px;
}
/* Title */
.title {
  text-align: center;
  font-size: 34px;
  font-weight: 600;
  margin-top: 35px;
  color: #111;
}

.error-text {
  display: block;
  color: #e53935;
  font-size: 10px;
  margin-top: 10px;
}
/* Description */
.description {
  text-align: center;
  font-size: 16px;
  color: #555;
  margin-top: 35px;
}
/* OTP Inputs */
.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 45px;
}
.otp-inputs input {
  width: 44px;
  height: 50px;
  border-radius: 10px;
  border: 2px solid #d5dbe3;
  background: #eef2f6;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #111;
  outline: none;
  font-family: "Kantumruy Pro", sans-serif;
}
/* Button */
.verify-btn {
  width: 350px;
  height: 45px;
  background: #4d6cf0;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  display: block;
  margin: 30px auto 0;
  cursor: pointer;
  transition: 0.3s;
  font-family: "Kantumruy Pro", sans-serif;
}
.verify-btn:hover {
  background: #3d5ee6;
  transform: translateY(-2px);
}
.verify-btn:active {
  transform: scale(0.98);
}
/* Resend */
.resend-text {
  text-align: center;
  margin-top: 18px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  font-family: "Kantumruy Pro", sans-serif;
}
</style>
