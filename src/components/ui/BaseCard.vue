<template>
    <main class="container-fluid custom-padding-container py-5" style="background-color: #ffffff !important;">
        <div class="mb-4">
            <h2 class="section-title text-dark mb-1">ផលិតផល</h2>
        </div>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        
            <div class="col" v-for="product in products" :key="product.id">
                <router-link class="product-card-exact text-decoration-none" :to="`/detailpage/${product.id}`">
                    <div class="badge-container"><span class="badge-red-exact">{{product.condition}}</span></div>
                    
                    <div class="exact-img-wrapper">
                        <img :src="product.image" alt="Smart Watch">
                    </div>

                    <div class="card-body-content d-flex justify-content-between">
                        <div class="exact-info-title">{{product.title}}</div>
                        <div class="exact-info-brand text-start">{{product.description}}</div>
                        <div class="exact-price-box">
                            <span class="exact-price-current">$ {{product.price}}</span>
                        </div>
                    </div>
                    
                    <div class="exact-card-footer">
                        <!-- <span class="exact-stock-text">មានក្នុងស្តុក</span> -->
                        <button @click="handleFormSubmit(product)" class="exact-btn-action">បន្ថែមក្នុងកន្រ្តក់</button>
                    </div>
                </router-link>
            </div>
        </div>
    </main>
    
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { storeToRefs } from 'pinia'; // ជួយរក្សាភាព Reactive ពេលទាញយក state មកប្រើ
    import { useProductStore } from '@/stores/products';
    import { useCart } from '@/stores/addToCart';
    
    const productStore = useProductStore();
    // ទាញយក products state ពី store មកប្រើដោយប្រើ storeToRefs
    const { products } = storeToRefs(productStore);
    onMounted(async () => {
        // ហៅ function ទៅទាញទិន្នន័យពី API នៅពេល component ចាប់ផ្តើមដំណើរការ (mounted)
        await productStore.fetchProduct();
    });
    // console.log(products)


    ////////add to cart គ្រប់គ្រងការ Add to Cart 
    const cartStore = useCart(); 
    const { formData } = storeToRefs(cartStore);

    // កែត្រង់នេះ៖ ទទួលយក Object ផលិតផលផ្ទាល់ពីប៊ូតុងដែលយើងចុច
    const handleFormSubmit = async (product) => {
        if (!product || !product.id) {
            alert("រកមិនឃើញទិន្នន័យផលិតផលនេះទេ!");
            return;
        }

        // ផ្តល់តម្លៃ id ទៅឲ្យ Pinia store 
        formData.value.product_id = product.id;

        // រៀបចំទិន្នន័យឲ្យមានសុវត្ថិភាពការពារតម្លៃទទេ
        const safeProduct = {
            id: product.id,
            title: product.title || 'មិនមានឈ្មោះ',
            description: product.description || 'មិនមានការពិពណ៌នា',
            condition: product.condition || 'ថ្មី',
            image: product.image || '',
            price: Number(product.price) || 0 
        };

        try {
            // ហៅទៅកាន់ Actions របស់ Cart Store ដើម្បីរក្សាទុក
            cartStore.pushToLocalCart(safeProduct, 1); // លេខ 1 គឺចំនួន (Quantity) លំនាំដើម
            await cartStore.addToCart(); 
            
            alert("បានថែមផលិតផលទៅក្នុងកន្ត្រកហើយ!");
        } catch (error) {
            console.error("មានបញ្ហាពេលថែមចូលកន្ត្រក៖", error);
        }
    };
</script> 

<style>
    .product-card-exact .btn-cart{
        display: inline-block;
        text-align: center;
        color: white;
        font-size: 20px;
        background-color: #181616;
        border-radius: 10px;
        padding: 5px 10px;
        position: absolute;
        top: 50px;
        left: 82%;
        opacity: 0;
        transition: 0.8s;
    }
    .product-card-exact:hover .btn-cart{
        opacity: 1;
        top: 16px;
    }
    .product-card-exact .btn-cart:hover{
        color: black;
        background-color: white;
        box-shadow: 0px 0px 5px #2768f4;
    }
</style>