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
            await auth.login(form);
            router.push('/');
    }

</script>
