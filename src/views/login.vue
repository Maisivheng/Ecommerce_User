<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow p-4" style="width: 450px;">
        <h1 class=" text-center fs-2">សូមស្វាគមន៍មកវិញ</h1>
        <h4 class="text-center mb-4 fs-5">ចូលគណនីរបស់អ្នក</h4>
            <form @submit.prevent="loginForm" class=" mb-2">
                <div class="mb-3">
                    <label class="form-label">អុីមែល</label>
                    <input type="email" class="form-control" placeholder="បញ្ចូលអុីមែល" v-model="form.email">
                </div>
                <div class="mb-3">
                    <label class="form-label">ពាក្យសម្ងាត់</label>
                    <input type="password" class="form-control" placeholder="បញ្ចូលពាក្យសម្ងាត់" v-model="form.password">
                </div>
                <button type="submit" class="btn btn-primary w-100">ចូលគណនី</button>
                <div class="mb-3">
                    <input class=" form-check-input" type="checkbox" name="" id=""> ចងចាំ
                    <<router-link  to="/forgotpassword" class="text-dark"  style=" margin-left: 58px;">ភ្លេចពាក្យសម្ងាត់</router-link>
                </div>
                <a class="text-center text-dark">មិនមានគណនី?<span class=" text-primary">បង្កើតគណនី</span> </a>
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