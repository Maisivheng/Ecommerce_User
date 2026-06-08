<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCart } from "@/stores/addToCart";

const cartStore = useCart();
const { cartItems, totalCartPrice } = storeToRefs(cartStore);

// បង្កើត local loading state សម្រាប់បង្ហាញ Skeleton ខណៈពេលកំពុង render ទំព័រ (មិនបានប្រើពី Store ទេ)
const isPageLoading = ref(true);

onMounted(() => {
  // ដោយសារ Store ដើមទាញពី localStorage ភ្លាមៗ យើងគ្រាន់តែបិទ Skeleton ក្រោយពេល mount រួច
  // កុំហៅ cartStore.fetchCart() ព្រោះកូដគេមិនមាន Function នេះទេ
  setTimeout(() => {
    isPageLoading.value = false;
  }, 300); // ពន្យារបន្តិចដើម្បីឲ្យ Skeleton បង្ហាញខ្លះៗសម្រាប់ UX ល្អ
});
</script>

<template>
  <div class="card card-ui p-4">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4>រទេះទិញរបស់ខ្ញុំ</h4>
    </div>

    <!-- TABLE -->
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Categories</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <!-- LOADING (ប្រើ local loading state) -->
          <template v-if="isPageLoading">
            <tr v-for="n in 5" :key="n">
              <td><div class="skeleton skeleton-img"></div></td>
              <td><div class="skeleton skeleton-text"></div></td>
              <td>
                <div class="d-flex gap-2">
                  <div class="skeleton skeleton-badge"></div>
                  <div class="skeleton skeleton-badge"></div>
                </div>
              </td>
              <td><div class="skeleton skeleton-small"></div></td>
              <td><div class="skeleton skeleton-small"></div></td>
              <td><div class="skeleton skeleton-small"></div></td>
              <td><div class="skeleton skeleton-btn-sm"></div></td>
            </tr>
          </template>

          <!-- EMPTY -->
          <tr v-else-if="cartItems.length === 0">
            <td colspan="7" class="text-center text-muted py-5">
              គ្មានផលិតផលនៅក្នុងរទេះទិញទេ
            </td>
          </tr>

          <!-- PRODUCTS -->
          <tr v-else v-for="item in cartItems" :key="item.id">
            <!-- IMAGE -->
            <td>
              <img
                :src="item.image || 'https://via.placeholder.com/50'"
                class="product-img"
                :alt="item.title || 'Product'"
              />
            </td>

            <!-- TITLE -->
            <td>
              {{ item.title || item.name || "មិនមានឈ្មោះ" }}
            </td>

            <!-- CATEGORY (ដោយសារកូដគេមិនកែរក្សា category យើងដាក់ Fallback) -->
            <td>
              <span class="badge bg-primary me-1" v-if="item.category">
                {{ item.category }}
              </span>
              <span class="badge bg-secondary me-1" v-else> គ្មានប្រភេទ </span>
            </td>

            <!-- PRICE -->
            <td>${{ item.price }}</td>

            <!-- QTY -->
            <td>
              <div class="d-flex align-items-center gap-2">
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="cartStore.updateQty(item.id, (item.qty || 1) - 1)"
                >
                  -
                </button>
                <span>{{ item.qty || 1 }}</span>
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="cartStore.updateQty(item.id, (item.qty || 1) + 1)"
                >
                  +
                </button>
              </div>
            </td>

            <!-- TOTAL -->
            <td>
              <span class="text-success fw-bold">
                ${{ (item.price * (item.qty || 1)).toFixed(2) }}
              </span>
            </td>

            <!-- ACTION -->
            <td>
              <button
                @click="cartStore.removeItem(item.id)"
                class="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- GRAND TOTAL -->
    <div
      class="d-flex justify-content-end mt-4"
      v-if="!isPageLoading && cartItems.length > 0"
    >
      <div class="total-box">
        <h5 class="mb-0">
          Grand Total :
          <span class="text-success"> ${{ totalCartPrice.toFixed(2) }} </span>
        </h5>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-ui {
  border: none;
  border-radius: 20px;
  box-shadow: 0 3px 15px rgba(123, 91, 91, 0.05);
}

.product-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
}

.total-box {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 15px;
}

/* =========================
   SKELETON
========================= */

.skeleton {
  position: relative;
  overflow: hidden;
  background: #e9ecef;
  border-radius: 10px;
}

.skeleton::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150px;
  width: 150px;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );

  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}

.skeleton-img {
  width: 70px;
  height: 70px;
  border-radius: 10px;
}

.skeleton-text {
  width: 140px;
  height: 18px;
}

.skeleton-small {
  width: 60px;
  height: 18px;
}

.skeleton-badge {
  width: 60px;
  height: 24px;
  border-radius: 30px;
}

.skeleton-btn-sm {
  width: 90px;
  height: 35px;
  border-radius: 10px;
}
</style>
