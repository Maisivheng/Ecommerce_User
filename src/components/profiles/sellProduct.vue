<template>
    <div class="card card-ui p-4">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="fw-bold mb-0" style="color: #1a1a2e;">បញ្ជីស្នើសុំទិញទំនិញ</h5>
      <span class="badge bg-primary bg-opacity-10 text-primary">
        សរុប: {{ products.length }}
      </span>
    </div>

    <!-- LOADING -->
    <div v-if="loading">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>ឈ្មោះផលិតផល</th>
            <th>ឈ្មោះអ្នកទិញ</th>
            <th>វិក្កយប័ត្រ</th>
            <th>កាលបរិច្ឆេទ</th>
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
            <th>វិក្កយប័ត្រ</th>
            <th>កាលបរិច្ឆេទ</th>
            <th>តម្លៃសរុប</th>
            <th>ស្ថានភាព</th>
            <th>សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="products.length === 0">
            <td colspan="7" class="text-center text-muted py-4">
              <i class="bi bi-inbox fs-1 d-block mb-2"></i>
              អត់ទាន់មានអ្នកទិញទេ
            </td>
          </tr>

          <tr v-for="product in paginatedProducts" :key="product.id">
            <td class="fw-medium">{{ product.product?.title || '-' }}</td>
            <td>{{ product.buyer?.name || '-' }}</td>

            <!-- ✅ តារាងបង្ហាញ transaction_file -->
            <td>
              <div 
                v-if="product.transaction_file" 
                class="txn-thumb-wrap"
                @click="openPreview(product)"
              >
                <img 
                  :src="getFileUrl(product.transaction_file)" 
                  class="txn-thumb" 
                  alt="វិក្កយប័ត្រ"
                  @error="onImgError($event)"
                />
                <div class="txn-zoom">
                  <i class="bi bi-zoom-in"></i>
                </div>
              </div>
              <span v-else class="text-muted small">មិនមាន</span>
            </td>

            <td class="small">{{ formatDate(product.created_at) }}</td>
            <td class="fw-bold">${{ product.price }}</td>
            <td>
              <button class="btn btn-sm rounded-5 fw-medium" :class="getStatusConfig(product.status).class">
                {{ getStatusConfig(product.status).text }}
              </button>
            </td>
            <td>
              <div class="d-flex justify-content-center gap-2">
                <button 
                  v-if="product.status == 1" 
                  @click="approveProduct(product)" 
                  class="btn btn-outline-success btn-sm fw-medium"
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
                <span v-if="product.status != 1" class="fw-normal small">
                  {{ getStatusConfig(product.status).text }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- PAGINATION -->
      <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4 gap-2">
        <button class="btn btn-outline-primary btn-sm" :disabled="currentPage === 1" @click="currentPage--">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="changePage(page)" 
          class="btn btn-sm" 
          :class="currentPage === page ? 'btn-primary' : 'btn-outline-primary'"
        >          
          {{ page }}
        </button>
        <button class="btn btn-outline-primary btn-sm" :disabled="currentPage === totalPages" @click="currentPage++">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- ═══ ✅ TRANSACTION FILE PREVIEW MODAL ═══ -->
  <Transition name="fade">
    <div v-if="preview.show" class="preview-overlay" @click.self="closePreview">
      <div class="preview-box">
        <!-- Header -->
        <div class="preview-head">
          <div>
            <p class="preview-title">វិក្កយប័ត្របង់ប្រាក់</p>
            <p class="preview-sub">
              អ្នកទិញ: <strong>{{ preview.buyerName }}</strong> · 
              ផលិតផល: <strong>{{ preview.productName }}</strong>
            </p>
          </div>
          <button class="preview-x" @click="closePreview">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Image -->
        <div class="preview-img-area">
          <img 
            v-if="!preview.imgError"
            :src="preview.url" 
            class="preview-full-img" 
            alt="transaction"
            @error="preview.imgError = true"
          />
          <div v-else class="preview-fallback">
            <i class="bi bi-image"></i>
            <p>មិនអាចបង្ហាញរូបភាពបានទេ</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="preview-foot">
          <a :href="preview.url" target="_blank" class="btn btn-outline-primary btn-sm">
            <i class="bi bi-box-arrow-up-right me-1"></i>បើកថ្មី
          </a>
          <a :href="preview.url" download class="btn btn-primary btn-sm">
            <i class="bi bi-download me-1"></i>ទាញយក
          </a>
        </div>
      </div>
    </div>
  </Transition>

  <!-- ═══ CONFIRM REJECT MODAL ═══ -->
  <Transition name="fade">
    <div v-if="confirmModal.show" class="modal-overlay" @click.self="closeConfirmModal">
      <div class="confirm-box">
        <div class="confirm-icon-wrap">
          <div class="confirm-icon">
            <i class="bi bi-exclamation-triangle-fill" style="font-size: 28px;"></i>
          </div>
        </div>
        <p class="confirm-title">តើអ្នកពិតជាចង់បដិសេដមែនទេ?</p>
        <p class="confirm-message">ការបដិសេដនេះនឹងមិនអាចត្រឡប់វិញបានទេ។</p>
        <div class="confirm-actions">
          <button class="confirm-btn btn btn-light" @click="closeConfirmModal">បោះបង់</button>
          <button class="confirm-btn btn btn-danger" @click="confirmReject">បដិសេដ</button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- ═══ TOAST ═══ -->
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div v-for="toast in toasts" :key="toast.id" class="toast-item" :class="`toast-${toast.type}`">
        <span class="toast-icon">
          <i v-if="toast.type === 'success'" class="bi bi-check-lg"></i>
          <i v-else class="bi bi-x-lg"></i>
        </span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click="removeToast(toast.id)"><i class="bi bi-x"></i></button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import api from "@/API/api";

// ═══ TOAST ═══
const toasts = ref([]);
const showToast = (message, type = "success") => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id); }, 3500);
};
const removeToast = (id) => { toasts.value = toasts.value.filter(t => t.id !== id); };

