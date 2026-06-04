<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import api from "@/API/api";

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

const imagePreview = ref("");

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

    alert(error.response?.data?.message || "Get Products Failed");
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

    alert(error.response?.data?.message || "Get Categories Failed");
  } finally {
    categoryLoading.value = false;
  }
};

// =====================================
// VALIDATE FORM
// =====================================

const validateForm = () => {
  let isValid = true;

  // reset errors
  errors.title = "";
  errors.price = "";
  errors.condition = "";
  errors.description = "";
  errors.category_ids = "";
  errors.image = "";

  // title
  if (!form.title.trim()) {
    errors.title = "Title is required";
    isValid = false;
  }

  // price
  if (!form.price) {
    errors.price = "Price is required";
    isValid = false;
  }

  // condition
  if (!form.condition.trim()) {
    errors.condition = "Condition is required";
    isValid = false;
  }

  // description
  if (!form.description.trim()) {
    errors.description = "Description is required";
    isValid = false;
  }

  // category
  if (!form.category_ids[0]) {
    errors.category_ids = "Category is required";
    isValid = false;
  }

  // image
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
  form.price = product.price || "";
  form.condition = product.condition || "";
  form.description = product.description || "";
  form.detail = product.detail || "";
  form.story = product.story || "";

  // FIX: Force category ID to be a Number so it matches the <select> <option> value
  if (product.categories?.length > 0) {
    form.category_ids = [Number(product.categories[0].id)];
  } else {
    form.category_ids = [""];
  }

  // image preview
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

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("condition", form.condition);
    formData.append("description", form.description);
    formData.append("detail", form.detail);
    formData.append("story", form.story);

    // category_ids
    formData.append(
      "category_ids",
      JSON.stringify([Number(form.category_ids[0])]),
    );

    // image
    if (form.image) {
      formData.append("image", form.image);
    }

    // debug
    console.log([...formData.entries()]);

    let response;

    // =====================================
    // ADD PRODUCT
    // =====================================

    if (!isEdit.value) {
      response = await api.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message || "បន្ថែមផលិតផលបានជោគជ័យ");
    }

    // =====================================
    // UPDATE PRODUCT
    // =====================================
    else {
      const updateData = new FormData();

      updateData.append("_method", "PUT");

      updateData.append("title", form.title);
      updateData.append("price", form.price);
      updateData.append("condition", form.condition);
      updateData.append("description", form.description);
      updateData.append("detail", form.detail);
      updateData.append("story", form.story);

      // FIX: Ensure category_ids is converted to a Number array for backend consistency
      updateData.append(
        "category_ids",
        JSON.stringify([Number(form.category_ids[0])]),
      );

      // image optional
      if (form.image) {
        updateData.append("image", form.image);
      }

      response = await api.post(
        `/api/products/${currentProductId.value}`,
        updateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert(response.data.message || "Update Product Success");
    }

    // close modal
    showModal.value = false;

    // refresh
    getProducts();
  } catch (error) {
    console.log("SAVE ERROR:", error);

    console.log("ERROR RESPONSE:", error.response?.data);

    // backend validation
    if (error.response?.data?.data) {
      const backendErrors = error.response.data.data;

      if (backendErrors.title) {
        errors.title = backendErrors.title[0];
      }

      if (backendErrors.price) {
        errors.price = backendErrors.price[0];
      }

      if (backendErrors.condition) {
        errors.condition = backendErrors.condition[0];
      }

      if (backendErrors.description) {
        errors.description = backendErrors.description[0];
      }

      if (backendErrors.category_ids) {
        errors.category_ids = backendErrors.category_ids[0];
      }

      if (backendErrors.image) {
        errors.image = backendErrors.image[0];
      }
    }

    alert(error.response?.data?.message || "Save Product Failed");
  } finally {
    saving.value = false;
  }
};

// =====================================
// DELETE PRODUCT
// =====================================

const deleteProduct = async (id) => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this product?",
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await api.delete(`/api/products/${id}`);

    alert(response.data.message || "Delete Successfully");

    // remove ui
    products.value = products.value.filter((item) => item.id !== id);
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Delete Failed");
  }
};

//==============Pagination===========

const currentPage = ref(1);
const perPage = 6;

