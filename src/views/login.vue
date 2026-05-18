<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow p-4" style="width: 350px;">
        <h3 class="text-center mb-4">Login</h3>
            <form @submit.prevent="loginForm" class=" mb-2">
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" placeholder="Enter email" v-model="form.email">
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" placeholder="Enter password" v-model="form.password">
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
                <div class="d-felx py-2">
                    <input type="checkbox" class=" form-check-input" name="" id=""> remember me
                    <a href="" class="text-dark"  style=" margin-left: 58px;">Forgot Password</a>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import {reactive} from 'vue';
    import router from '@/router';
    import { useRoute } from 'vue-router';
    import { useauthStore } from '@/stores/auth';
    let auth = useauthStore();
    let form = reactive ({
        email: '',
        password: ''
    })

    const loginForm = async() => {   
        // console.log(email.value);
        // console.log(password.value);
        await auth.login(form);
        router.push('/')
    }
    
    


</script>