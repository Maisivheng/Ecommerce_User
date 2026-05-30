<template>
    <main class="container-fluid custom-padding-container py-5" style="background-color: #ffffff !important;">
        <div class="mb-4">
            <h2 class="section-title text-dark mb-1">ផលិតផលពិសេស</h2>
            <!-- <p class="text-muted small m-0 " style="font-size: 18px;">ឧបករណ៍អេឡិចត្រូនិចដែលបានជ្រើសរើសសម្រាប់ជីវិតកាន់តែទំនើប</p> -->
        </div>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            
            <div class="col" v-for="product in products" :key="product.id">
                <div class="product-card-exact">
                    <div class="badge-container"><span class="badge-red-exact">{{product.condition}}</span></div>
                    
                    <div class="exact-img-wrapper">
                        <img :src="product.image" alt="Smart Watch">
                    </div>
                    
                    <div class="card-body-content">
                        <div class="exact-info-title">{{product.title}}</div>
                        <div class="exact-info-brand">{{product.description}}</div>
                        <div class="exact-rating-container">
                            <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                        </div>
                        <div class="exact-price-box">
                            <span class="exact-price-current">$ {{product.price}}</span>
                        </div>
                    </div>
                    
                    <div class="exact-card-footer">
                        <span class="exact-stock-text">មានក្នុងស្តុក</span>
                        <router-link to="/contectUs" class="exact-btn-action">ព័ត៌មានលម្អិត</router-link>
                    </div>
                </div>
            </div>
        </div>
    </main>
    
</template>

<script setup>
    import { onMounted } from 'vue';
    import { storeToRefs } from 'pinia'; // ជួយរក្សាភាព Reactive ពេលទាញយក state មកប្រើ
    import { useProductStore } from '@/stores/products';

    const productStore = useProductStore();

    // ទាញយក products state ពី store មកប្រើដោយប្រើ storeToRefs
    const { products } = storeToRefs(productStore);

    onMounted(async () => {
    // ហៅ function ទៅទាញទិន្នន័យពី API នៅពេល component ចាប់ផ្តើមដំណើរការ (mounted)
        await productStore.fetchProduct();
    });console.log(products)

</script> 