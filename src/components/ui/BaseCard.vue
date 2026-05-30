<template>
    <main class="container-fluid custom-padding-container py-5" style="background-color: #ffffff !important;">
        <div class="mb-4">
            <h2 class="section-title text-dark mb-1">ផលិតផល</h2>
        </div>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            
            <div class="col" v-for="product in products" :key="product.id">
                <div class="product-card-exact">
                    <div class="badge-container"><span class="badge-red-exact">{{product.condition}}</span></div>
                    
                    <div class="exact-img-wrapper">
                        <img :src="product.image" alt="Smart Watch">
                    </div>

                    <router-link to="/addtoCart" class="btn-cart">
                        <i class="bi bi-cart3 cart"></i>
                    </router-link>

                    <div class="card-body-content">
                        <div class="exact-info-title">{{product.title}}</div>
                        <div class="exact-info-brand">{{product.description}}</div>
                        <div class="exact-price-box">
                            <span class="exact-price-current">$ {{product.price}}</span>
                        </div>
                    </div>
                    
                    <div class="exact-card-footer">
                        <!-- <span class="exact-stock-text">មានក្នុងស្តុក</span> -->
                        <router-link :to="`/detail/${product.id}`" class="exact-btn-action">ព័ត៌មានលម្អិត</router-link>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <!-- {{ products }} -->
</template>

<script setup>
    import { onMounted, ref, watch } from 'vue';
    import { storeToRefs } from 'pinia'; // ជួយរក្សាភាព Reactive ពេលទាញយក state មកប្រើ
    import { useProductStore } from '@/stores/products';
    
    const productStore = useProductStore();
    // ទាញយក products state ពី store មកប្រើដោយប្រើ storeToRefs
    const { products } = storeToRefs(productStore);
    onMounted(async () => {
        // ហៅ function ទៅទាញទិន្នន័យពី API នៅពេល component ចាប់ផ្តើមដំណើរការ (mounted)
        await productStore.fetchProduct();
    });
    // console.log(products)
    
</script> 

<style>
    .product-card-exact .cart{
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
    .product-card-exact:hover .cart{
        opacity: 1;
        top: 16px;
    }
    .product-card-exact .cart:hover{
        color: black;
        background-color: white;
        box-shadow: 0px 0px 5px #2768f4;
    }
</style>