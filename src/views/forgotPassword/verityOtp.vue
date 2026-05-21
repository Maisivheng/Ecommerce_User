<template>
  <div class="otp-wrapper">
    <div class="otp-card">
      <!-- Back -->
      <div class="back-btn">
        <i class="bi bi-chevron-left"></i>
      </div>

      <!-- Icon -->
      <div class="icon-wrapper">
        <div class="icon-circle">
          <i class="bi bi-envelope"></i>
        </div>
      </div>

      <!-- Title -->
      <h1 class="title">លេខកូដផ្ទៀងផ្ទាត់ OTP</h1>

      <!-- Description -->
      <p class="description">លេខកូដត្រូវបានផ្ញើទៅកាន់ *****12345</p>

      <!-- OTP Inputs -->
      <div class="otp-inputs">
        <input type="text" maxlength="1" value="l" />
        <input type="text" maxlength="1" value="K" />
        <input type="text" maxlength="1" value="O" />
        <input type="text" maxlength="1" value="9" />
        <input type="text" maxlength="1" value="R" />
        <input type="text" maxlength="1" value="2" />
      </div>

      <!-- Button -->
      <button class="verify-btn">ផ្ទៀងផ្ទាត់</button>

      <!-- Resend -->
      <p class="resend-text">បញ្ជូនម្តងទៀត</p>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
/* Google Font */
@import url("https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@300;400;500;600;700&display=swap");
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
  width: 600px;
  height: 850px;
  background: white;
  border-radius: 30px;
  border: 2px solid #d9d9d9;
  padding: 35px 45px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
/* Back */
.back-btn {
  font-size: 45px;
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
  margin-top: -5px;
}
.icon-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #4d6cf0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-circle i {
  color: white;
  font-size: 48px;
}
/* Title */
.title {
  text-align: center;
  font-size: 52px;
  font-weight: 700;
  margin-top: 45px;
  color: #111;
}
/* Description */
.description {
  text-align: center;
  font-size: 25px;
  color: #555;
  margin-top: 45px;
}
/* OTP Inputs */
.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 55px;
}
.otp-inputs input {
  width: 72px;
  height: 86px;
  border-radius: 10px;
  border: 2px solid #d5dbe3;
  background: #eef2f6;
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  color: #111;
  outline: none;
  font-family: "Kantumruy Pro", sans-serif;
}
/* Button */
.verify-btn {
  width: 230px;
  height: 62px;
  background: #4d6cf0;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 24px;
  display: block;
  margin: 60px auto 0;
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
  font-size: 24px;
  color: #333;
  cursor: pointer;
  font-family: "Kantumruy Pro", sans-serif;
}
</style>
