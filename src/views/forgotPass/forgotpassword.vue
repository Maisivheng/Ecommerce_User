
<template>
  <div class="forgot-wrapper">
    <!-- Background -->
    <div class="bg-circle bg-one"></div>
    <div class="bg-circle bg-two"></div>

    <div class="forgot-card">
      <!-- Back Button -->
      <button class="back-btn" @click="goLogin">
        <i class="bi bi-chevron-left"></i>
      </button>

      <!-- Icon -->
      <div class="icon-box">
        <div class="icon-circle">
          <i class="bi bi-question-lg"></i>
        </div>
      </div>
      <!-- Title -->
      <h1 class="title">ភ្លេចពាក្យសម្ងាត់</h1>

      <!-- Description -->
      <p class="description">
        សូមបញ្ចូលអ៊ីមែលរបស់អ្នក ដើម្បីទទួលបាន ការកំណត់ពាក្យសម្ងាត់ថ្មី
      </p>

      <!-- Form -->
      <form class="forgot-form" @submit.prevent="submitForm">
        <!-- Email -->
        <div class="form-group">
          <label class="form-label"> អ៊ីមែល </label>

          <div class="input-wrapper">
            <!-- Icon -->
            <div class="input-icon">
              <i class="bi bi-envelope"></i>
            </div>

            <!-- Input -->
            <input
              type="email"
              v-model="email"
              class="custom-input"
              placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក"
              @input="clearMessage"
            />
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
        </div>

        <!-- Button -->
        <button type="submit" class="submit-btn" :disabled="loading">
          <!-- Loading -->
          <span v-if="loading" class="loading-content">
            <span class="loader"></span>

            កំពុងផ្ញើ...
          </span>

          <!-- Normal -->
          <span v-else> បន្ត </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>

import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/API/api";

/* -----------------------
   ROUTER
----------------------- */
const router = useRouter();
/* -----------------------
   GO LOGIN
----------------------- */
const goLogin = () => {
  router.push({
    path: "/login",
  });
};
/* -----------------------
   STATES
----------------------- */
const email = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);
/* -----------------------
   CLEAR MESSAGE
----------------------- */

const clearMessage = () => {
  errorMessage.value = "";
  successMessage.value = "";
};
/* -----------------------
   SUBMIT FORM
----------------------- */
const submitForm = async () => {
  clearMessage();
  // Validation
  if (!email.value) {
    errorMessage.value = "សូមបញ្ចូលអ៊ីមែល";
    return;
  }
  // Email Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.value)) {
    errorMessage.value = "អ៊ីមែលមិនត្រឹមត្រូវ";

    return;
  }

  try {
    loading.value = true;

    const response = await api.post("/api/forgot/pass", {
      email: email.value,
    });

    console.log(response.data);

    // Save Email
    localStorage.setItem("email", email.value);

    // Success
    successMessage.value = response.data.message || "OTP sent successfully";

    // Redirect OTP
    setTimeout(() => {
      router.push("/verityOtp");
    }, 1500);
  } catch (err) {
    console.log(err);

    // Timeout
    if (err.code === "ECONNABORTED") {
      errorMessage.value = "Request timeout";
    }

    // API Error
    else if (err.response) {
      errorMessage.value = err.response.data.message || "Something went wrong";
    }

    // Server Error
    else if (err.request) {
      errorMessage.value = "Server not responding";
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
/* @import url("https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap"); */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* Main Wrapper */
.forgot-wrapper {
  width: 100%;
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  font-family: "Kantumruy Pro", sans-serif;
}

/* Card */
.forgot-card {
  width: 90%;
  max-width: 450px;
  min-height: 550px;
  background: #ffffff;
  border-radius: 30px;
  border: 2px solid #dddddd;
  padding: 35px 45px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
/* Back Button */
.back-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  font-size: 30px;
  color: #333333;
  cursor: pointer;
  transition: 0.3s;
}
.back-btn:hover {
  transform: translateX(-4px);
}
/* Icon */
.icon-box {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: -10px;
}
.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #4d6cf0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 20px rgba(77, 108, 240, 0.25);
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
  color: #111111;
  margin-top: 45px;
}
/* Description */
.description {
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
  color: #666666;
  margin-top: 18px;
}
/* Form */
.forgot-form {
  margin-top: 40px;
}
/* Form Group */
.form-group {
  width: 100%;
}
/* Label */
.form-label {
  display: block;
  font-size: 16px;
  font-weight: 400;
  color: #222222;
  margin-bottom: 10px;
}
/* Input Wrapper */
.input-wrapper {
  width: 100%;
  height: 50px;
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
  color: #888888;
  font-size: 16px;
}
/* Input */
.custom-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: #222222;
  padding-right: 18px;
  font-family: "Kantumruy Pro", sans-serif;
}
.custom-input::placeholder {
  color: #999999;
}
/* Error */
.error-text {
  display: block;
  color: #e53935;
  margin-top: 10px;
  font-size: 12px;
}
/* Submit Button */
.submit-btn {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 10px;
  background: #4d6cf0;
  color: white;
  font-size: 18px;
  font-weight: 400;
  display: block;
  margin: 30px auto 0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Kantumruy Pro", sans-serif;
  box-shadow: 0 10px 20px rgba(77, 108, 240, 0.2);
}
.submit-btn:hover {
  background: #3d5ee6;
  transform: translateY(-2px);
}
.submit-btn:active {
  transform: scale(0.98);
}
/* Responsive */
@media (max-width: 768px) {
  .forgot-card {
    padding: 30px 25px;
    min-height: auto;
  }
  .title {
    font-size: 38px;
  }
  .description {
    font-size: 16px;
  }
  .form-label {
    font-size: 22px;
  }
  .submit-btn {
    width: 100%;
  }
  .icon-circle {
    width: 95px;
    height: 95px;
  }
}
</style>
