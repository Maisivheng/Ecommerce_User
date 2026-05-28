
<template>
  <div class="reset-wrapper">
    <!-- Background -->
    <div class="bg-circle bg-one"></div>
    <div class="bg-circle bg-two"></div>

    <div class="reset-card">
      <!-- Back -->
      <button class="back-btn" @click="router.back()">
        <i class="bi bi-chevron-left"></i>
      </button>

      <!-- Icon -->
      <div class="icon-wrapper">
        <div class="icon-circle">
          <i class="bi bi-person-lock"></i>
        </div>
      </div>

      <!-- Title -->
      <h1 class="title">កំណត់ពាក្យសម្ងាត់ថ្មី</h1>

      <!-- Description -->
      <p class="description">សូមបញ្ចូលពាក្យសម្ងាត់ថ្មីរបស់អ្នក</p>

      <!-- Form -->
      <form class="reset-form" @submit.prevent="submitForm">
        <!-- Password -->
        <div class="form-group">
          <label class="form-label"> ពាក្យសម្ងាត់ថ្មី </label>

          <div class="input-wrapper">
            <!-- Icon -->
            <div class="input-icon">
              <i class="bi bi-lock"></i>
            </div>

            <!-- Input -->
            <input
              :type="showPassword ? 'password' :'text' "
              v-model="password"
              class="custom-input"
              placeholder="ពាក្យសម្ងាត់ថ្មី"
              @input="clearMessage"
            />

            <!-- Eye -->
            <button
              type="button"
              class="eye-btn"
              @click="showPassword = !showPassword"
            >
              <i
                class="bi"
                :class="showPassword ? 'bi-eye' : 'bi-eye-slash'"
              ></i>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label class="form-label"> បញ្ជាក់ពាក្យសម្ងាត់ថ្មី </label>

          <div class="input-wrapper">
            <!-- Icon -->
            <div class="input-icon">
              <i class="bi bi-lock"></i>
            </div>

            <!-- Input -->
            <input
              :type="showConfirmPassword ? 'password' :'text' "
              v-model="confirmPassword"
              class="custom-input"
              placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
              @input="clearMessage"
            />

            <!-- Eye -->
            <button
              type="button"
              class="eye-btn"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i
                class="bi"
                :class="showConfirmPassword ? 'bi-eye' : 'bi-eye-slash'"
              ></i>
            </button>
          </div>
        </div>

        <!-- Strength -->
        <div class="password-strength" v-if="password">
          <div class="strength-bar">
            <div
              class="strength-fill"
              :style="{
                width: passwordStrength + '%',
              }"
            ></div>
          </div>

          <small>
            {{ strengthText }}
          </small>
        </div>

        <!-- Error -->
        <transition name="fade">
          <small v-if="errorMessage" class="error-text">
            <i class="bi bi-exclamation-circle-fill"></i>

            {{ errorMessage }}
          </small>
        </transition>

        <!-- Success -->
        <transition name="fade">
          <small v-if="successMessage" class="success-text">
            <i class="bi bi-check-circle-fill"></i>

            {{ successMessage }}
          </small>
        </transition>

        <!-- Buttons -->
        <div class="button-group">
          <!-- Cancel -->
          <button type="button" class="cancel-btn" @click="resetForm">
            លុបចោល
          </button>

          <!-- Submit -->
          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="loading-content">
              <span class="loader"></span>

              កំពុងផ្ទៀងផ្ទាត់...
            </span>

            <span v-else> បន្ត </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/API/api";
const router = useRouter();

/* -----------------------
   STATE
----------------------- */

const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);
/* -----------------------
   STORAGE
----------------------- */
const email = localStorage.getItem("email");
const otp = localStorage.getItem("otp");
/* -----------------------
   CHECK DATA
----------------------- */
onMounted(() => {
  if (!email || !otp) {
    router.push("/forgotpassword");
  }
});
/* -----------------------
   PASSWORD STRENGTH
----------------------- */
const passwordStrength = computed(() => {
  let strength = 0;
  if (password.value.length >= 6) {
    strength += 25;
  }
  if (/[A-Z]/.test(password.value)) {
    strength += 25;
  }
  if (/[0-9]/.test(password.value)) {
    strength += 25;
  }
  if (/[^A-Za-z0-9]/.test(password.value)) {
    strength += 25;
  }
  return strength;
});
const strengthText = computed(() => {
  if (passwordStrength.value <= 25) {
    return "Weak";
  }
  if (passwordStrength.value <= 50) {
    return "Medium";
  }
  if (passwordStrength.value <= 75) {
    return "Strong";
  }
  return "Very Strong";
});

/* -----------------------
   CLEAR MESSAGE
----------------------- */
const clearMessage = () => {
  errorMessage.value = "";
  successMessage.value = "";
};

