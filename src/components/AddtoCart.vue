<template>
    <Navbar></Navbar>
    <div class="container-fluid layout-wrapper py-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="page-title">កន្ត្រកទំនិញ</h1>
            <button class="delete-btn btn-delete-all" @click="clearCart"><i class="bi bi-trash3"></i>សម្អាតកន្រ្តក់</button>
        </div> 
        <div class="cart-layout p-4">
            <div class="cart-items-container"> 
                <div v-if="cartItems.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm">
                    <i class="bi bi-cart-x text-muted" style="font-size: 3rem;"></i>
                    <h5 class="text-muted mt-3">មិនទាន់មានទំនិញនៅក្នុងកន្ត្រកនៅឡើយទេ</h5>
                </div>

                <div v-else class="cart-item" v-for="item in cartItems" :key="item.id">
                    <div class="item-img-box col-2">
                        <img :src="item.image" :alt="item.title">
                    </div>
                    <div class="item-details col-8 px-4">
                        <span class="item-category">{{item.title}}</span>
                        <h3 class="item-name">{{item.description}}</h3>
                        <h3 class="item-name">ស្ថានភាពទំនិញ: {{ item.condition }}</h3>
                        <div class="quantity-selector">
                            <button class="qty-btn" @click="updateQty(item.id, item.qty - 1)">-</button>
                            <span  class="qty-input">{{item.qty}}</span>
                            <button class="qty-btn" @click="updateQty(item.id, item.qty + 1)">+</button>
                        </div>
                    </div>
                    <div class="item-actions col-2">
                        <button class="delete-btn" @click="removeItem(item.id)"><i class="bi bi-trash3"></i></button>
                        <small class="item-name">${{item.price}}/1</small>
                        <div class="item-price">${{ (item.price * item.qty).toFixed(2) }}</div>
                    </div>
                </div>

            </div>
            <div class="summary-sidebar">
                <div class="summary-card">
                    <h2 class="summary-title">សង្ខេបការបម្មង់</h2>
                    
                    <div class="summary-row">
                        <span>ចំនួនទំនិញ</span>
                        <span class="summary-total">{{ totalCartItems }}</span>
                    </div>
                    <div class="summary-row">
                        <span>តំលៃសរុបឯកតា</span>
                        <span class="summary-total">${{ totalCartPrice }}</span>
                    </div>
                    <div class="summary-row">
                        <span class=" fw-normal">ដឹកជញ្ជូន</span>
                        <span class="summary-total fw-normal">ជ្រើសរើសពេលបង់ប្រាក់</span>
                    </div>
                    <hr class="my-3 text-secondary opacity-25">
                    <div class="summary-row">
                        <span>តម្លៃសរុប</span>
                        <span class="summary-qty">${{ totalCartPrice }}</span>
                    </div>
                    <button class="checkout-btn bg-primary" @click="goToCheckout" :disabled="cartItems.length === 0">ទូទាត់ប្រាក់</button>
                </div>
            </div>
        </div>

        <div id="productCarousel" class="carousel slide recommendations-carousel d-flex align-items-center justify-content-between gap-2" data-bs-ride="false">
            <button class="custom-nav-arrow border-0" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                <i class="bi bi-chevron-left p-2 rounded-pill"></i>
            </button>
            <div class="carousel-inner">
                <div 
                    v-for="(group, groupIndex) in chunkedProducts" 
                    :key="groupIndex"
                    class="carousel-item" 
                    :class="{ active: groupIndex === 0 }">
                    <div class="carousel-grid">
                        <div v-for="product in group" :key="product.id" class="rec-card">
                            <img class="image" :src="product.image" :alt="product.title">
                            <h6 class="rec-name">{{ product.title }}</h6>
                            <span class="rec-price">$ {{ product.price }}</span>
                            
                            <router-link :to="`/detailpage/${product.id}`"  class="view-more-btn bg-primary text-decoration-none text-center">
                                ព័ត៌មានលម្អិត
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            
            <button class="custom-nav-arrow border-0" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                <i class="bi bi-chevron-right p-2 rounded-pill"></i>
            </button>
        </div>

        <div class="btn-shopping-action d-flex justify-content-between">
            <router-link to="/" class="continue-shopping-btn bg-primary text-decoration-none">មើលផលិតផលផ្សេងទៀត</router-link>
            <button class="continue-shopping-btn bg-primary" @click="$router.go(-1)">ថយក្រោយ</button>
        </div> 
    </div>
    <Footer></Footer>
</template>