// ═══ CONFIRM MODAL ═══
const confirmModal = reactive({ show: false, productId: null });
const openConfirmModal = (id) => { confirmModal.productId = id; confirmModal.show = true; };
const closeConfirmModal = () => { confirmModal.show = false; confirmModal.productId = null; };

// ═══ ✅ PREVIEW MODAL - ទាញយក transaction_file ពី product ═══
const preview = reactive({
  show: false,
  url: "",
  buyerName: "",
  productName: "",
  imgError: false,
});

const openPreview = (product) => {
  preview.url = getFileUrl(product.transaction_file);
  preview.buyerName = product.buyer?.name || '-';
  preview.productName = product.product?.title || '-';
  preview.imgError = false;
  preview.show = true;
  document.body.style.overflow = 'hidden';
};

const closePreview = () => {
  preview.show = false;
  preview.url = "";
  document.body.style.overflow = '';
};

const onImgError = (event) => {
  event.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="%23ddd" viewBox="0 0 16 16"><path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm9.5 4.5l-2 3-1.5-2L3 12h10l-3.498-4.5z"/></svg>');
};

// ═══ ✅ HELPER: បំលែង transaction_file path ទៅ URL ពេញ ═══
const getFileUrl = (file) => {
  if (!file) return '';
  if (file.startsWith('http://') || file.startsWith('https://')) return file;
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return `${base}${file.startsWith('/') ? '' : '/'}${file}`;
};

// ═══ PRODUCTS DATA ═══
const products = ref([]);
const loading = ref(false);

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("km-KH", {
    year: "numeric", month: "short", day: "numeric",
  });
};

const getStatusConfig = (status) => {
  switch (parseInt(status)) {
    case 2: return { text: "អនុម័ត", class: "btn-success" };
    case 3: return { text: "បដិសេដ", class: "btn-danger" };
    default: return { text: "រងចាំ", class: "btn-warning" };
  }
};

// ═══ ✅ GET PAYMENTS - transaction_file ត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិ ═══
const getUserPayment = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/profile/payment-check");
    
    // ✅ រក្សាទុកទិន្នន័យទាំងស្រុង រួចទាញយក transaction_file ពីក្នុងនោះ
    products.value = response.data.data || [];
    
    // ✅ Debug: បង្ហាញ transaction_file របស់រាល់ទំនិញ
    products.value.forEach((p, i) => {
      console.log(`📦 [${i}] transaction_file:`, p.transaction_file);
    });
    
  } catch (error) {
    console.error(error);
    showToast(error.response?.data?.message || "Get Products Failed", "error");
  } finally {
    loading.value = false;
  }
};

// ═══ STATUS UPDATE ═══
const approveProduct = async (product) => {
  try {
    const idx = products.value.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      products.value[idx].status = 2;
      showToast("ស្នើរសុំត្រូវបានអនុម័ត");
    }
  } catch (error) {
    showToast("Failed to approve", "error");
  }
};

