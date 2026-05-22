<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "@/API/api";


// products State
const products = ref([]);

// loading
const loading = ref(false);

// modal
const showModal = ref(false);

// edit mode
const isEdit = ref(false);

// current product id
const currentProductId = ref(null);

// image preview
const imagePreview = ref("");

// errors
const errors = reactive({
  title: "",
  price: "",
  condition: "",
  description: "",
  category_id: "",
});

// form
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

// =========================
// GET PRODUCTS
// =========================

const getProducts = async () => {
  try {
    loading.value = true;

    const response = await api.get("/api/profile/products?page=1&per_page=20");

    console.log(response.data);

    products.value = response.data.data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// =========================
// VALIDATE
// =========================

const validateForm = () => {
  let isValid = true;

  // reset
  errors.title = "";
  errors.price = "";
  errors.condition = "";
  errors.description = "";
  errors.category_id = "";

  // title
  if (!form.title) {
    errors.title = "Title is required";

    isValid = false;
  }

  // price
  if (!form.price) {
    errors.price = "Price is required";

    isValid = false;
  }

  // condition
  if (!form.condition) {
    errors.condition = "Condition is required";

    isValid = false;
  }

  // description
  if (!form.description) {
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

// =========================
// HANDLE IMAGE
// =========================

const handleImage = (event) => {
  const file = event.target.files[0];

  form.image = file;

  if (file) {
    imagePreview.value = URL.createObjectURL(file);
  }
};

// =========================
// RESET FORM
// =========================

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
};

// =========================
// OPEN ADD MODAL
// =========================

const openAddModal = () => {
  resetForm();

  isEdit.value = false;

  currentProductId.value = null;

  showModal.value = true;
};

// =========================
// OPEN EDIT MODAL
// =========================

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
  if (product.categories && product.categories.length > 0) {
    form.category_id = product.categories[0].id;
  }

  imagePreview.value = product.image;

  showModal.value = true;
};

// =========================
// SAVE PRODUCT
// =========================

const saveProduct = async () => {
  // validate
  if (!validateForm()) {
    return;
  }

  try {
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

    // =========================
    // ADD PRODUCT
    // =========================

    if (!isEdit.value) {
      response = await api.post("/api/profile/product/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message || "Product Added Successfully");
    } else {
      // =========================
      // UPDATE PRODUCT
      // =========================

      response = await api.post(
        `/api/profile/product/update/${currentProductId.value}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert(response.data.message || "Product Updated Successfully");
    }

    // close modal
    showModal.value = false;

    // refresh
    getProducts();
  } catch (error) {
    console.log(error);

    console.log(error.response);

    console.log(error.response?.data);

    alert(error.response?.data?.message || "Save Product Failed");
  }
};

// =========================
// DELETE PRODUCT
// =========================

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

// =========================
// MOUNTED
// =========================

onMounted(() => {
  getProducts();
});
</script>

<template>
  <div class="card card-ui p-4">
    <!-- header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4>ផលិតផលរបស់ខ្ញុំ</h4>

      <button @click="openAddModal" class="btn btn-primary">Add Product</button>
    </div>

    <!-- loading -->
    <div v-if="loading" class="text-center py-5">Loading...</div>

    <!-- table -->
    <table v-else class="table table-hover align-middle">
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
        <!-- empty -->
        <tr v-if="products.length === 0">
          <td colspan="7" class="text-center text-muted">No Products</td>
        </tr>

        <!-- products -->
        <tr v-for="product in products" :key="product.id">
          <!-- id -->
          <td>#{{ product.id }}</td>

          <!-- image -->
          <td>
            <img :src="product.image" class="product-img" />
          </td>

          <!-- title -->
          <td>
            {{ product.title }}
          </td>

          <!-- category -->
          <td>
            <span
              v-for="category in product.categories"
              :key="category.id"
              class="badge bg-primary me-1"
            >
              {{ category.name }}
            </span>
          </td>

          <!-- price -->
          <td>${{ product.price }}</td>

          <!-- date -->
          <td>
            {{ product.created_at }}
          </td>

          <!-- action -->
          <td>
            <div class="d-flex gap-2">
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

  <!-- =========================
        MODAL
  ========================== -->

  <div v-if="showModal" class="z-index-1001 modal-overlay">
    <div class="modal-box">
      <!-- header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4>
          {{ isEdit ? "Edit Product" : "Add Product" }}
        </h4>

        <button @click="showModal = false" class="btn-close"></button>
      </div>

      <!-- title -->
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

      <!-- price -->
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

      <!-- category -->
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

      <!-- condition -->
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

      <!-- description -->
      <div class="mb-3">
        <label class="form-label"> Description </label>

        <textarea
          v-model="form.description"
          class="form-control"
          rows="3"
          placeholder="Enter description"
        ></textarea>

        <small class="text-danger">
          {{ errors.description }}
        </small>
      </div>

      <!-- detail -->
      <div class="mb-3">
        <label class="form-label"> Detail </label>

        <textarea
          v-model="form.detail"
          class="form-control"
          rows="3"
          placeholder="Enter detail"
        ></textarea>
      </div>

      <!-- story -->
      <div class="mb-3">
        <label class="form-label"> Story </label>

        <textarea
          v-model="form.story"
          class="form-control"
          rows="3"
          placeholder="Enter story"
        ></textarea>
      </div>

      <!-- image -->
      <div class="mb-3">
        <label class="form-label"> Product Image </label>

        <input
          type="file"
          class="form-control"
          accept="image/*"
          @change="handleImage"
        />
      </div>

      <!-- preview -->
      <div v-if="imagePreview" class="mb-3">
        <img :src="imagePreview" class="preview-img" />
      </div>

      <!-- buttons -->
      <div class="d-flex gap-2">
        <button @click="saveProduct" class="btn btn-success">
          {{ isEdit ? "Update Product" : "Save Product" }}
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

  width: 600px;

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
