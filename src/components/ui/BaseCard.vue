<template>
    <main class="container-fluid custom-padding-container py-5 mt-0" style="background-color: #ffffff !important;">
        <div class="mb-1">
            <h2 class="section-title text-dark">ផលិតផល</h2>
        </div>

        <div class="mb-2 d-flex justify-content-between">
            <div class="dropdown">
                <select class="border-0 p-1 exact-btn-action fs-6" @change="handleCategoryChange">
                    <option value="">ផលិតផលទាំងអស់</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                    </option>
                </select>
            </div>

            <div class="search-input-wrapper">
                <input type="text" v-model="search" class="form-control form-control-sm" placeholder="🔍 ស្វែងរកផលិតផល...">
            </div>
        </div>

        <div v-if="displayedProducts && displayedProducts.length === 0" class="text-center my-5 py-5 text-muted">
            <i class="bi bi-box-seam fs-1 d-block mb-3"></i>
            មិនមានផលិតផលណាត្រូវនឹងការស្វែងរករបស់អ្នកឡើយ។
        </div>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            <div class="col" v-for="product in displayedProducts" :key="product.id">
                <div class="product-card-exact text-decoration-none">
                    <div class="badge-container"><span class="badge-red-exact">{{product.condition}}</span></div>
                    
                    <router-link class="exact-img-wrapper text-decoration-none" :to="`/detailpage/${product.id}`">
                        <img :src="product.image" alt="Smart Watch">
                    </router-link>

                    <router-link class="card-body-content d-flex justify-content-between text-decoration-none" :to="`/detailpage/${product.id}`">
                        <div class="exact-info-title">{{product.title}}</div>
                        <div class="exact-info-brand text-start">{{product.description}}</div>
                        <div class="exact-price-box">
                            <span class="exact-price-current">$ {{product.price}}</span>
                        </div>
                    </router-link>
                    
                    <div class="exact-card-footer d-flex justify-content-between">
                        <!-- <span class="exact-stock-text">មានក្នុងស្តុក</span> -->
                        <button @click="handleFormSubmit(product)" class="exact-btn-action">បន្ថែមក្នុងកន្រ្តក់</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-4" v-if="visibleCount <  filteredProducts.length">
            <button @click="loadMore" class="exact-btn-action">មើលបន្ថែម</button>
        </div>

        <div class="toast-container">
            <transition-group name="toast">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="toast-item"
                :class="toast.type === 'error' ? 'toast-error' : 'toast-success'"
            >
                <span class="toast-icon">
                {{ toast.type === "error" ? "✕" : "✓" }}
                </span>
                <span class="toast-message">{{ toast.message }}</span>
                <!-- <button class="toast-close" @click="removeToast(toast.id)">✕</button> -->
            </div>
            </transition-group>
        </div>
    </main>
    
</template>

<script setup>
import { onMounted, ref,reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductStore } from '@/stores/products';
import { useCart } from '@/stores/addToCart';
import { useauthStore } from '@/stores/auth';
import router from '@/router';

    const toasts = ref([]);
    const showToast = (message, type = "success") => {
    const id = Date.now();
    toasts.value.push({ id, message, type });
    setTimeout(() => {
        toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 3500);
    };

    const removeToast = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
    };

    const productStore = useProductStore();
    const { products, categories } = storeToRefs(productStore);

    onMounted(async () => {
        // ទាញយកទិន្នន័យទាំងពីរមកទុកម្តងឱ្យហើយ
        await productStore.fetchProduct();
        await productStore.fetchCategories();
    });

    const search = ref('');
    const selectCategory = ref(null);

    // គ្រប់គ្រងការច្រោះ (Search + Category) ក្នុងពេលតែមួយ
    const filteredProducts = computed(() => {
        let result = products.value;

        if (search.value) {
            const query = search.value.toLowerCase();
            result = result.filter(p => 
                p.title?.toLowerCase().includes(query) || 
                p.description?.toLowerCase().includes(query)
            );
        }

        if (selectCategory.value) {
            result = result.filter(p => 
                p.categories?.some(cat => cat.id === selectCategory.value)
            );
        }
        return result;
    });

    const visibleCount = ref(12);
    const displayedProducts = computed(() => {
        return filteredProducts.value.slice(0, visibleCount.value);
    });

    const loadMore = () => { visibleCount.value += 12; };

    // មុខងារជ្រើសរើស Category
    const handleCategoryChange = (event) => {
        const val = event.target.value;
        selectCategory.value = val === "" ? null : Number(val);
        visibleCount.value = 12; // Reset ចំនួនពេលប្តូរ Category
    };

    ////////add to cart គ្រប់គ្រងការ Add to Cart 
    const cartStore = useCart(); 
    const { formData } = storeToRefs(cartStore);

    const handleFormSubmit = async (product) => {
        // ១. ត្រួតពិនិត្យភាពត្រឹមត្រូវនៃទិន្នន័យផលិតផល
        if (!product || !product.id) {
            showToast("រកមិនឃើញទិន្នន័យផលិតផល!", "error");
            return;
        }

        // ២. រៀបចំទិន្នន័យឱ្យមានសុវត្ថិភាព (Safe Object)
        const safeProduct = {
            id: product.id,
            title: product.title || 'មិនមានឈ្មោះ',
            description: product.description || 'មិនមានការពិពណ៌នា',
            condition: product.condition || 'ថ្មី',
            image: product.image || '',
            price: Number(product.price) || 0 
        };

        // ៣. ពិនិត្យសិទ្ធិអ្នកប្រើប្រាស់
        let auth = useauthStore();
        if (!auth.token) {
            showToast("សុំចូលគណនីរបស់អ្នកមុននឹងទិញ", "error");
            return;
        }
        try {
            // បញ្ជូន safeProduct ចូលទៅក្នុង addToCart
            await cartStore.addToCart(safeProduct, 1);
            showToast("បានបន្ថែមផលិតផលដោយជោគជ័យ", "success");
        } catch (error) {
            const errorMsg = error.response?.data?.message || "មានបញ្ហាក្នុងការបន្ថែមទៅកន្ត្រក";
            showToast(`បរាជ័យ: ${errorMsg}`, "error");
            console.error("កំហុសក្នុងការបន្ថែមទៅកន្ត្រក៖", error);
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
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    .toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 280px;
  max-width: 380px;
  padding: 14px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.toast-success { background: #22c55e; }
.toast-error { background: #ef4444; }
</style>