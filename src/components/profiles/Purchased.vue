<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/API/api";
import { useCart } from '@/stores/addToCart';
import { storeToRefs } from 'pinia';

const purchasedProducts = ref([]);
const loading = ref(false);
const currentUserName = ref('អ្នកទិញ');
const cartStore = useCart();
const { purchaseHistory } = storeToRefs(cartStore);

const hasLocalHistory = computed(() => purchaseHistory.value.length > 0);

const displayProducts = computed(() => {
  if (purchasedProducts.value.length > 0) {
    return purchasedProducts.value.map((item) => ({
      product: item.product || item,
      qty: item.qty || item.quantity || 1,
      purchased: true,
      status: "Purchased Successfully",
      orderDate: item.date || item.created_at || null,
      totalPrice: item.totalPrice || item.price || null,
      buyerName: item.user?.name || currentUserName.value,
    }));
  }

  if (purchaseHistory.value.length > 0) {
    return purchaseHistory.value.flatMap((order) => {
      return order.items.map((item) => ({
        product: {
          image: item.image || "https://via.placeholder.com/400x250?text=No+Image",
          title: item.title || item.name || "មិនមានឈ្មោះ",
          price: item.price || 0,
          creator: { name: currentUserName.value },
          categories: [],
          id: item.id,
        },
        qty: item.qty || item.quantity || 1,
        purchased: true,
        status: `Order #${order.id}`,
        orderDate: order.date,
        totalPrice: order.totalPrice,
      }))
    })
  }

  return [];
});

const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/me');
    const user = response.data.data;
    currentUserName.value = user?.name || user?.email || 'អ្នកទិញ';
  } catch (error) {
    console.warn('Unable to load current user name:', error);
  }
};

const getPurchasedProducts = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/profile/purchased");
    purchasedProducts.value = response.data.data || [];
  } catch (error) {
    console.error("Error fetching purchased products:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getCurrentUser();
  getPurchasedProducts();
});
</script>

<template>
  <div>
    <!-- title -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="">ផលិតផលដែលបានទិញ</h4>
    </div>

    <!-- loading skeleton -->
    <div v-if="loading">
      <!-- title skeleton -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <!-- <div class="skeleton skeleton-title"></div> -->
      </div>

      <!-- skeleton cards -->
      <div class="row">
        <div class="col-lg-4 col-md-6 mb-4" v-for="n in 6" :key="n">
          <div class="card card-ui overflow-hidden">
            <!-- image -->
            <div class="skeleton skeleton-image"></div>

            <div class="card-body">
              <!-- title -->
              <div class="skeleton skeleton-text mb-3"></div>

              <!-- creator -->
              <div class="skeleton skeleton-small mb-3"></div>

              <!-- categories -->
              <div class="d-flex gap-2 mb-3">
                <div class="skeleton skeleton-badge"></div>
                <div class="skeleton skeleton-badge"></div>
              </div>

              <!-- price -->
              <div class="skeleton skeleton-price mb-3"></div>

              <!-- status -->
              <div class="skeleton skeleton-status mb-3"></div>

              <!-- button -->
              <div class="skeleton skeleton-button"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- empty state -->
    <div
      v-else-if="displayProducts.length === 0"
      class="card card-ui p-5 text-center"
    >
      <i class="bi bi-bag-x text-secondary empty-icon"></i>

      <h5 class="mt-3">មិនទាន់មានផលិតផលដែលបានទិញទេ</h5>

      <p class="text-muted">សូមធ្វើការទិញផលិតផលជាមុនសិន</p>
    </div>

    <!-- products list -->
    <div v-else class="row">
      <div
        class="col-lg-4 col-md-6 mb-4"
        v-for="item in displayProducts"
        :key="item.product?.id || item.id"
      >
        <div class="card card-ui h-100 overflow-hidden">
          <!-- image (បន្ថែមរូបភាព Default បើករណីគ្មានរូបពី API) -->
          <img
            :src="
              item.product?.image ||
              'https://via.placeholder.com/400x250?text=No+Image'
            "
            class="card-img-top product-img"
            :alt="item.product?.title || 'Product Image'"
          />

          <!-- body -->
          <div class="card-body d-flex flex-column">
            <!-- title -->
            <h5 class="fw-bold mb-2">
              {{ item.product?.title || "មិនមានឈ្មោះ" }}
            </h5>

            <!-- creator -->
            <p class="text-muted mb-2">
              <i class="bi bi-person"></i>
              {{ item.product?.creator?.name || "Unknown Creator" }}
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
              ${{ item.product?.price || "0.00" }}
            </h5>

            <!-- status -->
            <div class="mb-3">
              <span :class="['badge', item.purchased ? 'bg-success' : 'bg-secondary']">
                {{ item.status }}
              </span>
            </div>

            <div class="d-flex justify-content-between align-items-center gap-3 mb-3">
              <span class="text-muted">Qty: {{ item.qty || 1 }}</span>
              <span class="text-success fw-bold">${{ item.product?.price?.toFixed(2) || '0.00' }}</span>
            </div>
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
  font-size: 45px;
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

.skeleton-title {
  width: 220px;
  height: 35px;
}

.skeleton-image {
  width: 100%;
  height: 250px;
  border-radius: 0;
}

.skeleton-text {
  width: 80%;
  height: 22px;
}

.skeleton-small {
  width: 60%;
  height: 16px;
}

.skeleton-badge {
  width: 70px;
  height: 25px;
  border-radius: 30px;
}

.skeleton-price {
  width: 100px;
  height: 25px;
}

.skeleton-status {
  width: 150px;
  height: 28px;
  border-radius: 30px;
}

.skeleton-button {
  width: 100%;
  height: 42px;
  border-radius: 10px;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}
</style>