<script setup>
    import Footer from './layout/Footer.vue';
    import { storeToRefs } from 'pinia'; 
    import { useCart } from '@/stores/addToCart.js';
    import { useauthStore } from '@/stores/auth.js';
    import { useProductStore } from '@/stores/products';
    import { onMounted, nextTick, computed } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();
    const productStore = useProductStore();
    const { products } = storeToRefs(productStore);

    import Carousel from 'bootstrap/js/dist/carousel'; 
    // បង្កើត Logic សម្រាប់ហែក Array ធំ ទៅជា Array តូចៗ (ក្នុង ១ Array មាន ៣ ផលិតផល)
    const chunkedProducts = computed(() => {
    const chunks = [];
    if (products.value && products.value.length > 0) {
        for (let i = 0; i < products.value.length; i += 3) {
        chunks.push(products.value.slice(i, i + 3));
        }
    }
    return chunks;
    });
    onMounted(async () => {
        await productStore.fetchProduct();
        await nextTick();
        
        const carouselEl = document.querySelector('#productCarousel');
        if (carouselEl) {
            // ជួរទី ១៩៖ លុបពាក្យ bootstrap. ចេញ គឺហៅប្រើ Carousel(...) ផ្ទាល់តែម្ដង
            const carousel = new Carousel(carouselEl, {
                interval: 3000,
                ride: 'carousel',
                wrap: true
            });
            carousel.cycle();
        }
    });


    // ហៅ Store មកប្រើ
    const cartStore = useCart();
    
    // ទាញយក State មកប្រើជា Reactive ដោយប្រើ storeToRefs
    const { cartItems, totalCartItems, totalCartPrice } = storeToRefs(cartStore);
    console.log(cartItems)
    // ហៅ Actions ពី Store មកប្រើផ្ទាល់លើ Button ក្នុង Template បានភ្លាមៗ
    const updateQty = (id, newQty) => {
        cartStore.updateQty(id, newQty);
    };

    const removeItem = (id) => {
        if (confirm('តើអ្នកពិតជាចង់លុបទំនិញនេះចេញពីកន្ត្រកមែនទេ?')) {
            cartStore.removeItem(id); // ហៅ Action ពី Pinia ឱ្យមកលុប
        }
    };

    const clearCart = () => {
        if (confirm('តើអ្នកពិតជាចង់សម្អាតកន្ត្រកទំនិញទាំងមូលមែនទេ?')) {
            cartStore.clearCart();
        }
    };

    const goToCheckout = () => {
        if (cartItems.value.length === 0) return;
        const auth = useauthStore();
        if (!auth.token) {
            // redirect to login and preserve target
            router.push({ name: 'login', query: { redirect: 'checkout' } });
            return;
        }
        router.push({ name: 'checkout' });
    };

</script>

