<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/API/api";

const router = useRouter();

// =========================
// STATES
// =========================

const cartItems = ref([]);
const selectedItems = ref([]);

const loading = ref(false);

// =========================
// GET MY CART
// API => /api/profile/carts
// =========================

const getCart = async () => {
  try {
    loading.value = true;

    // FIXED
    const response = await api.get("/api/profile/carts");

    console.log("CART RESPONSE:", response.data);

    // API RESPONSE
    // data.items
    cartItems.value = response.data.data.items || [];
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Get Cart Failed");
  } finally {
    loading.value = false;
  }
};

// =========================
// SELECT ALL
// =========================

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    selectedItems.value = cartItems.value.map((item) => item.id);
  } else {
    selectedItems.value = [];
  }
};

// =========================
// CHECK SELECTED
// =========================

const isSelected = (id) => {
  return selectedItems.value.includes(id);
};

// =========================
// GRAND TOTAL
// =========================

const grandTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    if (selectedItems.value.includes(item.id)) {
      return total + item.price * item.qty;
    }

    return total;
  }, 0);
});

// =========================
// REMOVE CART
// =========================

const removeCart = async (id) => {
  const confirmDelete = confirm("តើអ្នកប្រាកដថាចង់លុបផលិតផលនេះមែនទេ?");

  if (!confirmDelete) {
    return;
  }

  try {
    loading.value = true;

    // FIX API DELETE
    const response = await api.delete(`/api/profile/carts/${id}`);

    console.log("DELETE RESPONSE:", response.data);

    // REMOVE UI
    cartItems.value = cartItems.value.filter((item) => item.id !== id);

    // REMOVE SELECTED
    selectedItems.value = selectedItems.value.filter((itemId) => itemId !== id);

    alert(response.data.message || "Delete Success");
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Delete Failed");
  } finally {
    loading.value = false;
  }
};

// =========================
// CHECKOUT
// =========================

const checkout = () => {
  if (selectedItems.value.length === 0) {
    alert("Please select product first");

    return;
  }

  // selected products
  const selectedProducts = cartItems.value.filter((item) =>
    selectedItems.value.includes(item.id),
  );

  console.log(selectedProducts);

  router.push("/checkout");
};

// =========================
// MOUNTED
// =========================

onMounted(() => {
  getCart();
});
</script>

<template>
  <div class="card card-ui p-4">
    <!-- HEADER -->

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4>រទេះទិញរបស់ខ្ញុំ</h4>

      <button @click="checkout" class="btn btn-success">ទូទាត់ប្រាក់</button>
    </div>

    <!-- TABLE -->

    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>
              <input type="checkbox" @change="toggleSelectAll" />
            </th>

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

          <template v-if="loading">
            <tr v-for="n in 5" :key="n">
              <td>
                <div class="skeleton skeleton-check"></div>
              </td>

              <td>
                <div class="skeleton skeleton-img"></div>
              </td>

              <td>
                <div class="skeleton skeleton-text"></div>
              </td>

              <td>
                <div class="d-flex gap-2">
                  <div class="skeleton skeleton-badge"></div>

                  <div class="skeleton skeleton-badge"></div>
                </div>
              </td>

              <td>
                <div class="skeleton skeleton-small"></div>
              </td>

              <td>
                <div class="skeleton skeleton-small"></div>
              </td>

              <td>
                <div class="skeleton skeleton-small"></div>
              </td>

              <td>
                <div class="skeleton skeleton-btn-sm"></div>
              </td>
            </tr>
          </template>

          <!-- EMPTY -->

          <tr v-else-if="cartItems.length === 0">
            <td colspan="8" class="text-center text-muted py-5">
              គ្មានផលិតផលនៅក្នុងរទេះទិញទេ
            </td>
          </tr>

          <!-- PRODUCTS -->

          <tr v-else v-for="item in cartItems" :key="item.id">
            <!-- CHECKBOX -->

            <td>
              <input type="checkbox" :value="item.id" v-model="selectedItems" />
            </td>

            <!-- IMAGE -->

            <td>
              <img
                :src="item.product.image"
                class="product-img"
                :alt="item.product.title"
              />
            </td>

            <!-- TITLE -->

            <td>
              {{ item.product.title }}
            </td>

            <!-- CATEGORY -->

            <td>
              <span
                v-for="category in item.product.categories"
                :key="category.id"
                class="badge bg-primary me-1"
              >
                {{ category.name }}
              </span>
            </td>

            <!-- PRICE -->

            <td>${{ item.price }}</td>

            <!-- QTY -->

            <td>
              {{ item.qty }}
            </td>

            <!-- TOTAL -->

            <td>
              <span :class="isSelected(item.id) ? 'text-success fw-bold' : ''">
                ${{ (item.price * item.qty).toFixed(2) }}
              </span>
            </td>

            <!-- ACTION -->

            <td>
              <button
                @click="removeCart(item.id)"
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

    <div class="d-flex justify-content-end mt-4">
      <div class="total-box">
        <h5 class="mb-0">
          Grand Total :

          <span class="text-success"> ${{ grandTotal.toFixed(2) }} </span>
        </h5>
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

.skeleton-check {
  width: 20px;
  height: 20px;
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
