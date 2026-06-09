<style scoped>
.modal-overlay,
.modal-container,
.modal-header,
.modal-body,
.modal-footer,
.btn-cancel,
.btn-confirm {
    font-family: "Kantumruy Pro", sans-serif;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-container {
    background-color: white;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    animation: slideUp 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.2s;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    color: #111827;
}

.modal-body {
    padding: 24px;
}

.modal-body p {
    margin: 0;
    font-size: 16px;
    color: #374151;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-confirm {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn-cancel {
    background-color: #f3f4f6;
    color: #374151;
}

.btn-cancel:hover {
    background-color: #e5e7eb;
}

.btn-confirm {
    background-color: #ef4444;
    color: white;
}

.btn-confirm:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Optional: Add a subtle scale effect when clicking the logout icon */
a {
    display: inline-block;
    transition: transform 0.2s;
}

/* a:hover { */
    /* transform: scale(1.1); */
/* } */
</style>

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
                <li>
                    <div class="nav-item d-flex justify-content-center align-items-center gap-lg-3 my-3 my-lg-0">
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
                    </div>
                </li>

                <!-- Right Side -->
                <li class="nav-item d-flex align-items-center justify-content-end gap-lg-2 ms-lg-5 w-30">
                    <!-- Cart -->
                    <router-link to="/addtoCart" class="nav-link px-2 py-0 rounded-4" style="background: #eff1f2;">
                        <i class="bi bi-cart3"></i>
                        <small>ចំនួន{{totalCartItems}}</small>
                    </router-link>

                    <!-- search -->
                    <router-link to="" @click="showHide()"
                        :class="{ 'text-primary': isSearchOpen }"
                        :style="{ color: isSearchOpen ? primary : '#1f2937' }">
                        <i class="bi bi-search"></i>
                    </router-link>

                    <a v-if="auth.token" @click.prevent="`isSearchOpen = true`" 
                        class="nav-link d-flex align-items-start text-decoration-none">
                        <img :src="imagePreview" class="profile-img"/>
                        <ul class="dropdown">
                            <li class="dropdown-item mb-2">
                                <router-link to="/profile" class="dropdown-link text-decoration-none">មើលប្រវត្តិរូប</router-link>
                            </li>

                            <li class="dropdown-item"> 
                                <a href="#" @click.prevent.stop="handleLogout" class="dropdown-link text-decoration-none">ចាកចេញ<i class="bi bi-box-arrow-right ms-1"></i></a>
                            </li>
                        </ul>
                    </a>

                    <!-- Login -->
                    <router-link v-else to="/login" class="btn btn-outline-primary rounded-pill px-4">
                        Login
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>

    <div class="search d-flex" v-if="isSearchOpen">
        <div class="search-container-wrapper d-flex gap-2 m-auto">
            <div class="search-wrapper">
                <i class="bi bi-search"></i>
                <input type="text" class="search-input" placeholder="ស្វែងរក" v-model="search">
                <button @click="CancelInput" class=" btn-sm border-0">
                    <i class="bi bi-x-lg black rounded-pill"></i>
                </button>               
            </div>
            <button class="btn m-auto btn-cancel" @click="Hide()">បោះបង់</button>
        </div>
    </div>

    <!-- respone screen -->
    <div class="aeon-bottom-nav navbar">
        <router-link to="/" class="nav-item">
            <i class="bi bi-house-door"></i>
        </router-link>
        
        <router-link to="/" class="nav-item">
            <i class="bi bi-bag-check"></i>
            <!-- <span>ទិញ</span> -->
        </router-link>

        <router-link to="/sell" class="nav-item">
            <i class="bi bi-shop"></i>
            <!-- <span>លក់</span> -->
        </router-link>

        <router-link to="/addtoCart" class="nav-item position-relative" >
            <i class="bi bi-cart3"></i>
            <small class="item position-absolute">{{totalCartItems}}</small>
        </router-link>

        <!-- search -->
        <router-link to="" @click="showHide()" class="nav-item"
            :class="{ 'text-primary': isSearchOpen }"
            :style="{ color: isSearchOpen ? primary : '#1f2937' }">
            <i class="bi bi-search"></i>
        </router-link>

        <div v-if="auth.token" @click.prevent="`isSearchOpen = true`" 
            class="nav-item">
            <img :src="imagePreview" class="profile-img mb-1"/>
            <ul class="nav-dropdown text-start">
                <li class="dropdown-item mb-2">
                    <router-link to="/profile" class="dropdown-link text-decoration-none">មើលប្រវត្តិរូប</router-link>
                </li>

                <li class="dropdown-item"> 
                    <a href="#" @click.prevent.stop="handleLogout" class="dropdown-link text-decoration-none d-inline-block">ចាកចេញ
                        <i class="bi bi-box-arrow-right fs-6"></i>
                    </a>
                </li>
            </ul>
        </div>

        <!-- Login -->
        <router-link v-else to="/login" class="btn btn-outline-primary rounded-pill nav-item px-4">
            Login
        </router-link>
    </div>

<!-- <<<<<<< HEAD -->

    <!-- ///////////view profile or logout -->
<!-- ======= -->
<!-- >>>>>>> 8124509740ef11f94670e4cd98534d2c7d4e4e8d -->
    <div class="modal" tabindex="-1" :class="{ 'show': showLogoutModal }" 
        :style="{ display: showLogoutModal ? 'block' : 'none', backgroundColor: showLogoutModal ? 'rgba(0,0,0,0.5)' : 'transparent' }"
         @click.self="cancelLogout">
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
</template>
<script setup>
    import { storeToRefs } from 'pinia'; // ជួយរក្សាភាព Reactive ពេលទាញយក state មកប្រើ
    import { RouterLink } from 'vue-router'
    import { useProductStore } from '@/stores/products';
    import { useProfileStore } from '@/stores/profile';
    import { useauthStore } from '@/stores/auth';
    import { onMounted, ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useCart } from '@/stores/addToCart';
    let auth = useauthStore();
    let isSearchOpen = ref(false);
    const cartStore = useCart();
    const { totalCartItems } = storeToRefs(cartStore);

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

    function CancelInput(){
        search.value = '';
    }

    //////get profile image
    const profileStore = useProfileStore();
    // 1. ចាប់យកឈ្មោះ imagePreview ឱ្យត្រូវនឹងឈ្មោះនៅក្នុង Store ផ្ទាល់តែម្តង
    let { imagePreview } = storeToRefs(profileStore);


    onMounted(async () => {
        await productStore.fetchProduct();
        await profileStore.getProfile();
    });


    /////////////log out///////////////
    const showLogoutModal = ref(false);
    const router = useRouter();
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