const confirmReject = async () => {
  if (confirmModal.productId) {
    try {
      const idx = products.value.findIndex(p => p.id === confirmModal.productId);
      if (idx !== -1) {
        products.value[idx].status = 3;
        showToast("ស្នើរសុំត្រូវបានបដិសេដ", "error");
      }
    } catch (error) {
      showToast("Failed to reject", "error");
    }
    closeConfirmModal();
  }
};

// ═══ PAGINATION ═══
const currentPage = ref(1);
const perPage = 6;
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return products.value.slice(start, start + perPage);
});
const totalPages = computed(() => Math.ceil(products.value.length / perPage));
const changePage = (page) => { currentPage.value = page; };

onMounted(() => { getUserPayment(); });
</script>

<style scoped>
.card-ui {
  border: none;
  border-radius: 20px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
}

/* ═══ ✅ TRANSACTION THUMBNAIL ═══ */
.txn-thumb-wrap {
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e9ecef;
  transition: all 0.2s ease;
  display: inline-block;
}
.txn-thumb-wrap:hover {
  border-color: #3a6bdf;
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(58, 107, 223, 0.3);
}
.txn-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.txn-zoom {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: #fff;
  font-size: 20px;
}
.txn-thumb-wrap:hover .txn-zoom { opacity: 1; }

/* ═══ PREVIEW MODAL ═══ */
.preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(6px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.preview-box {
  background: #fff;
  width: 100%;
  max-width: 650px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
}
.preview-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}
.preview-title { font-size: 17px; font-weight: 700; color: #1a1a2e; margin: 0 0 4px; }
.preview-sub { font-size: 13px; color: #888; margin: 0; }
.preview-x {
  background: #f4f6f8;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  transition: all 0.2s;
  flex-shrink: 0;
}
.preview-x:hover { background: #fee2e2; color: #ef4444; }
.preview-img-area {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  max-height: 65vh;
  background: #f8f9fa;
  overflow: auto;
}
.preview-full-img {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.preview-fallback {
  text-align: center;
  color: #aaa;
  padding: 40px;
}
.preview-fallback i { font-size: 48px; display: block; margin-bottom: 10px; }
.preview-fallback p { font-size: 14px; margin: 0; }
.preview-foot {
  display: flex;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  justify-content: flex-end;
}

/* ═══ CONFIRM MODAL ═══ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.confirm-box {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  padding: 32px 28px 28px;
  text-align: center;
  z-index: 1000;
}
.confirm-icon-wrap { display: flex; justify-content: center; margin-bottom: 16px; }
.confirm-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: #fff1f1; display: flex; align-items: center; justify-content: center; color: #ef4444;
}
.confirm-title { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px; }
.confirm-message { font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 24px; }
.confirm-actions { display: flex; gap: 12px; justify-content: center; }
.confirm-btn { flex: 1; padding: 10px 0; border-radius: 10px; font-weight: 500; font-size: 15px; }

/* ═══ SKELETON ═══ */
.skeleton { position: relative; overflow: hidden; background: #e9ecef; border-radius: 10px; }
.skeleton::before {
  content: ""; position: absolute; top: 0; left: -150px; width: 150px; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);
  animation: loading 1s infinite;
}
@keyframes loading { 100% { left: 100%; } }
.skeleton-id { width: 40px; height: 20px; }
.skeleton-image { width: 70px; height: 70px; border-radius: 12px; }
.skeleton-text { width: 160px; height: 20px; }
.skeleton-badge { width: 80px; height: 25px; border-radius: 30px; }
.skeleton-price { width: 70px; height: 20px; }
.skeleton-date { width: 120px; height: 20px; }
.skeleton-action { width: 70px; height: 35px; border-radius: 10px; }

/* ═══ TOAST ═══ */
.toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
.toast-item { display: flex; align-items: center; gap: 10px; min-width: 280px; max-width: 380px; padding: 14px 16px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); font-size: 14px; font-weight: 500; color: #fff; }
.toast-success { background: #22c55e; }
.toast-error { background: #ef4444; }
.toast-icon { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
.toast-message { flex: 1; line-height: 1.4; }
.toast-close { background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; font-size: 13px; padding: 0; flex-shrink: 0; }
.toast-close:hover { color: #fff; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.toast-enter-active { animation: toast-in 0.3s ease; }
.toast-leave-active { animation: toast-in 0.25s ease reverse; }
@keyframes toast-in { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
</style>