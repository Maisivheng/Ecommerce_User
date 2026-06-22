<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
        <div class="container d-flex justify-content-between">

            <router-link to="/" class="navbar-brand fw-bold fs-4 text-primary">
                ពិភពទំនិញ
            </router-link>

            <ul class="navbar-nav flex-row justify-content-end align-items-center gap-lg-4 mt-3 mt-lg-0">
                <li class="nav-item d-flex justify-content-center align-items-center gap-lg-3 my-3 my-lg-0">
                    <router-link to="/shop-page" class="btn btn-outline-primary rounded-pill px-3 nav-hover" active-class="active-nav">
                        <i class="bi bi-cart me-1"></i> ទិញ
                        </router-link>

                    <router-link to="/sellPage" class="btn btn-outline-primary rounded-pill px-3 nav-hover" active-class="active-nav">
                        <i class="bi bi-shop me-1"></i> លក់
                        </router-link>
                </li>
                    
                <li class="nav-item d-flex justify-content-center gap-lg-2 my-3 my-lg-0">
                            <router-link to="/" class="nav-link">
                                ទំព័រដើម
                            </router-link>

                            <router-link to="/contactUS" class="nav-link">
                                ទំនាក់ទំនង
                            </router-link>
                        </li>

                <li class="nav-item d-flex align-items-center justify-content-end gap-lg-2 ms-lg-5 w-30">
                    <router-link to="/addtoCart" class="nav-link rounded-4 position-relative px-2 py-0 me-1">
                        <i class="bi bi-cart3"></i>
                        <!-- <span v-if="totalCartItems > 0" class="badge rounded-pill bg-danger position-absolute bottom-25 start-100 translate-middle" style="font-size: 0.6rem;">
                            {{ totalCartItems }}
                        </span> -->
                        <span v-if="auth.token || totalCartItems > 0" class="badge rounded-pill bg-danger position-absolute bottom-25 start-100 translate-middle" style="font-size: 0.6rem;">
                            {{ totalCartItems }}
                        </span>
                        <small v-else>ទទេ</small>
                    </router-link>

                    <!-- <router-link to="" @click="showHide()"
                        :class="{ 'text-primary': isSearchOpen }"
                        :style="{ color: isSearchOpen ? primary : '#1f2937' }">
                        <i class="bi bi-search"></i>
                    </router-link> -->

                    <a v-if="isLogin" @click.prevent="`isSearchOpen = true`" 
                        class="nav-link d-flex align-items-start text-decoration-none">
                        <img :src="avatarUrl" class="profile-img"/>
                        <ul class="dropdown">
                            <li class="dropdown-item mb-2">
                                <router-link to="/profile" class="dropdown-link text-decoration-none">មើលប្រវត្តិរូប</router-link>
                            </li >

                            <li class="dropdown-item"> 
                                <a href="#" @click.prevent.stop="handleLogout" class="dropdown-link text-decoration-none">ចាកចេញ<i class="bi bi-box-arrow-right ms-1"></i></a>
                            </li>
                        </ul>
                    </a>

                    <button v-else @click="gotoLogin"  class="btn btn-outline-primary rounded-pill px-4">
                        ចូលគណនី
                    </button>
                </li>
            </ul>
        </div>
    </nav>

    <!-- <div class="search d-flex" v-if="isSearchOpen">
        <div class="search-container-wrapper d-flex gap-2 m-50">
            <div class="search-wrapper">
                <i class="bi bi-search"></i>
                <input type="text" class="search-input" placeholder="ស្វែងរក" v-model="search">
                <button @click="CancelInput" class="btn-sm border-0">
                    <i class="bi bi-x-lg black rounded-pill"></i>
                </button>               
            </div>
            <button class="btn m-auto btn-cancel" @click="Hide()">បោះបង់</button>
        </div>
    </div> -->

    <div class="modal" tabindex="-1" :class="{ 'show': showLogoutModal }" 
        :style="{ display: showLogoutModal ? 'block' : 'none', backgroundColor: showLogoutModal ? 'rgba(0,0,0,0.5)' : 'transparent' }"
         @click.self="cancelLogout">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">ចាកចេញពីគណនី</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="cancelLogout"></button>
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
</template>
<script setup>
    import { useProductStore } from '@/stores/products';
    import { useProfileStore } from '@/stores/profile';
    import { useauthStore } from '@/stores/auth';
    import { RouterLink, useRouter} from 'vue-router'
    import { onMounted, ref, watch, computed } from 'vue';
    import { storeToRefs } from 'pinia'; 
    // 🛠️ សម្អាត៖ ទុកការ Import តែម្តងគត់នៅខាងលើ និងលុបការប្រកាសបាតកូដចោល
    import { useCart } from '@/stores/addToCart';
    // ស្វែងរកផ្នែក onMounted ក្នុង Navbar.vue រួចកែដូចខាងក្រោម៖
    onMounted(async () => {// ទាញយកទិន្នន័យផលិតផល
        // await productStore.fetchProduct();
        
        // 🛠️ បន្ថែមថ្មី៖ ទាញយកទិន្នន័យកន្ត្រកទំនិញពី API/LocalStorage មកបង្ហាញលើ Badge
        if (cartStore.fetchCartItems) {
            await cartStore.fetchCartItems();
        }
    });
    let auth = useauthStore();
    const {token} = storeToRefs(auth)
    let Token = ref(token);
    const cartStore = useCart();
    const { totalCartItems } = storeToRefs(cartStore);
    let isLogin = ref(null||localStorage.getItem('token'))

    //////get profile image
    const profileStore = useProfileStore();
    const avatarUrl = computed(() => {
        return profileStore ? profileStore.avatarUrl : ''; 
    });
    
    /////////////log out///////////////
    const showLogoutModal = ref(false);
    const router = useRouter();
    const handleLogout = () => {
        showLogoutModal.value = true;
    }
    const confirmLogout = async() => {
        await auth.Logout();
        showLogoutModal.value = false;
        isLogin.value = localStorage.getItem('token'); 
    }

    const cancelLogout = () => {
        showLogoutModal.value = false;
    }
    // const router = useRouter();
    const gotoLogin = ()=>{
        router.push("/login");
    };
</script>
<style>
    .profile-img {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #0d6efd;
    }

    /* ចំនួនទំនិញ */
    .nav-item .item{
        border-radius: 100%;
        font-size: 16px;
        color: #b00e0e;
        transform: translate(10px, -190%);
    }
    .nav-link .dropdown{
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
    .nav-link:hover .dropdown
    {
        transform: translate(-10%, 30px);
        opacity: 1;
        visibility: visible;
    } 
    
    .nav-item .nav-dropdown{
        padding: 10px 15px;
        background-color: #e3eaf4;
        border-radius: 8px;
        position: absolute;
        transform: translate(10%, -130%);

        box-shadow: 1px 1px 9px #908f8f;
        opacity: 0;
        visibility: hidden;
        transition: 0.8s;
    }
    .nav-item:hover .nav-dropdown{
        transform: translate(-10%, -130%);
        opacity: 1;
        visibility: visible;
    }

    .dropdown-link{
        font-size: 15px !important;
        font-weight: 450;
        color: var(--text-dark);
        transition: color 0.2s ease;
    }

    .dropdown-link:hover{
        color: #0e65ef;
    }
</style>
