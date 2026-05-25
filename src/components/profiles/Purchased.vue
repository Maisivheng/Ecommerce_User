<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import api from "@/API/api";

// =======================
// STATES
// =======================

const purchasedProducts = ref([]);

const loading = ref(false);

// =======================
// GET PURCHASED PRODUCTS
// =======================

const getPurchasedProducts = async () => {
  try {
    loading.value = true;

    const response = await api.get("/api/profile/purchased");

    console.log(response.data);

    purchasedProducts.value = response.data.data || [];
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// =======================
// MOUNTED
// =======================

onMounted(() => {
  getPurchasedProducts();
});
</script>

<template>
  <div>
    <!-- title -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="">ផលិតផលដែលបានទិញ</h4>
    </div>

    <!-- loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>

      <p class="mt-3">Loading...</p>
    </div>

    <!-- empty -->
    <div
      v-else-if="purchasedProducts.length === 0"
      class="card card-ui p-5 text-center"
    >
      <i class="bi bi-bag-x text-secondary empty-icon"></i>

      <h5 class="mt-3">មិនទាន់មានផលិតផលដែលបានទិញទេ</h5>

      <p class="text-muted">សូមធ្វើការទិញផលិតផលជាមុនសិន</p>
    </div>

    <!-- products -->
    <div v-else class="row">
      <div
        class="col-lg-4 col-md-6 mb-4"
        v-for="item in purchasedProducts"
        :key="item.id"
      >
        <div class="card card-ui h-100 overflow-hidden">
          <!-- image -->
          <img :src="item.product?.image" class="card-img-top product-img" />

          <!-- body -->
          <div class="card-body d-flex flex-column">
            <!-- title -->
            <h5 class="fw-bold mb-2">
              {{ item.product?.title }}
            </h5>

            <!-- creator -->
            <p class="text-muted mb-2">
              <i class="bi bi-person"></i>

              {{ item.product?.creator?.name }}
            </p>

            <!-- categories -->
            <div class="mb-3">
              <span
                v-for="category in item.product?.categories"
                :key="category.id"
                class="badge bg-primary me-1"
              >
                {{ category.name }}
              </span>
            </div>

            <!-- price -->
            <h5 class="text-success mb-3">
              $
              {{ item.product?.price }}
            </h5>

            <!-- status -->
            <div class="mb-3">
              <span class="badge bg-success"> Purchased Successfully </span>
            </div>

            <!-- button -->
            <RouterLink
              :to="`/detail/${item.product?.id}`"
              class="btn btn-outline-primary mt-auto"
            >
              <i class="bi bi-eye"></i>

              View Detail
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-ui {
  border: none;
  border-radius: 20px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}

.card-ui:hover {
  transform: translateY(-5px);
}

.product-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.empty-icon {
  font-size: 80px;
}
</style>
