<template>
  <div class="signup-container">
    <div class="signup-card">
      <div class="signup-header">
        <h1>បង្កើតគណនី</h1>
        <p class="subtitle">
          បញ្ចូលទិន្នន័យផ្ទាល់ខ្លួនដើម្បីបង្កើតគណនីរបស់អ្នក
        </p>
      </div>

      <form @submit.prevent="handleSignup" class="signup-form">
        <div class="form-group" :class="{ 'has-error': errors.name }">
          <label>ឈ្មោះពេញ</label>
          <div class="input-icon-wrapper">
            <i class="bi bi-person-fill input-icon-left"></i>
            <input
              type="text"
              v-model="form.name"
              placeholder="ឈ្មោះពេញរបស់អ្នក"
              @blur="validateField('name')"
              :disabled="loading"
            />
          </div>
          <span v-if="errors.name" class="error-message">
            <i class="bi bi-exclamation-circle-fill"></i> {{ errors.name }}
          </span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label>អុីមែល</label>
          <div class="input-icon-wrapper">
            <i class="bi bi-envelope-fill input-icon-left"></i>
            <input
              type="email"
              v-model="form.email"
              placeholder="បញ្ចូលអុីមែល"
              @blur="validateField('email')"
              :disabled="loading"
            />
          </div>
          <span v-if="errors.email" class="error-message">
            <i class="bi bi-exclamation-circle-fill"></i> {{ errors.email }}
          </span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.password }">
          <label>ពាក្យសម្ងាត់</label>
          <div class="input-icon-wrapper password-field">
            <i class="bi bi-lock-fill input-icon-left"></i>
            <input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="form.password"
              placeholder="បញ្ចូលពាក្យសម្ងាត់"
              @blur="validateField('password')"
              :disabled="loading"
            />
            <button
              type="button"
              class="toggle-password"
              @click="passwordVisible = !passwordVisible"
              :disabled="loading"
            >
              <i
                :class="
                  passwordVisible ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'
                "
              ></i>
            </button>
          </div>
          <span v-if="errors.password" class="error-message">
            <i class="bi bi-exclamation-circle-fill"></i> {{ errors.password }}
          </span>
        </div>

        <div
          class="form-group"
          :class="{ 'has-error': errors.password_confirmation }"
        >
          <label>បញ្ជាក់ពាក្យសម្ងាត់</label>
          <div class="input-icon-wrapper password-field">
            <i class="bi bi-check-circle-fill input-icon-left"></i>
            <input
              :type="confirmVisible ? 'text' : 'password'"
              v-model="form.password_confirmation"
              placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
              @blur="validateField('password_confirmation')"
              :disabled="loading"
            />
            <button
              type="button"
              class="toggle-password"
              @click="confirmVisible = !confirmVisible"
              :disabled="loading"
            >
              <i
                :class="
                  confirmVisible ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'
                "
              ></i>
            </button>
          </div>
          <span v-if="errors.password_confirmation" class="error-message">
            <i class="bi bi-exclamation-circle-fill"></i>
            {{ errors.password_confirmation }}
          </span>
        </div>

        <div class="terms-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formaccept.acceptTerms"
              :disabled="loading"
            />
            <span>ខ្ញុំយល់ព្រមតាម</span>
            <span class="terms-link" @click.prevent="showTermsModal = true"
              >លក្ខខណ្ឌ</span
            >
            <span>របស់គេហទំព័រ</span>
          </label>
          <span v-if="errors.acceptTerms" class="error-message terms-error">
            <i class="bi bi-exclamation-circle-fill"></i>
            {{ errorsaccept.acceptTerms }}
          </span>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="!loading">បង្កើតគណនី</span>
          <i v-if="!loading" class="bi bi-arrow-right"></i>
          <span v-if="loading" class="loading-spinner"></span>
          <span v-if="loading">កំពុងដំណើរការ...</span>
        </button>

        <div class="signin-link">
          <span>មានគណនីរួចហើយ?</span>
          <RouterLink to="/login">ចូលគណនី</RouterLink>
        </div>
      </form>
    </div>

    <div
      v-if="showTermsModal"
      class="modal-overlay"
      @click.self="showTermsModal = false"
    >
      <div class="modal-content">
        <h3><i class="bi bi-file-text-fill"></i> លក្ខខណ្ឌប្រើប្រាស់</h3>
        <p>
          ដោយការបង្កើតគណនី អ្នកយល់ព្រមគោរពតាមគោលការណ៍ឯកជនភាព
          និងលក្ខខណ្ឌសេវាកម្មរបស់យើង។
          អ្នកទទួលខុសត្រូវចំពោះរាល់សកម្មភាពដែលកើតឡើងលើគណនីរបស់អ្នក។
        </p>
        <button class="modal-close" @click="showTermsModal = false">
          <i class="bi bi-check-lg"></i> យល់ព្រម
        </button>
      </div>
    </div>

    <div v-if="toast.message" class="toast" :class="toast.type">
      <i
        :class="
          toast.type === 'error'
            ? 'bi bi-x-circle-fill'
            : 'bi bi-check-circle-fill'
        "
      ></i>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useauthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useauthStore()
