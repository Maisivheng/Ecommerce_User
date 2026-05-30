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

            <!-- Description -->
            <div class="mb-3">
              <p class="text-muted">{{productDetail?.description}}</p>
            </div>

            <!-- Detail -->
            <div class="mb-3">
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
              <router-link :to="`/addtoCart`" class="exact-btn-action">ដាក់ចូលកន្ត្រក់</router-link>
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
  import Footer from './layout/Footer.vue';
  import BaseCard from './ui/BaseCard.vue';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import api from "@/API/api";
  const route = useRoute();
  let productDetail = ref({})
  // get id from route
  let id = route.params.id;
  onMounted( async() =>{
      let res = await api.get('api/products/'+ id);
      productDetail.value = res.data.data;
  })
</script>

<style scoped>
  :global(:root){
    --bg-detail: linear-gradient(to bottom, #b8c4d3 0%, #043774 100%);
  }

  .Detail{
    background-image: var(--bg-detail);
  }
</style>