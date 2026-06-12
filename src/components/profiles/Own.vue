<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import api from "@/API/api";

// =====================================
// TOAST
// =====================================

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

// =====================================
// CONFIRM MODAL
// =====================================

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

// =====================================
// STATES
// =====================================

const products = ref([]);
const categories = ref([]);

const loading = ref(false);
const categoryLoading = ref(false);

const showModal = ref(false);
const isEdit = ref(false);
const currentProductId = ref(null);
const saving = ref(false);
const deleting = ref(false);

const imagePreview = ref("");

const fileInputRef = ref(null);

// =====================================
// FORM
// =====================================

const form = reactive({
  title: "",
  price: "",
  condition: "",
  description: "",
  detail: "",
  story: "",
  category_ids: [""],
  image: null,
});

// =====================================
// ERRORS
// =====================================

const errors = reactive({
  title: "",
  price: "",
  condition: "",
  description: "",
  category_ids: "",
  image: "",
});

// =====================================
// FORMAT DATE
// =====================================

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// =====================================
// GET PRODUCTS
// =====================================

const getProducts = async () => {
  try {
    loading.value = true;

    const response = await api.get("/api/profile/products?page=1&per_page=20");

    console.log("PRODUCTS:", response.data);

    products.value = response.data.data || [];
  } catch (error) {
    console.log(error);

    showToast(error.response?.data?.message || "Get Products Failed", "error");
  } finally {
    loading.value = false;
  }
};

// =====================================
// GET CATEGORIES
// =====================================

const getCategories = async () => {
  try {
    categoryLoading.value = true;

    const response = await api.get("/api/categories");

    console.log("CATEGORIES:", response.data);

    categories.value = response.data.data || [];
  } catch (error) {
    console.log(error);

    showToast(error.response?.data?.message || "Get Categories Failed", "error");
  } finally {
    categoryLoading.value = false;
  }
};

// =====================================
// VALIDATE FORM
// =====================================

const validateForm = () => {
  let isValid = true;

  errors.title = "";
  errors.price = "";
  errors.condition = "";
  errors.description = "";
  errors.category_ids = "";
  errors.image = "";

  if (!form.title.trim()) {
    errors.title = "Title is required";
    isValid = false;
  }

  if (!form.price && form.price !== 0) {
    errors.price = "Price is required";
    isValid = false;
  }

  if (!form.condition.trim()) {
    errors.condition = "Condition is required";
    isValid = false;
  }

  if (!form.description.trim()) {
    errors.description = "Description is required";
    isValid = false;
  }

  if (
    form.category_ids[0] === "" ||
    form.category_ids[0] === null ||
    form.category_ids[0] === undefined
  ) {
    errors.category_ids = "Category is required";
    isValid = false;
  }

  if (!isEdit.value && !form.image) {
    errors.image = "Image is required";
    isValid = false;
  }

  return isValid;
};

// =====================================
// HANDLE IMAGE
// =====================================

const handleImage = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  form.image = file;
  imagePreview.value = URL.createObjectURL(file);
};

// =====================================
// RESET FORM
// =====================================

const resetForm = () => {
  form.title = "";
  form.price = "";
  form.condition = "";
  form.description = "";
  form.detail = "";
  form.story = "";
  form.category_ids = [""];
  form.image = null;

  imagePreview.value = "";

  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }

  errors.title = "";
  errors.price = "";
  errors.condition = "";
  errors.description = "";
  errors.category_ids = "";
  errors.image = "";
};

// =====================================
// OPEN ADD MODAL
// =====================================

const openAddModal = () => {
  resetForm();
  isEdit.value = false;

  currentProductId.value = null;

  showModal.value = true;
};

// =====================================
// OPEN EDIT MODAL
// =====================================

const openEditModal = (product) => {
  resetForm();

  isEdit.value = true;

  currentProductId.value = product.id;

  form.title = product.title || "";
  form.price = product.price ?? "";
  form.condition = product.condition || "";
  form.description = product.description || "";
  form.detail = product.detail || "";
  form.story = product.story || "";

  if (product.categories?.length > 0) {
    form.category_ids = [Number(product.categories[0].id)];
  } else {
    form.category_ids = [""];
  }

  imagePreview.value = product.image || "";

  showModal.value = true;
};