/* -----------------------
   RESET FORM
----------------------- */
const resetForm = () => {
  password.value = "";
  confirmPassword.value = "";
  clearMessage();
};
/* -----------------------
   SUBMIT FORM
----------------------- */
const submitForm = async () => {
  clearMessage();
  // Validation
  if (!password.value) {
    errorMessage.value = "សូមបញ្ចូលពាក្យសម្ងាត់";
    return;
  }
  if (password.value.length < 6) {
    errorMessage.value = "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច 6 តួ";
    return;
  }
  if (!confirmPassword.value) {
    errorMessage.value = "សូមបញ្ជាក់ពាក្យសម្ងាត់";
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "ពាក្យសម្ងាត់មិនដូចគ្នា";
    return;
  }
  try {
    
    loading.value = true;
    console.log("EMAIL:", email);
    console.log("OTP:", otp);
    const response = await api.post("/api/reset/pass", {
      email,
      otp,
      new_pass: password.value,
      new_pass_confirmation: confirmPassword.value,
    });
    console.log(response.data);
    /* SUCCESS */
    successMessage.value =
      response.data.message || "បានកំណត់ពាក្យសម្ងាត់ថ្មីរួចរាល់";
    /* CLEAR STORAGE */
    localStorage.removeItem("email");
    localStorage.removeItem("otp");
    /* RESET FORM */
    password.value = "";
    confirmPassword.value = "";
    router.push("/login");
    /* GO LOGIN */
    // setTimeout(() => {
    // }, 2000);
  } catch (err) {
    console.log(err);
    // Timeout
    if (err.code === "ECONNABORTED") {
      errorMessage.value = "Request timeout";
    }
    // API Error
    else if (err.response) {
      errorMessage.value = err.response.data.message || "Reset password failed";
    }
    // No Response
    else if (err.request) {
      errorMessage.value = "Server មិនឆ្លើយតប";
    }
    // Other Error
    else {
      errorMessage.value = err.message;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* Wrapper */
.reset-wrapper {
  width: 100%;
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: "Kantumruy Pro", sans-serif;
}
/* Card */
.reset-card {
  width: 100%;
  max-width: 560px;
  background: white;
  border-radius: 30px;
  border: 2px solid #dddddd;
  padding: 35px 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
/* Back */
.back-btn {
  border: none;
  background: transparent;
  font-size: 40px;
  color: #333;
  cursor: pointer;
  transition: 0.3s;
}
.back-btn:hover {
  transform: translateX(-4px);
}
/* Icon */
.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-top: -10px;
}
.icon-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #4d6cf0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 20px rgba(77, 108, 240, 0.25);
}
.icon-circle i {
  color: white;
  font-size: 50px;
}
/* Title */
.title {
  text-align: center;
  font-size: 46px;
  font-weight: 700;
  color: #111;
  margin-top: 40px;
}
/* Description */
.description {
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 15px;
}
/* Form */
.reset-form {
  margin-top: 45px;
}
/* Group */
.form-group {
  margin-bottom: 28px;
}
/* Label */
.form-label {
  display: block;
  font-size: 22px;
  font-weight: 500;
  color: #222;
  margin-bottom: 14px;
}
/* Input Wrapper */
.input-wrapper {
  width: 100%;
  height: 65px;
  border: 2px solid #d8d8d8;
  border-radius: 16px;
  background: white;
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: 0.3s;
}
.input-wrapper:focus-within {
  border-color: #4d6cf0;
  box-shadow: 0 0 0 4px rgba(77, 108, 240, 0.1);
}
/* Icon */
.input-icon {
  width: 60px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  font-size: 20px;
}
/* Input */
.custom-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 18px;
  color: #222;
  background: transparent;
  font-family: "Kantumruy Pro", sans-serif;
}
.custom-input::placeholder {
  color: #999;
}
/* Eye */
.eye-btn {
  width: 60px;
  height: 100%;
  border: none;
  background: transparent;
  color: #777;
  font-size: 20px;
  /* cursor: pointer; */ 
}
/* Error */
.error-text {
  display: block;
  color: #e53935;
  font-size: 15px;
  margin-top: -10px;
}
/* Success */
.success-text {
  display: block;
  color: #2e7d32;
  font-size: 15px;
  margin-top: -10px;
}
/* Button Group */
.button-group {
  display: flex;
  gap: 20px;
  margin-top: 45px;
}
/* Buttons */
.cancel-btn,
.submit-btn {
  flex: 1;
  height: 58px;
  border: none;
  border-radius: 14px;
  background: #4d6cf0;
  color: white;
  font-size: 22px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
  font-family: "Kantumruy Pro", sans-serif;
}
.cancel-btn:hover,
.submit-btn:hover {
  background: #3d5ee6;
}
.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
/* ========================= */
/* Responsive */
/* ========================= */

@media (max-width: 768px) {
  .reset-card {
    padding: 30px 25px;
    border-radius: 24px;
  }
  .icon-circle {
    width: 90px;
    height: 90px;
  }
  .icon-circle i {
    font-size: 40px;
  }
  .title {
    font-size: 34px;
  }
  .description {
    font-size: 16px;
  }
  .form-label {
    font-size: 18px;
  }
  .custom-input {
    font-size: 16px;
  }
  .button-group {
    flex-direction: column;
  }
  .cancel-btn,
  .submit-btn {
    width: 100%;
    font-size: 18px;
  }
}
@media (max-width: 480px) {
  .reset-wrapper {
    padding: 15px;
  }
  .reset-card {
    padding: 25px 18px;
  }
  .title {
    font-size: 28px;
  }
  .description {
    font-size: 14px;
  }
  .input-wrapper {
    height: 58px;
  }
  .cancel-btn,
  .submit-btn {
    height: 54px;
    font-size: 16px;
  }
}
</style>
