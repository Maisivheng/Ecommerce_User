<template>
<<<<<<< HEAD
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow p-4" style="width: 450px;">
        <h1 class=" text-center fs-2">សូមស្វាគមន៍មកវិញ</h1>
        <h4 class="text-center mb-4 fs-5">ចូលគណនីរបស់អ្នក</h4>
            <form @submit.prevent="loginForm" class=" mb-2">
                <div class="mb-3">
                    <label class="form-label">អុីមែល</label>
                    <input type="email" class="form-control" placeholder="បញ្ចូលអុីមែល" v-model="form.email">
=======
    <div class="container min-vh-100 d-flex justify-content-center align-items-center">
        <div class="card shadow-lg border-0 rounded-5 p-4 w-100" style="max-width: 520px;">
            <div class="text-center mb-4">
                <h2 class="fw-bold">សូមស្វាគមន៍</h2>
                <p class="text-muted">ចូលគណនីរបស់អ្នក</p>
                <small>{{ form.errors.emailPassword }}</small>
            </div>
            <form @submit.prevent="loginForm">
                <div class="mb-3">
                    <label class="form-label">អុីមែល</label>
                    <input type="email" class="form-control" placeholder="បញ្ចូលអុីមែល" v-model="form.email">
                    <small class="text-danger">{{ form.errors.email }}</small>
>>>>>>> heng
                </div>
                <div class="mb-3">
                    <label class="form-label">ពាក្យសម្ងាត់</label>
                    <input type="password" class="form-control" placeholder="បញ្ចូលពាក្យសម្ងាត់" v-model="form.password">
<<<<<<< HEAD
                </div>
                <button type="submit" class="btn btn-primary w-100">ចូលគណនី</button>
                <div class="mb-3">
                    <input class=" form-check-input" type="checkbox" name="" id=""> ចងចាំ
                    <a href="" class="text-dark"  style=" margin-left: 58px;">ភ្លេចពាក្យសម្ងាត់</a>
=======
                    <small class="text-danger">{{ form.errors.password }}</small>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">  
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox">
                        <label class="form-check-label">
                            ចងចាំ
                        </label>
                    </div>
                    <a href="#" class="text-decoration-none">
                    ភ្លេចពាក្យសម្ងាត់?
                    </a>
                </div>
                <button class="btn btn-primary w-100 py-2">
                    ចូលគណនី
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
>>>>>>> heng
                </div>
                <a class="text-center text-dark">មិនមានគណនី?<span class=" text-primary">បង្កើតគណនី</span> </a>
            </form>
        </div>
    </div>
</template>

<script setup>
    import {reactive,ref} from 'vue';
    import router from '@/router';
    import { useRoute } from 'vue-router';
    import { useauthStore } from '@/stores/auth';
    let auth = useauthStore();
    let isvalid = ref(true);
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