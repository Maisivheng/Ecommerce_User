<template>
  <div class="detail-page">
    <Navbar />
    
    <div class="container my-5" v-if="product">
      <div class="row g-5">
        
        <div class="col-md-6">
          <div class="product-image-wrapper p-4 border rounded-3 bg-white text-center shadow-sm">
            <img :src="getImageUrl(product.image)" class="img-fluid rounded" :alt="product.title">
          </div>
        </div>

        <div class="col-md-6">
          <span class="badge bg-primary mb-2 text-uppercase px-3 py-2 fs-7">{{ product.brand || 'ទូទៅ' }}</span>
          <h1 class="fw-bold text-dark mb-3">{{ product.title }}</h1>
          
          <div class="d-flex align-items-center text-warning gap-1 mb-3">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <span class="text-muted small ms-2">({{ product.reviews || 10 }} reviews)</span>
          </div>

          <div class="price-box p-3 rounded-3 mb-4" style="background-color: #f8fafc; border: 1px solid #e2e8f0;">
            <h2 class="fw-bold text-danger mb-1">${{ product.price }}</h2>
            <div class="d-flex gap-2 mt-2">
              <span class="badge bg-light text-secondary border px-2 py-1">Condition: {{ product.condition || 'Brand New' }}</span>
              <span class="badge bg-success-subtle text-success border px-2 py-1">In Stock</span>
            </div>
          </div>

          <div class="mb-4">
            <h5 class="fw-bold text-dark border-bottom pb-2">ការបរិយាយផលិតផល</h5>
            <p class="text-muted lh-lg">
              {{ product.description || 'នេះគឺជាផលិតផលដែលមានគុណភាពខ្ពស់ ត្រូវបានរចនានិងផលិតឡើងយ៉ាងផ្ចិតផ្ចង់ សម្រាប់ការប្រើប្រាស់ទូទៅ និងមានការធានាត្រឹមត្រូវចេញពីហាង។' }}
            </p>
          </div>

          <div class="mb-4 d-flex align-items-center gap-3">
            <label class="fw-semibold text-dark small">ចំនួន៖</label>
            <div class="input-group input-group-sm" style="width: 120px;">
              <button class="btn btn-outline-secondary" type="button" @click="decreaseQty">-</button>
              <input type="number" class="form-control text-center fw-bold" v-model.number="quantity" min="1">
              <button class="btn btn-outline-secondary" type="button" @click="increaseQty">+</button>
            </div>
          </div>

          <div class="d-flex gap-3 align-items-center pt-3 border-top mt-4">
            <button @click="addToCart(product)" :disabled="cartStore.loading" class="btn btn-dark btn-lg px-4 py-2 rounded-3 d-flex align-items-center gap-2">
              <span v-if="cartStore.loading" class="spinner-border spinner-border-sm" role="status"></span>
              <i v-else class="bi bi-cart-plus-fill"></i> ថែមក្នុងកន្ត្រក
            </button>
            
            <router-link to="/shop-page" class="btn btn-outline-secondary btn-lg px-4 py-2 rounded-3">
              ត្រឡប់ទៅហាងវិញ
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <div v-else class="container my-5 text-center py-5">
      <div class="spinner-border text-primary mb-3" role="status"></div>
      <p class="text-muted">កំពុងស្វែងរកព័ត៌មានលម្អិតនៃផលិតផល...</p>
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

    <Footer />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import { useProductStore } from '@/stores/products' 
import { useCart } from '@/stores/addToCart' 
import { useauthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const productsStore = useProductStore()
const cartStore = useCart() 

const product = ref(null)
const quantity = ref(1) 
const defaultImage = ref('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80')

// 🛠 បន្ថែមថ្មី៖ មុខងារទាញយកផ្លូវរូបភាព និងត្រួតពិនិត្យករណីផលិតផលអត់មានរូបភាព (no_photo.jpg)
const getImageUrl = (imageName) => {
  // ១. ប្រសិនបើគ្មានរូបភាព ឬរូបភាពជាប្រភេទ no_photo.jpg ឱ្យវាបង្ហាញរូបភាព Default ជំនួសភ្លាម
  if (!imageName || imageName.includes('no_photo.jpg')) {
    return defaultImage.value;
  }
  
  // ២. ប្រសិនបើទិន្នន័យរូបភាពជា Link ពេញលេញស្រាប់ (http://... ឬ https://)
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  
  // ៣. បូកភ្ជាប់ជាមួយ Base URL API របស់គម្រោងអ្នក
  const apiBaseUrl = 'https://api-loukbontor.g2.ant.com.kh';
  
  if (imageName.startsWith('storage/')) {
    return `${apiBaseUrl}/${imageName}`;
  }
  
  if (imageName.startsWith('/storage/')) {
    return `${apiBaseUrl}${imageName}`;
  }

  return `${apiBaseUrl}/storage/products/${imageName}`;
}

onMounted(async () => {
  const productId = parseInt(route.params.id)
  
  if (productsStore.products.length === 0) {
    await productsStore.fetchProduct()
  }
  
  const foundProduct = productsStore.products.find(p => p.id === productId)
  if (foundProduct) {
    product.value = foundProduct
  }
})

// មុខងារបូក/ដកចំនួននៅលើ UI
const increaseQty = () => {
  quantity.value++
}
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

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

const addToCart = async (product) => {
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

    // ៤. ហៅ Action ទៅកាន់ Store
    try {
      cartStore.formData.qty = quantity.value
        // បញ្ជូន safeProduct ចូលទៅក្នុង addToCart
        await cartStore.addToCart(safeProduct, quantity.value);
        showToast("បានបន្ថែមផលិតផលដោយជោគជ័យ", "success");
    } catch (error) {
        const errorMsg = error.response?.data?.message || "មានបញ្ហាក្នុងការបន្ថែមទៅកន្ត្រក";
        showToast(`បរាជ័យ: ${errorMsg}`, "error");
        console.error("កំហុសក្នុងការបន្ថែមទៅកន្ត្រក៖", error);
    }
};
</script>

<style scoped>
.detail-page {
  background-color: #fafafa;
  min-height: 100vh;
}
.product-image-wrapper {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0 !important;
}
.product-image-wrapper img {
  max-height: 380px;
  object-fit: contain;
}
.fs-7 {
  font-size: 0.8rem;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
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