<style scoped>
    :global(:root){
        --bg-btn-color: linear-gradient(to top, #6eb1f5 0%, #9bafc8 100%);
    }
    body{
        font-family: "Inter","Kantumruy Pro", sans-serif, serif;
        font-size: 18px;
        background-color: #f6f9fc;
        color: #333333 !important;   
    }
    .image{
        height: 90px !important;
        object-fit: cover;
    }
    .layout-wrapper {
        padding: 0 7%;
        max-width: 100%;
        width: 100%;
    }

    .page-title {
        font-size: 24px;
        font-weight: 600;
        color: #212529;
        /* margin-bottom: 24px; */
    }

    /* --- Split Layout Grid --- */
    .cart-layout {
        background-image: var(--bg-detail);
        border: 2px solid #EAEAEA;
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 24px;
        align-items: start;
        margin-bottom: 40px;
        border-radius: 8px;
    }

    .cart-items-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    /* --- Cart Items --- */
    .cart-item {
        background-color: #EAEAEA; /* Flat structure light gray matching mockup background */
        border-radius: 8px;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /* gap: 20px; */
    }

    .item-img-box {
        background-color: #fff;
        border-radius: 6px;
        /* width: 110px; */
        height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
    }

    .item-img-box img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .item-details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 110px;
    }

    .item-category {
        font-size: 13px;
        color: #555;
        font-weight: 600;
    }

    .item-name {
        font-size: 14px;
        color: #666;
        font-weight: 400;
        /* margin-top: 2px; */
        /* margin-bottom: 12px; */
    }

    /* Counter UI */
    .quantity-selector {
        display: inline-flex; /* បន្ថែមនេះដើម្បីឱ្យ elements ខាងក្នុងរៀបជួរដេកបានស្អាត */
        align-items: center;
        border: 1px solid #ced4da;
        border-radius: 8px;
        width: fit-content;
        background: #fff;
        overflow: hidden;
    }

    .qty-btn {
        background: transparent;
        border: none;
        /* លុប width: 28px; ចេញ ហើយជំនួសដោយ padding វិញ */
        padding: 0 12px; 
        height: 26px;
        cursor: pointer;
        font-size: 16px;
        color: #444;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .qty-input {
        display: inline-block;
        min-width: 30px;   /* ទំហំតូចបំផុតពេលមានលេខ ១ខ្ទង់ */
        max-width: 150px;  /* ទំហំធំបំផុតការពារកុំឱ្យរីកវែងពេក */
        height: 30px;
        line-height: 30px;
        text-align: center;
        padding: 0 8px;    /* បន្ថែមគម្លាតឆ្វេងស្តាំ */
        border-left: 1px solid #ced4da;
        border-right: 1px solid #ced4da;
        outline: none;     
    }

    /* Actions Section right aligned */
    .item-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
        height: 110px;
        /* padding-top: 4px; */
    }

    .delete-btn{
        background: transparent;
        border: none;
        color: #DC3545; /* Bootstrap Red tint */
        font-size: 14px;
    }
    .btn-delete-all{
        font-size: 15px;
        font-weight: 500;
        background-color: #fff;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #a6a8a8;
        color: #DC3545;
    }
    .btn-delete-all:hover{
        background: var(--bg-btn-color);
        border-radius: 8px;
        color: white;
    }

    .item-price {
        font-size: 16px;
        font-weight: 600;
        color: #212529;
    }

    /* --- Summary Panel --- */
    .summary-card {
        background-color: #EAEAEA;
        border-radius: 8px;
        padding: 24px;
    }

    .summary-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #212529;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        margin-bottom: 14px;
        color: #333;
    }

    .summary-qty {
        color: #DC3545;
        font-weight: 600;
    }

    .summary-total {
        font-weight: 600;
    }

    .checkout-btn {
        width: 100%;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 6px 14px;
        cursor: pointer;
        margin-top: 10px;
    }

    /* --- Bootstrap Slider Wrapper --- */
    .recommendations-carousel {
        background-image: var(--bg-detail);
        border-radius: 8px;
        padding: 20px 15px;
        position: relative;
        margin-bottom: 30px;
    }

    .carousel-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        width: 100%;
    }

    .rec-card {
        max-height: 250px;
        background: #fff;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: start;
    }

    .rec-card img {
        max-height: 100px;
        object-fit: contain;
        margin-bottom: 16px;
    }


    .rec-name {
        font-size: 16px;
        color: #444;
        /* height: 38px; */
        overflow: hidden;
        /* margin-bottom: 16px; */
    }

    .rec-price {
        font-size: 15px;
        font-weight: 600;
        color: #212529;
        margin-bottom: 16px;
    }

    .view-more-btn {
        width: 100%;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 4px 14px;
        font-size: 18px;
        transition: 0.8s;
    }

    /* Custom positioning for Bootstrap slider controls */
    /* .custom-nav-arrow {
        background: transparent !important;
        background-color: transparent !important;
    } */
    .custom-nav-arrow{
        -webkit-text-stroke: 1px #002855;
        font-size: 1.2rem;
        width: 35px;
        height: 35px;
        text-align: center;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #bfc1c338;
        border-radius: 100%;
    }

    .custom-nav-arrow:hover{
        background: var(--bg-btn-color);
        -webkit-text-stroke: 1px #f3f5f8;
    }

    .carousel-control-prev { left: 16px; }
    .carousel-control-next { right: 16px; }

    /* --- shopping Action Elements --- */
    .-btn-shopping-action {
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
    }

    .continue-shopping-btn {
        font-size: 16px;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 15px !important; 
        margin-top: 10px;
    }

    /* ======btn hover====== */
    .view-more-btn:hover,
    .continue-shopping-btn:hover,
    .checkout-btn:hover {
        background: var(--bg-btn-color);
    }

    /* --- Viewport Responsiveness --- */
    @media (max-width: 992px) {
        .cart-layout {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .carousel-grid {
            grid-template-columns: 1fr 1fr;
        }
        .rec-card:last-child {
            display: none;
        }
    }

    @media (max-width: 576px) {
        .carousel-grid {
            grid-template-columns: 1fr;
        }
        .cart-item {
            flex-direction: column;
            align-items: flex-start;
        }
        .item-actions {
            width: 100%;
            flex-direction: row-reverse;
            height: auto;
            align-items: center;
            margin-top: 10px;
        }
    }
</style>