// =====================================
// SAVE PRODUCT
// =====================================

const saveProduct = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    saving.value = true;

    let response;

    // ADD PRODUCT
    if (!isEdit.value) {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("condition", form.condition);
      formData.append("description", form.description);
      formData.append("detail", form.detail || "");
      formData.append("story", form.story || "");
      formData.append(
        "category_ids",
        JSON.stringify([Number(form.category_ids[0])]),
      );

      if (form.image) {
        formData.append("image", form.image);
      }

      response = await api.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast(response.data.message || "បន្ថែមផលិតផលបានជោគជ័យ", "success");
    }

    // UPDATE PRODUCT
    else {
      const updateData = new FormData();

      updateData.append("title", form.title);
      updateData.append("price", form.price);
      updateData.append("condition", form.condition);
      updateData.append("description", form.description);
      updateData.append("detail", form.detail || "");
      updateData.append("story", form.story || "");
      updateData.append(
        "category_ids",
        JSON.stringify([Number(form.category_ids[0])]),
      );

      if (form.image instanceof File) {
        updateData.append("image", form.image);
      }

      response = await api.post(
        `/api/products/${currentProductId.value}`,
        updateData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      showToast(response.data.message || "Update Product Success", "success");
    }

    showModal.value = false;
    getProducts();
  } catch (error) {
    console.log("SAVE ERROR:", error);

    if (error.response?.data?.data) {
      const backendErrors = error.response.data.data;

      if (backendErrors.title) errors.title = backendErrors.title[0];
      if (backendErrors.price) errors.price = backendErrors.price[0];
      if (backendErrors.condition) errors.condition = backendErrors.condition[0];
      if (backendErrors.description) errors.description = backendErrors.description[0];
      if (backendErrors.category_ids) errors.category_ids = backendErrors.category_ids[0];
      if (backendErrors.image) errors.image = backendErrors.image[0];
    }

    showToast(error.response?.data?.message || "Save Product Failed", "error");
  } finally {
    saving.value = false;
  }
};

// =====================================
// DELETE PRODUCT
// =====================================

const deleteProduct = async () => {
  const id = confirmModal.productId;

  try {
    deleting.value = true;

    const response = await api.delete(`/api/products/${id}`);

    showToast(response.data.message || "លុបបានជោគជ័យ", "success");

    products.value = products.value.filter((item) => item.id !== id);

    closeConfirmModal();
  } catch (error) {
    console.log(error);

    showToast(error.response?.data?.message || "Delete Failed", "error");
  } finally {
    deleting.value = false;
  }
};

// =====================================
// PAGINATION
// =====================================

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

// =====================================
// MOUNTED
// =====================================

onMounted(() => {
  getProducts();
  getCategories();
});
</script>

