<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
        <div class="container d-flex justify-content-between">

            <!-- Logo -->
            <router-link to="/" class="navbar-brand fw-bold fs-4 text-primary">
                ពិភពទំនិញ
            </router-link>

            <!-- Navbar -->
            <ul class="collapse navbar-collapse navbar-nav justify-content-end align-items-center gap-lg-4 mt-3 mt-lg-0">
                <!-- Buy / Sell -->
                <li class="nav-item d-flex justify-content-center align-items-center gap-lg-3 my-3 my-lg-0">
                    <router-link to="/ContactUS" class="btn btn-outline-primary rounded-pill px-3"
                        :class="{ 'bg-primary active': $route.path === '/ContactUS' }">
                        <i class="bi bi-bag-check me-1"></i>
                        ទិញ
                    </router-link>

                    <router-link to="/sell" class="btn btn-outline-primary rounded-pill px-3">
                        <i class="bi bi-shop me-1"></i>
                        លក់
                    </router-link>
                
                    <li class="d-flex justify-content-center gap-lg-2 my-3 my-lg-0">
                        <router-link to="/" class="nav-link">
                            ទំព័រដើម
                        </router-link>

                        <router-link to="/contactUS" class="nav-link">
                            ទំនាក់ទំនង
                        </router-link>
                    </li>
                </li>

                <!-- Right Side -->
                <li class="nav-item d-flex align-items-center justify-content-end gap-lg-2 ms-lg-5 w-30">
                    <!-- Cart -->
                    <router-link to="/cart" class="nav-link">
                        <i class="bi bi-cart3"></i>
                    </router-link>

                    <!-- search -->
                    <router-link to="" @click="showHide()"
                        :class="{ 'text-primary': isSearchOpen }"
                        :style="{ color: isSearchOpen ? primary : '#1f2937' }">
                        <i class="bi bi-search"></i>
                    </router-link>

                    <div v-if="auth.token" @click.prevent="`isSearchOpen = true`" 
                        class="nav-link d-flex align-items-start">
                        <img :src="imagePreview" class="profile-img mb-1"/>
                        <ul class="dropdown">
                            <li class="dropdown-item mb-2">
                                <router-link to="/profile" class="dropdown-link text-decoration-none">មើលប្រវត្តិរូប</router-link>
                            </li>

                            <li class="dropdown-item"> 
                                <router-link @click="handleLogout" class="dropdown-link text-decoration-none">ចាកចេញ<i class="bi bi-box-arrow-right ms-1"></i></router-link>
                            </li>
                        </ul>
                    </div>

                    <!-- Login -->
                    <router-link v-else to="/login" class="btn btn-outline-primary rounded-pill px-4">
                        Login
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
    
    <div class="modal" tabindex="-1" v-if="showLogoutModal" @click.self="cancelLogout">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">ចាកចេញពីគណនី</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>តើអ្នកពិតជាចង់ចាកចេញពីកម្មវិធីមែនទេ?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelLogout">បោះបង់</button>
                <button type="button" class="btn btn-primary" @click="confirmLogout">ចាកចេញ</button>
            </div>
            </div>
        </div>
    </div>

    <div class="search d-flex" v-if="isSearchOpen">
        <div class="search-container-wrapper d-flex gap-2 m-auto">
            <div class="search-wrapper">
                <i class="bi bi-search"></i>
                <input type="text" class="search-input" placeholder="ស្វែងរក" v-model="search">
                <i class="bi bi-x-lg black rounded-pill"></i>
            </div>
            <button class="btn m-auto btn-cancel" @click="Hide()">បោះបង់</button>
        </div>
    </div>

    <!-- respone screen -->
    <div class="aeon-bottom-nav navbar">
        <router-link to="/" class="nav-item">
            <i class="bi bi-house-door"></i>
            <!-- <span>ទំព័រដើម</span> -->
        </router-link>
        
        <router-link to="/" class="nav-item">
            <i class="bi bi-bag-check"></i>
            <!-- <span>ទិញ</span> -->
        </router-link>

        <router-link to="/" class="nav-item">
            <i class="bi bi-shop"></i>
            <!-- <span>លក់</span> -->
        </router-link>

        <router-link to="/" class="nav-item">
            <i class="bi bi-cart3"></i>
            <!-- <span>កន្ត្រក</span> -->
        </router-link>

        <router-link to="" @click="showHide()" class="nav-item"
            :class="{ 'text-primary': isSearchOpen }"
            :style="{ color: isSearchOpen ? primary : '#1f2937' }">
            <i class="bi bi-search"></i>
        </router-link>

        <div v-if="auth.token" @click.prevent="`isSearchOpen = true`" 
            class="nav-item d-flex align-items-start">
            <img :src="imagePreview" class="profile-img mb-1"/>
            <ul class="dropdown">
                <li class="dropdown-item mb-2">
                    <router-link to="/profile" class="dropdown-link text-decoration-none">មើលប្រវត្តិរូប</router-link>
                </li>

                <li class="dropdown-item"> 
                    <router-link @click="handleLogout" class="dropdown-link text-decoration-none">ចាកចេញ<i class="bi bi-box-arrow-right ms-1"></i></router-link>
                </li>
            </ul>
        </div>

        <!-- Login -->
        <router-link v-else to="/login" class="btn btn-outline-primary rounded-pill nav-item px-4">
            Login
        </router-link>
    </div>
