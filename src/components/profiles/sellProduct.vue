<template>
    <div class="card card-ui p-4">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
    </div>
    <!-- LOADING -->
    <div v-if="loading">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>ឈ្មោះផលិតផល</th>
            <th>ឈ្មោះអ្នកទិញ</th>
            <th>វិកាយប័ត្រ</th>
            <th>កាលបរិច្ឆេត</th>
            <th>តម្លៃសរុប</th>
            <th>ស្ថានភាព</th>
            <th>សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 6" :key="i">
            <td><div class="skeleton skeleton-id"></div></td>
            <td><div class="skeleton skeleton-image"></div></td>
            <td><div class="skeleton skeleton-text"></div></td>
            <td><div class="skeleton skeleton-badge"></div></td>
            <td><div class="skeleton skeleton-price"></div></td>
            <td><div class="skeleton skeleton-date"></div></td>
            <td>
              <div class="d-flex gap-2">
                <div class="skeleton skeleton-action"></div>
                <div class="skeleton skeleton-action"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TABLE -->
    <div v-else class="table-responsive">
      <table class="table table-hover align-middle text-center">
        <thead>
          <tr>
            <th>ឈ្មោះផលិតផល</th>
            <th>ឈ្មោះអ្នកទិញ</th>
            <th>វិកាយប័ត្រ</th>
            <th>កាលបរិច្ឆេត</th>
            <th>តម្លៃសរុប</th>
            <th>ស្ថានភាព</th>
            <th>សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="products.length === 0">
            <td colspan="7" class="text-center text-muted py-4">
              អត់ទាន់មានអ្នកទិញទេ
            </td>
          </tr>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td>{{ product.product.title }}</td>
            <td>{{ product.buyer.name }}</td>
            <td>
              <img :src="product.image" class="product-img" :alt="product.title"/>
            </td>
            <td>{{ formatDate(product.created_at) }}</td>
            <td>${{ product.price }}</td>
            <td>
              <button class="btn btn-sm rounded-5 fw-medium" :class="getStatusConfig(product.status).class">
              {{ getStatusConfig(product.status).text }}
              </button>
            </td>
            <td>
              <div class="d-flex justify-content-center gap-2">

                <button 
                  v-if="product.status == 1" 
                  @click="editProduct(product, 2)" 
                  class="btn btn-outline-success btn-sm btn-approrve fw-medium"
                >
                  <i class="bi bi-check2"></i>អនុម័ត
                </button>

                <button
                  v-if="product.status == 1" 
                  @click="openConfirmModal(product.id)" 
                  class="btn btn-outline-danger btn-sm fw-medium"
                >
                  <i class="bi bi-x"></i>បដិសេដ
                </button>

                <span v-if="product.status != 1" class=" fw-normal">
                    {{ getStatusConfig(product.status).text }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-center mt-4 gap-2">
        <button
          class="btn btn-outline-primary"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Prev
        </button>
        <button v-for="page in totalPages" :key="page" @click="changePage(page)" class="btn" :class="currentPage === page ? 'btn-primary' : 'btn-outline-primary'">          
          {{ page }}
        </button>
        <button class="btn btn-outline-primary" :disabled="currentPage === totalPages" @click="currentPage++">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import api from "@/API/api";
import router from "@/router";
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

const confirmModal = reactive({
  show: false,
  title: "",
  message: "",
  productId: null,
});

const openConfirmModal = (id) => {
  confirmModal.productId = id;
  confirmModal.show = true;
};

const closeConfirmModal = () => {
  confirmModal.show = false;
  confirmModal.productId = null;
};

const products = ref([]);
const loading = ref(false);
const showModal = ref(false);

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
// Helper function to determine button style and text based on status
const getStatusConfig = (status) => {
  switch (parseInt(status)) {
    case 2:
      return { text: "អនុម័ត", class: "btn-success" }; 
    case 3:
      return { text: "បដិសេដ", class: "btn-danger " };   
    case 1:
    default:
      return { text: "រងចាំ", class: "btn-warning" }; 
  }
};
const confirmReject = async () => {
  if (confirmModal.productId) {
    await updateStatus(confirmModal.productId, 3); // 3 = Rejected
    closeConfirmModal();
  }
};

const updateStatus = async (id, newStatus) => {
  try {
    const productIndex = products.value.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      products.value[productIndex].status = newStatus;
      
      if (newStatus === 2) {
        showToast("ស្នើរសុំត្រូវបានអនុម័ត");
      } else {
        showToast("ស្នើរសុំត្រូវបានបដិសេដ", "error");
      }
    }
  } catch (error) {
    console.error(error);
    showToast("Failed to update status", "error");
  }
};

const editProduct = (product, newStatus) => {
  updateStatus(product.id, newStatus);
};
// get Payment 

const getUserPayment = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/profile/payment-check");
    console.log("PRODUCTS:", response.data);
    products.value = response.data.data || [];
    console.log(products.value);
  } catch (error) {
    console.log(error);
    showToast(error.response?.data?.message || "Get Products Failed", "error");
  } finally {
    loading.value = false;
  }
};

const currentPage = ref(1);
const perPage = 6;
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return products.value.slice(start, end);
});
const totalPages = computed(() => {
  return Math.ceil(products.value.length / perPage);
});
const changePage = (page) => {
  currentPage.value = page;
};

onMounted(() => {
  getUserPayment();
});
</script>

<style scoped>
.btnStatus{
  font-size: 12px;
}
.card-ui {
  border: none;
  border-radius: 20px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
}

.product-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background: white;
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px;
  padding: 25px;
}

/* DELETE CONFIRM MODAL */
.confirm-box {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  padding: 32px 28px 28px;
  text-align: center;
  z-index: 1000;
}

.confirm-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.confirm-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
}

.confirm-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 10px;
}

.confirm-message {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.confirm-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 10px;
  font-weight: 500;
  font-size: 15px;
}

.preview-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
}

/* SKELETON LOADING */
.skeleton {
  position: relative;
  overflow: hidden;
  background: #e9ecef;
  border-radius: 10px;
}

.skeleton::before {
  content: "";
  position: absolute;
  top: 0;
  left: -150px;
  width: 150px;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.7),
    transparent
  );
  animation: loading 1s infinite;
}

@keyframes loading {
  100% {
    left: 100%;
  }
}

.skeleton-id { width: 40px; height: 20px; }
.skeleton-image { width: 70px; height: 70px; border-radius: 12px; }
.skeleton-text { width: 160px; height: 20px; }
.skeleton-badge { width: 80px; height: 25px; border-radius: 30px; }
.skeleton-price { width: 70px; height: 20px; }
.skeleton-date { width: 120px; height: 20px; }
.skeleton-action { width: 70px; height: 35px; border-radius: 10px; }

/* TOAST */
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

.toast-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.toast-message {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  flex-shrink: 0;
  line-height: 1;
}

.toast-close:hover { color: #fff; }

.toast-enter-active { animation: toast-in 0.3s ease; }
.toast-leave-active { animation: toast-in 0.25s ease reverse; }

@keyframes toast-in {
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>