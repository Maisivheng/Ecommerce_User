Form login

<template>
  <div class="signin-container">
    <div class="signin-card">
      <div class="signin-header">
        <h1>សូមស្វាគមន៍មកវិញ</h1>
        <p class="subtitle">ចូលគណនីរបស់អ្នក</p>
      </div>

      <form @submit.prevent="loginForm" class="signin-form">
        <div class="form-group">
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
          <small class="text-danger">{{ form.errors.email }}</small>
        </div>

        <div class="form-group">
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
            <button type="button" class="toggle-password" @click="passwordVisible = !passwordVisible" :disabled="loading">
              <i
                :class="
                  passwordVisible ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill' "></i>
            </button>
          </div>
          <small class="text-danger">{{ form.errors.password }}</small>
        </div>

        <div class="options-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" :disabled="loading" />
            <span>ចងចាំខ្ញុំ</span>
          </label>
          <router-link to="/forgotpassword" class="text-decoration-none">
            ភ្លេចពាក្យសម្ងាត់?
          </router-link>
        </div>

        <button class="btn btn-primary w-100 py-2" :disabled="loading">
            <span v-if="!loading">ចូលគណនី</span>
            <span v-if="loading" class="loading-spinner"></span>
            <span v-if="loading">កំពុងដំណើរការ...</span>
        </button>
        <div class="d-flex align-items-center text-muted my-4">
            <hr class="flex-grow-1">
            <span class="px-3">ឬបន្តជាមួយ</span>
            <hr class="flex-grow-1">
        </div>
        <div class="text-center">
            មិនទាន់មានគណនី?
            <router-link to="/register" class="text-decoration-none fw-semibold">
            បង្កើតគណនី
            </router-link>
        </div>
    </form>
      <!-- Toast Notification -->
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
  </div>
</template>

<script setup>
    import {reactive,ref} from 'vue';
    import router from '@/router';
    import { useRoute } from 'vue-router';
    import { useauthStore } from '@/stores/auth';
    let auth = useauthStore();
    const route = useRoute();
    let isvalid = ref(true);
    const loading = ref(false)
    let passwordVisible = ref(false)
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
    let form = reactive ({
        email: '',
        password: '',
        errors:{
            email: '',
            password: '',
            emailPassword: ''
        }
    })
    const validationForm =()=>{
        
        form.errors.email = '';
        form.errors.password='';
        if(!form.email){
            form.errors.email = 'សូមបញ្ចូលអុីមែលរបស់អ្នក';
            isvalid.value = false
        }
        if(!form.password){
            form.errors.password = 'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក';
            isvalid.value= false
        }
        return isvalid   
    }
    const loginForm = async() => {   
        // console.log(email.value);
        // console.log(password.value);
        if(!validationForm()) return
            loading.value = true;
              try {
                const success = await auth.login({
                  email: form.email,
                  password: form.password
                });

                if (success) {
                  showToast('ចូលគណនីបានដោយជោគជ័យ', 'success');
                  setTimeout(() => {
                    const redirect = route.query.redirect;
                    if (redirect) {
                      router.push({ name: redirect });
                    } else {
                      router.push('/');
                    }
                  }, 1000);
                } else {
                  showToast('អ៊ីមែល ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ', 'error');
                }

              } catch (error) {
                console.error(error);
                showToast('កំហុសក្នុងការភ្ជាប់ប្រព័ន្ធ', 'error');
              } finally {
                loading.value = false;
              }
            };
            // try{
            //     showToast('ចូលគណនីបានដោយជោគជ័យ', 'success')         
            //     // router.push('/')
            //     await auth.login(form)
            // }catch(error){
            //     console.err(error);
            //     showToast('កំហុសក្នុងការភ្ជាប់ប្រព័ន្ធ សូមព្យាយាមម្តងទៀត', 'error')
            // }finally{
            //   loading.value = false;
            // }
            
            // if(alert == 'Login Success'){
                // router.push('/');
            //     return true
            // }else{
            //     return false
            // }
            

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.signin-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #ffffff;
  font-family: "Kantumruy Pro", sans-serif;
}

.signin-card {
  max-width: 520px;
  width: 100%;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  padding: 2.5rem;
  border: 1px solid #eef2f6;
}

.signin-header {
  text-align: center;
  margin-bottom: 2rem;
}

.signin-header h1 {
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

.signin-form {
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

.options-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.25rem 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: #2c3e4e;
  font-family: "Kantumruy Pro", sans-serif;
}

.checkbox-label input {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
  accent-color: #3b82f6;
}

.forgot-link {
  color: #3b82f6;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  font-family: "Kantumruy Pro", sans-serif;
}

.forgot-link:hover {
  text-decoration: underline;
}

.submit-btn {
  background: #0f2b3d;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.9rem;
  border: none;
  border-radius: 40px;
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
  background: #1e3a5f;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  font-size: 0.85rem;
  color: #5a6874;
  padding-top: 0.5rem;
  border-top: 1px solid #eef2f6;
  margin-top: 0.5rem;
  font-family: "Kantumruy Pro", sans-serif;
}

.signup-link a {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.signup-link a:hover {
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
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.modal-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-family: "Kantumruy Pro", sans-serif;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  margin-bottom: 1.5rem;
}

.modal-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
}

.modal-buttons {
  display: flex;
  gap: 1rem;
}

.modal-cancel,
.modal-confirm {
  flex: 1;
  padding: 0.7rem;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  font-family: "Kantumruy Pro", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  transition: all 0.2s;
}

.modal-cancel {
  background: #f1f5f9;
  color: #475569;
}

.modal-cancel:hover {
  background: #e2e8f0;
}

.modal-confirm {
  background: #0f2b3d;
  color: white;
}

.modal-confirm:hover {
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
  padding: 10px 20px 10px 35px;
  border-radius: 50px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  z-index: 1100;
  animation: fadeInUp 0.2s ease-out;
  font-family: "Kantumruy Pro", sans-serif;
}

.toast.success {
  background: #10b981;
}

.toast.error {
  background: #ef4444;
}

@media (max-width: 550px) {
  .signin-card {
    padding: 1.5rem;
  }

  .signin-header h1 {
    font-size: 1.6rem;
  }
  
  .options-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