<template>
  <div class="card card-ui p-4">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4>ផលិតផលរបស់ខ្ញុំ</h4>
      <button @click="openAddModal" class="btn btn-primary">
        បន្ថែមផលិតផល
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Date</th>
            <th>Action</th>
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
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Date</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="products.length === 0">
            <td colspan="7" class="text-center text-muted py-4">
              គ្មានផលិតផលទេ
            </td>
          </tr>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td>{{ product.id }}</td>
            <td>
              <img
                :src="product.image"
                class="product-img"
                :alt="product.title"
              />
            </td>
            <td>{{ product.title }}</td>
            <td>
              <span
                v-for="category in product.categories"
                :key="category.id"
                class="badge bg-primary me-1"
              >
                {{ category.name }}
              </span>
            </td>
            <td>${{ product.price }}</td>
            <td>{{ formatDate(product.created_at) }}</td>
            <td>
              <div class="d-flex justify-content-center gap-2">
                <button
                  @click="openEditModal(product)"
                  class="btn btn-warning btn-sm"
                >
                  Edit
                </button>
                <button
                  @click="openConfirmModal(product.id)"
                  class="btn btn-danger btn-sm"
                >
                  Delete
                </button>
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
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          class="btn"
          :class="currentPage === page ? 'btn-primary' : 'btn-outline-primary'"
        >
          {{ page }}
        </button>
        <button
          class="btn btn-outline-primary"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>

  <!-- ADD / EDIT MODAL -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-box mt-5" style="height: 85%;width: 90%;max-width: 650px;">
      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold mb-0">
          {{ isEdit ? "Edit Product" : "Add Product" }}
        </h4>
        <button @click="showModal = false" class="btn-close"></button>
      </div>

      <!-- TITLE -->
      <div class="mb-3">
        <label class="form-label">Product Title</label>
        <input
          v-model="form.title"
          type="text"
          class="form-control"
          placeholder="Enter product title"
        />
        <small class="text-danger">{{ errors.title }}</small>
      </div>

      <!-- PRICE -->
      <div class="mb-3">
        <label class="form-label">Price</label>
        <input
          v-model="form.price"
          type="number"
          class="form-control"
          placeholder="Enter price"
        />
        <small class="text-danger">{{ errors.price }}</small>
      </div>

      <!-- CATEGORY -->
      <div class="mb-3">
        <label class="form-label">Category</label>
        <select v-model="form.category_ids[0]" class="form-select">
          <option disabled value="">Select category</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="Number(category.id)"
          >
            {{ category.name }}
          </option>
        </select>
        <small class="text-danger">{{ errors.category_ids }}</small>
      </div>

      <!-- CONDITION -->
      <div class="mb-3">
        <label class="form-label">Condition</label>
        <input
          v-model="form.condition"
          type="text"
          class="form-control"
          placeholder="New / Old"
        />
        <small class="text-danger">{{ errors.condition }}</small>
      </div>

      <!-- DESCRIPTION -->
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="form-control"
          placeholder="Enter description"
        ></textarea>
        <small class="text-danger">{{ errors.description }}</small>
      </div>

      <!-- DETAIL -->
      <div class="mb-3">
        <label class="form-label">Detail</label>
        <textarea
          v-model="form.detail"
          rows="3"
          class="form-control"
          placeholder="Enter detail"
        ></textarea>
      </div>

      <!-- STORY -->
      <div class="mb-3">
        <label class="form-label">Story</label>
        <textarea
          v-model="form.story"
          rows="3"
          class="form-control"
          placeholder="Enter story"
        ></textarea>
      </div>

      <!-- IMAGE -->
      <div class="mb-3">
        <label class="form-label">Product Image</label>
        <input
          ref="fileInputRef"
          type="file"
          class="form-control"
          accept="image/*"
          @change="handleImage"
        />
        <small class="text-danger">{{ errors.image }}</small>
      </div>

      <!-- PREVIEW -->
      <div v-if="imagePreview" class="mb-3">
        <img :src="imagePreview" class="preview-img" alt="Preview" />
      </div>

      <!-- BUTTONS -->
      <div class="d-flex gap-2">
        <button @click="saveProduct" class="btn btn-success" :disabled="saving">
          {{ saving ? "Loading..." : isEdit ? "Update Product" : "Save Product" }}
        </button>
        <button @click="showModal = false" class="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  </div>

  <!-- DELETE CONFIRM MODAL -->
  <div v-if="confirmModal.show" class="modal-overlay">
    <div class="confirm-box">
      <!-- Icon -->
      <div class="confirm-icon-wrap">
        <div class="confirm-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
          </svg>
        </div>
      </div>

      <!-- Text -->
      <h5 class="confirm-title">លុបផលិតផល?</h5>
      <p class="confirm-message">
        តើអ្នកប្រាកដជាចង់លុបផលិតផលនេះមែនទេ?<br/>
        សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
      </p>

      <!-- Buttons -->
      <div class="confirm-actions">
        <button
          @click="closeConfirmModal"
          class="btn btn-secondary confirm-btn"
          :disabled="deleting"
        >
          បោះបង់
        </button>
        <button
          @click="deleteProduct"
          class="btn btn-danger confirm-btn"
          :disabled="deleting"
        >
          <span v-if="deleting">
            <span class="spinner-border spinner-border-sm me-1"></span>
            កំពុងលុប...
          </span>
          <span v-else>លុប</span>
        </button>
      </div>
    </div>
  </div>

  <!-- TOAST -->
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
        <button class="toast-close" @click="removeToast(toast.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
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