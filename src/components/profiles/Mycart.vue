<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/API/api";

const router = useRouter();

// =========================
// STATES
// =========================

const cartItems = ref([]);

const loading = ref(false);

const selectedItems = ref([]);

// =========================
// GET CART
// API => /api/profile/carts
// =========================

const getCart = async () => {
  try {
    loading.value = true;

    // const response = await api.get("/api/profile/carts");

    const response = await api.post("/api/profile/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
    console.log(error);

    console.log(error.response);

    console.log(error.response?.data);

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
// ONLY SELECTED PRODUCTS
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

    const response = await api.delete(`/api/cart/remove/${id}`);

    console.log(response.data);

    // remove from ui
    cartItems.value = cartItems.value.filter((item) => item.id !== id);

    // remove selected
    selectedItems.value = selectedItems.value.filter((itemId) => itemId !== id);

    alert(response.data.message || "Remove Success");
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Remove Failed");
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
    <!-- =========================
         HEADER
    ========================== -->

    <!-- skeleton header -->
    <!-- <div
      v-if="loading"
      class="d-flex justify-content-between align-items-center mb-4"
    >
      <div class="skeleton skeleton-title"></div>

      <div class="skeleton skeleton-btn"></div>
    </div> -->

    <!-- real header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4>របស់ខ្ញុំ</h4>

      <button @click="checkout" class="btn btn-success">ទូទាត់ប្រាក់</button>
    </div>

    <!-- =========================
         TABLE
    ========================== -->

    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <!-- select all -->
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
          <!-- =========================
               SKELETON LOADING
          ========================== -->

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

          <!-- =========================
               EMPTY
          ========================== -->

          <tr v-else-if="cartItems.length === 0">
            <td colspan="8" class="text-center text-muted py-5">
              គ្មានផលិតផលនៅក្នុងរទេះទិញទេ។
            </td>
          </tr>

          <!-- =========================
               PRODUCTS
          ========================== -->

          <tr v-else v-for="item in cartItems" :key="item.id">
            <!-- checkbox -->
            <td>
              <input type="checkbox" :value="item.id" v-model="selectedItems" />
            </td>

            <!-- image -->
            <td>
              <img :src="item.product.image" class="product-img" />
            </td>

            <!-- title -->
            <td>
              {{ item.product.title }}
            </td>

            <!-- categories -->
            <td>
              <span
                v-for="category in item.product.categories"
                :key="category.id"
                class="badge bg-primary me-1"
              >
                {{ category.name }}
              </span>
            </td>

            <!-- price -->
            <td>${{ item.price }}</td>

            <!-- qty -->
            <td>
              {{ item.qty }}
            </td>

            <!-- total -->
            <td>
              <span :class="isSelected(item.id) ? 'text-success fw-bold' : ''">
                ${{ (item.price * item.qty).toFixed(2) }}
              </span>
            </td>

            <!-- action -->
            <td>
              <button
                @click="removeCart(item.id)"
                class="btn btn-danger btn-sm"
              >
                លុប
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- =========================
         GRAND TOTAL
    ========================== -->

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
.product-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
}

.card-ui {
  border: none;
  border-radius: 20px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
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

.skeleton-title {
  width: 180px;
  height: 32px;
}

.skeleton-btn {
  width: 140px;
  height: 42px;
  border-radius: 12px;
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

@keyframes shimmer {
  100% {
    left: 100%;
  }
}
</style>
