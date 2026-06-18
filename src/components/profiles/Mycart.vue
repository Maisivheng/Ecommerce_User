<script setup>
import { onMounted, ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useCart } from "@/stores/addToCart";

const cartStore = useCart();
const { cartItems, totalCartPrice } = storeToRefs(cartStore);

// បង្កើត local loading state សម្រាប់បង្ហាញ Skeleton ខណៈពេលកំពុង render ទំព័រ
const isPageLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isPageLoading.value = false;
  }, 300);
});

// ===========================
// TOAST STATE
// ===========================
const toasts = ref([]);
let toastId = 0;

const showToast = (message, type = "success") => {
  const id = toastId++;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3000);
};

// ===========================
// MODAL STATE
// ===========================
const confirmModal = reactive({
  show: false,
  title: "",
  message: "",
  onConfirm: null,
});

const showConfirmModal = ({ title, message, onConfirm }) => {
  confirmModal.title = title;
  confirmModal.message = message;
  confirmModal.onConfirm = onConfirm;
  confirmModal.show = true;
};

const closeModal = () => {
  confirmModal.show = false;
  confirmModal.onConfirm = null;
};

const executeConfirm = () => {
  if (confirmModal.onConfirm) {
    confirmModal.onConfirm();
  }
  closeModal();
};

// ===========================
// CART ACTIONS
// ===========================
const confirmDeleteItem = (item) => {
  showConfirmModal({
    title: "លុបផលិតផល",
    message: `តើអ្នកចង់លុប "${item.title || item.name || "ផលិតផលនេះ"}" ពីរទេះទិញមែនទេ?`,
    onConfirm: () => {
      cartStore.removeItem(item.id);
      showToast("ផលិតផលត្រូវបានលុបចោលដោយជោគជ័យ", "success");
    },
  });
};
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
          <!-- LOADING -->
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

            <!-- CATEGORY -->
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
                @click="confirmDeleteItem(item)"
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

  <!-- =========================== -->
  <!-- CUSTOM TOAST COMPONENT -->
  <!-- =========================== -->
  <div class="toast-container">
    <transition-group name="toast-fade">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="custom-toast"
        :class="toast.type === 'error' ? 'toast-error' : 'toast-success'"
      >
        <i
          :class="
            toast.type === 'error' ? 'bi bi-x-circle' : 'bi bi-check-circle'
          "
          class="me-2"
        ></i>
        {{ toast.message }}
      </div>
    </transition-group>
  </div>

  <!-- =========================== -->
  <!-- CUSTOM MODAL COMPONENT -->
  <!-- =========================== -->
  <transition name="modal-fade">
    <div v-if="confirmModal.show" class="modal-overlay">
      <div class="modal-box">
        <h5 class="mb-3">{{ confirmModal.title }}</h5>
        <p class="text-muted mb-4">{{ confirmModal.message }}</p>
        <div class="d-flex justify-content-end gap-2">
          <button @click="closeModal" class="btn btn-secondary">បោះបង់</button>
          <button @click="executeConfirm" class="btn btn-danger">លុប</button>
        </div>
      </div>
    </div>
  </transition>
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

/* =========================
   CUSTOM TOAST STYLES
========================= */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.custom-toast {
  padding: 14px 24px;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  min-width: 280px;
}

.toast-success {
  /* background: #198754; */
background: #22c55e;
}

.toast-error {
  background: #dc3545;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

/* =========================
   CUSTOM MODAL STYLES
========================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-box {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-box,
.modal-fade-leave-to .modal-box {
  transform: scale(0.9);
}
</style>