const router = useRouter()
const loading = ref(false)
const passwordVisible = ref(false)
const confirmVisible = ref(false)
const showTermsModal = ref(false)

const form = reactive({
  email: '',
  name: '',
  password: '',
  password_confirmation: '',
})
const errors = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})


const formaccept = reactive({
  acceptTerms: false
})

const errorsaccept = reactive({
  acceptTerms: ''
})

const toast = reactive({
  message: '',
  type: 'success'
})

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  setTimeout(() => {
    toast.message = ''
  }, 3000)
}

const validateField = (field) => {
  switch (field) {
    case 'name':
      if (!form.name) {
        errors.name = 'សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក'
      } else if (form.name.length < 2) {
        errors.name = 'ឈ្មោះត្រូវមានយ៉ាងហោចណាស់ 2 តួអក្សរ'
      } else {
        errors.name = ''
      }
      break
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = 'សូមបញ្ចូលអុីមែលរបស់អ្នក'
      } else if (!emailRegex.test(form.email)) {
        errors.email = 'សូមបញ្ចូលអុីមែលឲ្យបានត្រឹមត្រូវ'
      } else {
        errors.email = ''
      }
      break
    case 'password':
      if (!form.password) {
        errors.password = 'សូមបញ្ចូលពាក្យសម្ងាត់'
      } else if (form.password.length < 8) {
        errors.password = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 8 តួអក្សរ'
      } else {
        errors.password = ''
      }
      // Also validate password confirmation if it exists
      if (form.password_confirmation) {
        validateField('password_confirmation')
      }
      break
    case 'password_confirmation':
      if (!form.password_confirmation) {
        errors.password_confirmation = 'សូមបញ្ជាក់ពាក្យសម្ងាត់របស់អ្នក'
      } else if (form.password !== form.password_confirmation) {
        errors.password_confirmation = 'ពាក្យសម្ងាត់មិនត្រូវគ្នា'
      } else {
        errors.password_confirmation = ''
      }
      break
  }
}

const validateForm = () => {
  validateField('name')
  validateField('email')
  validateField('password')
  validateField('password_confirmation')

  if (!formaccept.acceptTerms) {
    errorsaccept.acceptTerms = 'សូមយល់ព្រមតាមលក្ខខណ្ឌប្រើប្រាស់'
  } else {
    errorsaccept.acceptTerms = ''
  }
  
  return !errors.name && !errors.email && !errors.password && !errors.password_confirmation && !errorsaccept.acceptTerms
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.password = ''
  form.password_confirmation = ''
  formaccept.acceptTerms = false
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.password_confirmation = ''
  errorsaccept.acceptTerms = ''
}

const handleSignup = async () => {
  if (!validateForm()) {
    showToast('សូមបំពេញទិន្នន័យឲ្យបានត្រឹមត្រូវ', 'error')
    return
  }
  
  loading.value = true
  try {
    const success = await auth.register(form)
    if (success) {
      showToast('គណនីត្រូវបានបង្កើតដោយជោគជ័យ', 'success')
      resetForm()
      router.push('/')
    } else {
      showToast('មិនអាចបង្កើតគណនីបានទេ សូមព្យាយាមម្តងទៀត', 'error')
    }
  } catch (error) {
    console.error('Signup error:', error)
    showToast('កំហុសក្នុងការភ្ជាប់ប្រព័ន្ធ សូមព្យាយាមម្តងទៀត', 'error')
  } finally {
    loading.value = false 
  }
}

  
  // try {
  //   const success = await authStore.register(form)
  //   if (success) {
  //     alertSuccess('គណនីត្រូវបានបង្កើតដោយជោគជ័យ!')
  //     router.push('/login')
  //   } else {
  //     showToast('មិនអាចបង្កើតគណនីបានទេ សូមព្យាយាមម្តងទៀត', 'error')
  //   }
  // } catch (error) {
  //   console.error('Signup error:', error)
  //   showToast('កំហុសក្នុងការភ្ជាប់ប្រព័ន្ធ សូមព្យាយាមម្តងទៀត', 'error')
  // } finally {
  //   loading.value = false
  // }

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #ffffff;
  font-family: "Kantumruy Pro", sans-serif;
}

