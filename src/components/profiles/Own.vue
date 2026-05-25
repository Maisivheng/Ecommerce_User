<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "@/API/api";

// ==============================
// STATES
// ==============================

const products = ref([]);
const loading = ref(false);

const showModal = ref(false);

const isEdit = ref(false);

const currentProductId = ref(null);

const saving = ref(false);

// image preview
const imagePreview = ref("");

// ==============================
// FORM
// ==============================

const form = reactive({
  title: "",
  price: "",
  condition: "",
  description: "",
  detail: "",
  story: "",
  category_id: "",
  image: null,
});

// ==============================
// ERRORS
// ==============================

const errors = reactive({
  title: "",
  price: "",
  condition: "",
  description: "",
  category_id: "",
  image: "",
});

// ==============================
// GET PRODUCTS
// ==============================

const getProducts = async () => {
  try {
    loading.value = true;

    const response = await api.get("/api/profile/products?page=1&per_page=20");

    console.log(response.data);

    products.value = response.data.data || [];
  } catch (error) {
    console.log(error);

    alert("Get Products Failed");
  } finally {
    loading.value = false;
  }
};

// ==============================
// VALIDATE FORM
// ==============================

const validateForm = () => {
  let isValid = true;

  // reset errors
  errors.title = "";
  errors.price = "";
  errors.condition = "";
  errors.description = "";
  errors.category_id = "";
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
  if (!form.category_id) {
    errors.category_id = "Category ID is required";
    isValid = false;
  }

  return isValid;
};

// ==============================
// HANDLE IMAGE
// ==============================

const handleImage = (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  form.image = file;

  imagePreview.value = URL.createObjectURL(file);
};

// ==============================
// RESET FORM
// ==============================

const resetForm = () => {
  form.title = "";
  form.price = "";
  form.condition = "";
  form.description = "";
  form.detail = "";
  form.story = "";
  form.category_id = "";
  form.image = null;

  imagePreview.value = "";

  errors.title = "";
  errors.price = "";
  errors.condition = "";
  errors.description = "";
  errors.category_id = "";
  errors.image = "";
};

// ==============================
// OPEN ADD MODAL
// ==============================

const openAddModal = () => {
  resetForm();

  isEdit.value = false;

  currentProductId.value = null;

  showModal.value = true;
};

// ==============================
// OPEN EDIT MODAL
// ==============================

const openEditModal = (product) => {
  resetForm();

  isEdit.value = true;

  currentProductId.value = product.id;

  form.title = product.title;
  form.price = product.price;
  form.condition = product.condition;
  form.description = product.description;
  form.detail = product.detail;
  form.story = product.story;

  // category
  if (product.categories?.length > 0) {
    form.category_id = product.categories[0].id;
  }

  imagePreview.value = product.image;

  showModal.value = true;
};

// ==============================
// SAVE PRODUCT
// ==============================

const saveProduct = async () => {
  // validate
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

    formData.append("category_id", form.category_id);

    // image
    if (form.image) {
      formData.append("image", form.image);
    }

    let response;

    // ==========================
    // ADD PRODUCT
    // ==========================

    if (!isEdit.value) {
      response = await api.post("/api/profile/product/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message || "Add Product Success");
    }

    // ==========================
    // UPDATE PRODUCT
    // ==========================
    else {
      response = await api.post(
        `/api/profile/product/update/${currentProductId.value}`,
        formData,
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

    // refresh data
    getProducts();
  } catch (error) {
    console.log(error);

    console.log(error.response?.data);

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

      if (backendErrors.category_id) {
        errors.category_id = backendErrors.category_id[0];
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

// ==============================
// DELETE PRODUCT
// ==============================

const deleteProduct = async (id) => {
  const confirmDelete = confirm("Are you sure delete this product?");

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await api.delete(`/api/profile/product/delete/${id}`);

    alert(response.data.message || "Delete Successfully");

    // remove ui
    products.value = products.value.filter((item) => item.id !== id);
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Delete Failed");
  }
};

// ==============================
// MOUNTED
// ==============================

onMounted(() => {
  getProducts();
});
</script>

<template>
  <div class="card card-ui p-4">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="">ផលិតផលរបស់ខ្ញុំ</h4>

      <button @click="openAddModal" class="btn btn-primary">
        + Add Product
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-5">Loading...</div>

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
          <!-- EMPTY -->
          <tr v-if="products.length === 0">
            <td colspan="7" class="text-center text-muted py-4">No Products</td>
          </tr>

          <!-- PRODUCTS -->
          <tr v-for="product in products" :key="product.id">
            <td>#{{ product.id }}</td>

            <!-- IMAGE -->
            <td>
              <img :src="product.image" class="product-img" />
            </td>

            <!-- TITLE -->
            <td>
              {{ product.title }}
            </td>

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
              {{ product.created_at }}
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
      </table>
    </div>
  </div>

  <!-- =========================
        MODAL
  ========================== -->

  <div v-if="showModal" class="modal-overlay">
    <div class="modal-box">
      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold">
          {{ isEdit ? "Edit Product" : "Add Product" }}
        </h4>

        <button @click="showModal = false" class="btn-close"></button>
      </div>

      <!-- TITLE -->
      <div class="mb-3">
        <label class="form-label"> Product Title </label>

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
        <label class="form-label"> Price </label>

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

      <!-- CATEGORY -->
      <div class="mb-3">
        <label class="form-label"> Category ID </label>

        <input
          v-model="form.category_id"
          type="number"
          class="form-control"
          placeholder="Enter category id"
        />

        <small class="text-danger">
          {{ errors.category_id }}
        </small>
      </div>

      <!-- CONDITION -->
      <div class="mb-3">
        <label class="form-label"> Condition </label>

        <input
          v-model="form.condition"
          type="text"
          class="form-control"
          placeholder="Example: New / Old"
        />

        <small class="text-danger">
          {{ errors.condition }}
        </small>
      </div>

      <!-- DESCRIPTION -->
      <div class="mb-3">
        <label class="form-label"> Description </label>

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
        <label class="form-label"> Detail </label>

        <textarea
          v-model="form.detail"
          rows="3"
          class="form-control"
          placeholder="Enter detail"
        ></textarea>
      </div>

      <!-- STORY -->
      <div class="mb-3">
        <label class="form-label"> Story </label>

        <textarea
          v-model="form.story"
          rows="3"
          class="form-control"
          placeholder="Enter story"
        ></textarea>
      </div>

      <!-- IMAGE -->
      <div class="mb-3">
        <label class="form-label"> Product Image </label>

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
        <img :src="imagePreview" class="preview-img" />
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
</style>
