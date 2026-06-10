<template>
  <div class="shop-page">
    <Navbar />
    <main class="container my-5">
      
      <div class="row">
        <div class="col-12">
          
          <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 flex-wrap gap-3">
            <div>
              <h2 class="section-title fw-bold text-dark mb-1">ផលិតផលលេចធ្លោ</h2>
              <p class="text-muted small mb-0">បង្ហាញផលិតផលចំនួន {{ filteredProducts.length }} មុខ</p>
            </div>
            
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input-wrapper">
                <input type="text" v-model="searchQuery" class="form-control form-control-sm" placeholder="🔍 ស្វែងរកផលិតផល...">
              </div>

              <select v-model="sortBy" class="form-select form-select-sm w-auto">
                <option value="default">ផលិតផលពេញនិយម</option>
                <option value="low-high">តម្លៃ៖ ពីទាបទៅខ្ពស់</option>
                <option value="high-low">តម្លៃ៖ ពីខ្ពស់ទៅទាប</option>
              </select>
            </div>
          </div>

          <div v-if="filteredProducts.length === 0" class="text-center my-5 py-5 text-muted">
            <i class="bi bi-box-seam fs-1 d-block mb-3"></i>
            មិនមានផលិតផលណាត្រូវនឹងការស្វែងរករបស់អ្នកឡើយ។
          </div>

          <div v-else class="row g-4">
            <div class="col-6 col-sm-6 col-md-4 col-lg-3" v-for="product in filteredProducts" :key="product.id">
              <div class="card product-card h-100">
                
                <div class="card-img-wrapper position-relative">
                  <div class="badge-tags position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
                    <span v-if="product.isSale" class="badge-custom bg-primary">Sale</span>
                  </div>
                  
                  <img :src="product.image || defaultImage" class="product-img" :alt="product.title" @error="handleImageError">

                  <button @click="addToCart(product)" class="btn btn-circle-cart-hover" :disabled="cartStore.loading" title="ថែមក្នុងកន្ត្រក">
                    <span v-if="cartStore.loading && cartStore.formData.product_id === product.id" class="spinner-border spinner-border-sm" role="status"></span>
                    <i v-else class="bi bi-cart-plus"></i>
                  </button>
                </div>

                <div class="card-body p-3 d-flex flex-column bg-white">
                  <span class="product-brand mb-1">{{ product.brand || 'ទូទៅ' }}</span>
                  <h5 class="product-title fw-semibold text-dark mb-2">{{ product.title }}</h5>
                  
                  <div class="d-flex align-items-center text-warning gap-1 mb-2" style="font-size: 0.8rem;">
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <span class="text-muted fw-normal small ms-1">({{ product.reviews || 10 }})</span>
                  </div>
                  
                  <div class="price-box mb-3 d-flex align-items-center justify-content-between flex-wrap gap-1">
                    <span class="current-price fw-bold text-dark">${{ formatPrice(product.price) }}</span>
                    <span class="badge bg-light text-secondary border small fw-normal px-2 py-1" style="font-size: 0.72rem;">
                      {{ product.condition || 'Brand New' }}
                    </span>
                  </div>

                  <div class="mt-auto d-flex align-items-center justify-content-between gap-2 flex-wrap">
                    <span class="stock-status text-success fw-medium">
                      <i class="bi bi-check-circle-fill me-1 small"></i>មានក្នុងស្តុក
                    </span>
                    
                    <button @click="viewDetails(product.id)" class="btn btn-details">
                      ព័ត៌មានលម្អិត
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer/>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter as useVueRouter } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import { useProductStore } from '@/stores/products';
import { useCart } from '@/stores/addToCart'; 

const nativeRouter = useVueRouter();
const productsStore = useProductStore();
const cartStore = useCart(); 

const defaultImage = ref('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80')

const products = ref([])
const sortBy = ref('default')
const searchQuery = ref('') // បន្ថែមសម្រាប់ Search

onMounted(async () => {
  await productsStore.fetchProduct();
  if(productsStore.products && productsStore.products.length > 0) {
    products.value = productsStore.products; 
  }
})

// Logic: គណនាការ Sorting និង Filtering តម្លៃ
const filteredProducts = computed(() => {
  let result = [...products.value];

  // Filter តាមឈ្មោះ
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(p => p.title.toLowerCase().includes(query) || (p.brand && p.brand.toLowerCase().includes(query)));
  }

  // Sort តាមតម្លៃ
  if (sortBy.value === 'low-high') {
    result.sort((a, b) => getPriceAsNumber(a.price) - getPriceAsNumber(b.price));
  } else if (sortBy.value === 'high-low') {
    result.sort((a, b) => getPriceAsNumber(b.price) - getPriceAsNumber(a.price));
  }

  return result;
});

const getPriceAsNumber = (priceVal) => {
  if (typeof priceVal === 'number') return priceVal;
  return parseFloat(String(priceVal).replace(/[^0-9.]/g, '')) || 0;
}

const formatPrice = (priceVal) => {
  return getPriceAsNumber(priceVal).toLocaleString();
}

const handleImageError = (event) => {
  event.target.src = defaultImage.value;
}

const addToCart = async (product) => {
  cartStore.formData.product_id = product.id;
  cartStore.formData.qty = 1; 
  await cartStore.addToCart(product);
  nativeRouter.push('/addtoCart')
}

const viewDetails = (id) => {
  nativeRouter.push({ name: 'detailpage', params: { id: id } }); 
}
</script>

<style scoped>
.shop-page { font-family: 'Kantumruuy Pro', sans-serif; background-color: #f8fafc; min-height: 100vh; }
.search-input-wrapper { min-width: 200px; }
.search-input-wrapper input { border-radius: 20px !important; padding: 6px 15px; border: 1px solid #e2e8f0; }
.section-title { font-size: 1.5rem; font-weight: 700; color: #111111; }
.product-card { background: #ffffff; border: 1px solid #e2e8f0 !important; border-radius: 12px !important; transition: all 0.3s; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 12px 20px rgba(0, 0, 0, 0.06); }
.card-img-wrapper { background-color: #f8fafc; height: 220px; display: flex; align-items: center; justify-content: center; padding: 1.2rem; }
.product-img { max-height: 100%; max-width: 100%; object-fit: contain; }
.btn-circle-cart-hover { position: absolute; bottom: 12px; right: 12px; background-color: #111111 !important; color: #ffffff !important; width: 40px; height: 40px; border-radius: 50% !important; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.3s; }
.product-card:hover .btn-circle-cart-hover { opacity: 1; }
.btn-details { background-color: #f1f5f9 !important; color: #334155 !important; font-size: 0.78rem; font-weight: 600; padding: 6px 14px !important; border-radius: 6px !important; transition: all 0.2s; }
.btn-details:hover { background-color: #111111 !important; color: #ffffff !important; }
</style>