/* pagination products */
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;

  return products.value.slice(start, end);
});

/* total pages */
const totalPages = computed(() => {
  return Math.ceil(products.value.length / perPage);
});

/* change page */
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
            <td>
              <div class="skeleton skeleton-id"></div>
            </td>

            <td>
              <div class="skeleton skeleton-image"></div>
            </td>

            <td>
              <div class="skeleton skeleton-text"></div>
            </td>

            <td>
              <div class="skeleton skeleton-badge"></div>
            </td>

            <td>
              <div class="skeleton skeleton-price"></div>
            </td>

            <td>
              <div class="skeleton skeleton-date"></div>
            </td>

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
          <tr class=" w-25" v-for="product in paginatedProducts" :key="product.id">
            <!-- <tr v-for="product in products" :key="product.id"> -->
            <td>{{ product.id }}</td>

            <!-- IMAGE -->

            <td>
              <img
                :src="product.image"
                class="product-img"
                :alt="product.title"
              />
            </td>

            <!-- TITLE -->

            <td>{{ product.title }}</td>

            <!-- CATEGORY -->

            <td>
              <span
                v-for="category in product.categories"
                :key="category.id"
                class="badge bg-primary me-1"
              >
                {{ category.name }}
              </span>
            </td>

            <!-- PRICE -->

            <td>${{ product.price }}</td>

            <!-- DATE -->

            <td>
              {{ formatDate(product.created_at) }}
            </td>

            <!-- ACTION -->

            <td>
              <div class="d-flex justify-content-center gap-2">
                <button
                  @click="openEditModal(product)"
                  class="btn btn-warning btn-sm"
                >
                  Edit
                </button>

                <button
                  @click="deleteProduct(product.id)"
                  class="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <div class="d-flex justify-content-center mt-4 gap-2">
          <!-- PREV -->
          <button
            class="btn btn-outline-primary"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Prev
          </button>

          <!-- PAGE NUMBER -->
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            class="btn"
            :class="
              currentPage === page ? 'btn-primary' : 'btn-outline-primary'
            "
          >
            {{ page }}
          </button>

          <!-- NEXT -->
          <button
            class="btn btn-outline-primary"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </table>
    </div>
  </div>

  <!-- MODAL -->

  <div v-if="showModal" class="modal-overlay">
    <div class="modal-box h-75">
      <!-- HEADER -->

      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold">
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

        <small class="text-danger">
          {{ errors.title }}
        </small>
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

        <small class="text-danger">
          {{ errors.price }}
        </small>
      </div>

      <div class="mb-3">
        <label class="form-label">Category</label>

        <select v-model="form.category_ids[0]" class="form-select">
          <option disabled value="">Select category</option>

          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>

        <small class="text-danger">
          {{ errors.category_ids }}
        </small>
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

        <small class="text-danger">
          {{ errors.condition }}
        </small>
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

        <small class="text-danger">
          {{ errors.description }}
        </small>
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
          type="file"
          class="form-control"
          accept="image/*"
          @change="handleImage"
        />

        <small class="text-danger">
          {{ errors.image }}
        </small>
      </div>

      <!-- PREVIEW -->

      <div v-if="imagePreview" class="mb-3">
        <img :src="imagePreview" class="preview-img" alt="Preview" />
      </div>

      <!-- BUTTONS -->

      <div class="d-flex gap-2">
        <button @click="saveProduct" class="btn btn-success" :disabled="saving">
          {{
            saving ? "Loading..." : isEdit ? "Update Product" : "Save Product"
          }}
        </button>

        <button @click="showModal = false" class="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
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

.preview-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
}

/* =====================================
   SKELETON LOADING
===================================== */

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

.skeleton-id {
  width: 40px;
  height: 20px;
}

.skeleton-image {
  width: 70px;
  height: 70px;
  border-radius: 12px;
}

.skeleton-text {
  width: 160px;
  height: 20px;
}

.skeleton-badge {
  width: 80px;
  height: 25px;
  border-radius: 30px;
}

.skeleton-price {
  width: 70px;
  height: 20px;
}

.skeleton-date {
  width: 120px;
  height: 20px;
}

.skeleton-action {
  width: 70px;
  height: 35px;
  border-radius: 10px;
}
</style>