.signup-card {
  max-width: 520px;
  width: 100%;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  padding: 2.5rem;
  border: 1px solid #eef2f6;
}

.signup-header {
  text-align: center;
  margin-bottom: 2rem;
}

.signup-header h1 {
  font-size: 1.9rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  font-family: "Kantumruy Pro", sans-serif;
}

.subtitle {
  font-size: 0.9rem;
  color: #171818;
  line-height: 1.5;
  font-family: "Kantumruy Pro", sans-serif;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-group label {
  font-size: 18px;
  font-weight: 500;
  color: black;
  display: flex;
  align-items: center;
  font-family: "Kantumruy Pro", sans-serif;
  margin-bottom: 2px;
}

.input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon-wrapper .input-icon-left {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #8ba0bc;
  font-size: 1.1rem;
  pointer-events: none;
  transition: color 0.2s;
  z-index: 2;
}

.form-group input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.6rem;
  font-size: 0.95rem;
  font-family: "Kantumruy Pro", sans-serif;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s ease;
  outline: none;
  background: #fefefe;
}

.input-icon-wrapper.password-field input {
  padding-right: 3rem;
  padding-left: 2.6rem;
}

.form-group input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
}

.form-group input:focus + .input-icon-left {
  color: #3b82f6;
}

.form-group input:disabled {
  background: #f8fafc;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-group.has-error input {
  border-color: #ef4444;
}

.error-message {
  font-size: 12px;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: "Kantumruy Pro", sans-serif;
}

.error-message i {
  font-size: 0.65rem;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #8ba0bc;
  font-size: 1.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  z-index: 2;
}

.toggle-password:hover:not(:disabled) {
  color: #3b82f6;
}

.toggle-password:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.terms-group {
  margin: 0.25rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: #2c3e4e;
  flex-wrap: wrap;
  font-family: "Kantumruy Pro", sans-serif;
}

.checkbox-label input {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
  accent-color: #3b82f6;
}

.terms-link {
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.terms-error {
  margin-top: 0.5rem;
}

.submit-btn {
  /* background: #0f2b3d; */
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.9rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
  gap: 0.75rem;
  font-family: "Kantumruy Pro", sans-serif;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) {
  /* background: #1e3a5f; */
  background-color: #0b5ed7;
  border-color: #0a58ca;
  color: white;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.signin-link {
  text-align: center;
  font-size: 0.85rem;
  color: #5a6874;
  padding-top: 0.5rem;
  border-top: 1px solid #eef2f6;
  margin-top: 0.5rem;
  font-family: "Kantumruy Pro", sans-serif;
}

.signin-link a {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.signin-link a:hover {
  text-decoration: underline;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  max-width: 420px;
  width: 90%;
  border-radius: 28px;
  padding: 2rem;
  animation: fadeInUp 0.2s ease-out;
  font-family: "Kantumruy Pro", sans-serif;
}

.modal-content h3 {
  font-size: 1.35rem;
  color: #0f2b3d;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.modal-content h3 i {
  color: #3b82f6;
}

.modal-content p {
  color: #4a5a6a;
  line-height: 1.6;
  margin-bottom: 1.8rem;
  font-size: 0.9rem;
}

.modal-close {
  background: #0f2b3d;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  font-family: "Kantumruy Pro", sans-serif;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.modal-close:hover {
  background: #1e3a5f;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast {
  position: fixed;
  bottom: 20px;
  left: 88%;
  transform: translateX(-50%);
  padding: 12px 15px;
  border-radius: 48px;
  color: white;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 1100;
  animation: fadeInUp 0.3s ease;
  font-family: "Kantumruy Pro", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 90%;
  white-space: nowrap;
}

@media (max-width: 550px) {
  .toast {
    white-space: normal;
    text-align: center;
    padding: 10px 20px;
    max-width: 85%;
  }
}

.toast.success {
  background: #10b981;
}

.toast.error {
  background: #ef4444;
}

.toast i {
  font-size: 1.2rem;
}
</style>