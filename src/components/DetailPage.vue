<template>
  <Navbar></Navbar>
  <main class="container-fluid custom-padding-container pt-4 pb-5" >
    <div class="card border-0 rounded-4 overflow-hidden shadow-lg Detail">
      
      <div class="row p-4 g-4">
        
        <div class="col-md-6">
          <div class="bg-light rounded-4 p-4 d-flex align-items-center justify-content-center h-100">
            <img :src="productDetail.image" class="w-100 rounded-4" style="max-height: 400px; object-fit: contain;" alt="Product Image" />
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="bg-light rounded-4 p-4 d-flex flex-column justify-content-between h-100">   
            <!-- Title -->
            <h2 class="fw-bold mb-3">{{ productDetail?.title }}</h2>

            <!-- Price -->
            <h5>Price</h5>
            <h5 class="text-primary fw-bold mb-3">${{ productDetail?.price }}</h5>

            <div class="quantity-selector mb-3">
                <div class="quantity-selector">
                    <button class="qty-btn" @click="decrement">-</button>
                    <span  class="qty-input">{{count}}</span>
                    <button class="qty-btn" @click="increment">+</button>
                </div>
            </div>

            <!-- Description -->
            <div>
              <p class="text-muted">{{productDetail?.description}}</p>
            </div>

            <!-- Detail -->
            <div>
              <p class="text-muted">{{productDetail?.detail}}</p>
            </div>

            <!-- Condition -->
            <div class="mb-3">
              <h6>Condition</h6>
              <span>{{productDetail?.condition}}</span>
            </div>

            <!-- Story -->
            <div class="mb-4">
              <h6 class="text-muted">Story</h6>
              <span>{{ productDetail?.story }}</span>
            </div>
            <!-- Buttons -->
            <div class="d-flex justify-content-between">
              <button @click="handleFormSubmit" :disabled="loading" class="exact-btn-action">{{ loading ? 'កំពុងបញ្ចូល...' : 'ដាក់ចូលកន្ត្រក់' }}</button>
              <button class="btn btn-secondary px-4 btn-sm" @click="$router.go(-1)">ថយក្រោយ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <!-- <BaseCard></BaseCard> -->
  <Footer></Footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import api from '@/API/api';
import { useCounterStore } from '@/stores/counter.js';
// Import Stores
import { useCart } from '@/stores/addToCart.js';

const route = useRoute();
const cartStore = useCart(); 
const counterStore = useCounterStore();
const { count } = storeToRefs(counterStore);
const { increment, decrement } = counterStore;
onMounted(() => {
    counterStore.decrement();
    counterStore.increment();
});

// កំណត់តម្លៃដើម (Default Value) ដូចក្នុងរូបថត Postman របស់អ្នក
const { formData, loading, responseMessage, responseClass } = storeToRefs(cartStore);

const productDetail = ref({});
const id = route.params.id; 
onMounted(async() => {
    formData.product_id = id;
    formData.qty = count;

    //  ទាញយក State ដោយប្រើ storeToRefs ត្រឹមត្រូវតាមស្តង់ដារ Vue 3
    let res = await api.get('api/products/'+ id);
    productDetail.value = res.data.data;

    formData.value.product_id = id;
});

const handleFormSubmit = () => {
    if (!productDetail.value || !productDetail.value.id) {
        alert("កំពុងទាញយកទិន្នន័យផលិតផល សូមព្យាយាមម្តងទៀត!");
        return;
    }
    // formData.value.product_id = route.params.id;

    const safeProduct = {
        id: productDetail.value.id,
        title: productDetail.value.title || 'មិនមានឈ្មោះ',
        description: productDetail.value.description || 'មិនមានការពិពណ៌នា',
        condition: productDetail.value.condition || 'ថ្មី',
        image: productDetail.value.image || '',
        price: Number(productDetail.value.price) || 0 
    };

    // ពេលនេះវានឹងស្គាល់ function នេះ ១០០% ដោយមិនលោត Error ទៀតទេ
    cartStore.pushToLocalCart(safeProduct, count.value);
    cartStore.addToCart(); 
};
</script>

<style scoped>
  :global(:root){
    --bg-detail: linear-gradient(to bottom, #b8c4d3 0%, #043774 100%);
  }

  .Detail{
    background-image: var(--bg-detail);
  }
</style>

<style>
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
        outline: none;     /* លុប border ខ្មៅពេលចុចចំ */
    }
</style>