</template>

<script setup>
    import { storeToRefs } from 'pinia'; // ជួយរក្សាភាព Reactive ពេលទាញយក state មកប្រើ
    import { RouterLink } from 'vue-router'
    import { useProductStore } from '@/stores/products';
    import { useProfileStore } from '@/stores/profile';
    import { useauthStore } from '@/stores/auth';
    import { onMounted, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    let auth = useauthStore();
    let isSearchOpen = ref(false);

    /////Show and Hide btn search
    function showHide(){
        // isShow.value = false;//dosen't use ref again bc it already use
        isSearchOpen.value = !isSearchOpen.value;
    }
    const isFocused = ref(false)
    function Hide(){
        isSearchOpen.value = false;
    }


    ///////Search Product
    let productStore = useProductStore();
    let search = ref('');
    console.log(search.value);
    watch(search, async(value) => {
        console.log(search.value);
        await productStore.fetchProduct({search : value});
    })

    //////get profile image
    const profileStore = useProfileStore();
    // 1. ចាប់យកឈ្មោះ imagePreview ឱ្យត្រូវនឹងឈ្មោះនៅក្នុង Store ផ្ទាល់តែម្តង
    let { imagePreview } = storeToRefs(profileStore);


    onMounted(async () => {
        await productStore.fetchProduct();
        await profileStore.getProfile();
    });


    /////////////log out///////////////
    const router = useRouter();
    const showLogoutModal = ref(false);

    const handleLogout = () => {
        showLogoutModal.value = true;
    }

    const confirmLogout = () => {
        auth.Logout();
        showLogoutModal.value = false;
        router.push('/login');
    }

    const cancelLogout = () => {
        showLogoutModal.value = false;
    }
</script>

<style>
    .profile-img {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #0d6efd;
    }

    .dropdown{
        padding: 10px 15px;
        background-color: #e3eaf4;
        border-radius: 8px;
        position: absolute;
        transform: translateY(35px);

        box-shadow: 1px 1px 9px #908f8f;
        opacity: 0;
        visibility: hidden;
        transition: 0.8s;
    }
    .nav-link:hover .dropdown{
        transform: translateY(30px);
        opacity: 1;
        visibility: visible;
    }

    .dropdown .dropdown-link{
        /* font-size: 17px !important; */
        font-weight: 500;
        color: var(--text-dark);
        transition: color 0.2s ease;
    }

    .dropdown .dropdown-link:hover{
        color: #0e65ef;
    }
</style>