<template>
  <Navbar/>
  <div class="sell-page-container">
    <div class="card sell-card mb-5">
      <div class="card-header bg-white border-0 pt-4">
        <h4 class="fw-bold">{{ isEdit ? 'Edit Product' : 'Sell a Product' }}</h4>
        <p class="text-muted mb-0">Fill out the details below to list your item.</p>
      </div>

      <div class="card-body">
        <div class="row">
          
          <!-- LEFT SIDE: IMAGE UPLOAD -->
          <div class="col-lg-5 border-end pe-lg-5">
            <label class="form-label fw-semibold">Product Image</label>
            <!-- Image Preview / Drop Zone -->
            <div class="image-upload-zone" :class="{ 'has-image': imagePreview }">
              <img v-if="imagePreview" :src="imagePreview" class="preview-img" alt="Preview" />
              <div v-else class="upload-placeholder">
                <i class="bi bi-cloud-arrow-up"></i>
                <span>Click or drag to upload</span>
              </div>
              <input type="file" class="file-input" accept="image/*" @change="handleImage" />
            </div>
            <small class="text-danger mt-2 d-block">{{ errors.image }}</small>
          </div>

          <!-- RIGHT SIDE: FORM FIELDS -->
          <div class="col-lg-7 ps-lg-5 mt-4 mt-lg-0">
            
            <!-- Title -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Title</label>
              <input v-model="form.title" type="text" class="form-control" placeholder="e.g. Gaming PC, iPhone 14" />
              <small class="text-danger">{{ errors.title }}</small>
            </div>

            <!-- Price & Condition Row -->
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Price ($)</label>
                <input v-model="form.price" type="number" class="form-control" placeholder="0.00" />
                <small class="text-danger">{{ errors.price }}</small>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Condition</label>
                <select v-model="form.condition" class="form-select">
                  <option disabled value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
                <small class="text-danger">{{ errors.condition }}</small>
              </div>
            </div>

            <!-- Category -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Category</label>
              <select v-model="form.category_ids[0]" class="form-select">
                <option disabled value="">Select a category</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <small class="text-danger">{{ errors.category_ids}}</small>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Description</label>
              <textarea v-model="form.description" rows="3" class="form-control" placeholder="Brief overview of the product"></textarea>
              <small class="text-danger">{{ errors.description }}</small>
            </div>

            <!-- Detail -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Detail</label>
              <textarea v-model="form.detail" rows="2" class="form-control" placeholder="Specifications (e.g. RTX 4070, 32GB RAM)"></textarea>
              <small class="text-danger">{{ errors.detail }}</small>

            </div>

            <!-- Story -->
            <div class="mb-4">
              <label class="form-label fw-semibold">Story</label>
              <textarea v-model="form.story" rows="2" class="form-control" placeholder="Why are you selling it?"></textarea>
              <small class="text-danger">{{ errors.story }}</small>

            </div>

            <!-- Action Buttons -->
            <div class="d-flex gap-2">
              <button @click="saveProduct" class="btn btn-primary btn-lg flex-grow-1" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEdit ? 'Update Product' : 'Post Product' }}
              </button>
              <button v-if="isEdit" @click="resetForm" class="btn btn-outline-secondary btn-lg">
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- toast  -->
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

<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "@/API/api";
import Navbar from "@/components/layout/Navbar.vue";
import { useRoute } from "vue-router";
import router from "@/router";

const route = useRoute()

// toasts
const toasts = ref([]);
const showToast = (message, type = "success") => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3500);
};
const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const categoryLoading = ref(false);
const showModal = ref(false);
const isEdit = ref(false);
const currentProductId = ref(null);
const fetchLoading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const imagePreview = ref("");
const fileInputRef = ref(null);
// form 
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
// errors 
const errors = reactive({
  title: "",
  price: "",
  condition: "",
  description: "",
  detail: "",    
  story: "",    
  category_ids: "",
  image: "",
});
const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("km-KH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
const getCategories = async () => {
  try {
    categoryLoading.value = true;
    const response = await api.get("/api/categories");
    // console.log("CATEGORIES:", response.data);
    categories.value = response.data.data || [];
  } catch (error) {
    console.log(error);
    showToast(
      error.response?.data?.message || "Get Categories Failed",
      "error",
    );
  } finally {
    categoryLoading.value = false;
  }
};

// 3. UPDATED FUNCTION: Fetch Single Product Data
const fetchProductData = async (id) => {
  try {
    fetchLoading.value = true;
    const response = await api.get(`/api/products/${id}`);
    let product = response.data.data;
    if (!product) {
      product = response.data; 
    }
    if (product) {
      editProduct(product);
    } else {
      console.error("Product data is empty in response");
      showToast("Could not load product data", "error");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    showToast("Failed to load product details", "error");
  } finally {
    fetchLoading.value = false;
  }
};
// resetForm
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
// validateForm

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
const handleImage = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  form.image = file;
  imagePreview.value = URL.createObjectURL(file);
};
const saveProduct = async () => {
  if (!validateForm()) {return;}
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
      showToast("បន្ថែមផលិតផលបានជោគជ័យ", "success");
      resetForm()
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
      response = await api.post(`/api/products/${currentProductId.value}`,updateData,{
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      showToast( "អាប់ដែតផលិតផលបានជោគជ័យ", "success");
      router.push('/profile');
      resetForm();
      
    }
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
//edit product
const editProduct = (product) => {
  if (!product) return;
  isEdit.value = true;
  currentProductId.value = product.id;
  form.title = product.title;
  form.price = product.price;
  form.condition = product.condition;
  form.description = product.description;
  form.detail = product.detail || "";
  form.story = product.story || "";

  if (product.categories && product.categories.length > 0) {
    form.category_ids = [product.categories[0].id];
  } else {
    form.category_ids = [""];
  }
  imagePreview.value = product.image || "";
  form.image = null; 
};
onMounted(() => {
  getCategories();
  if (route.params.id) {
    fetchProductData(route.params.id);
  }
});
</script>

<style scoped>
.sell-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* SELL CARD STYLES */
.sell-card, .listings-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

/* IMAGE UPLOAD ZONE */
.image-upload-zone {
  position: relative;
  width: 100%;
  min-height: 300px;
  background-color: #f8f9fa;
  border: 2px dashed #ced4da;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

.image-upload-zone:hover {
  border-color: #0d6efd;
  background-color: #f0f6ff;
}

.image-upload-zone.has-image {
  border-style: solid;
  border-color: #198754;
}

.file-input {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%; height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.upload-placeholder {
  text-align: center;
  color: #6c757d;
  pointer-events: none;
}

.upload-placeholder i {
  font-size: 4rem;
  display: block;
  margin-bottom: 0.5rem;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: absolute;
  top: 0; left: 0;
  pointer-events: none;
  padding: 1rem;
}

/* TABLE STYLES */
.listing-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}

/* FORM CONTROLS */
.form-control, .form-select {
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.form-control:focus, .form-select:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}
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

.toast-success {
  background: #22c55e;
}
.toast-error {
  background: #ef4444;
}

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

.toast-close:hover {
  color: #fff;
}

.toast-enter-active {
  animation: toast-in 0.3s ease;
}
.toast-leave-active {
  animation: toast-in 0.25s ease reverse;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>