<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/API/api";

const router = useRouter();

// cart items
const cartItems = ref([]);

// loading
const loading = ref(false);

// get cart
const getCart = async () => {

  try {

    loading.value = true;

    const response = await api.get(
      "/api/cart/my-cart"
    );

    console.log(response.data);

    // store items
    cartItems.value =
      response.data.data.items;

  } catch (error) {

    console.log(error);

  } finally {

    loading.value = false;
  }
};

// grand total
const grandTotal = computed(() => {

  return cartItems.value.reduce(
    (total, item) => {

      return total + (
        item.price * item.qty
      );

    },
    0
  );

});

// remove cart
const removeCart = async (id) => {

  try {

    await api.delete(
      `/api/cart/remove/${id}`
    );

    // remove from UI
    cartItems.value =
      cartItems.value.filter(
        (item) => item.id !== id
      );

  } catch (error) {

    console.log(error);
  }
};

// checkout
const checkout = () => {

  router.push("/checkout");

};

onMounted(() => {
  getCart();
});
</script>

<template>

  <div class="card card-ui p-4">

    <!-- header -->
    <div
      class="d-flex justify-content-between align-items-center mb-4"
    >

      <h4>របស់ខ្ញុំ</h4>

      <button
        @click="checkout"
        class="btn btn-success"
      >
        ទូទាត់ប្រាក់
      </button>

    </div>

    <!-- table -->
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

        <!-- loading -->
        <tr v-if="loading">

          <td
            colspan="7"
            class="text-center"
          >
            Loading...
          </td>

        </tr>

        <!-- empty -->
        <tr
          v-else-if="cartItems.length === 0"
        >

          <td
            colspan="7"
            class="text-center text-muted"
          >
            No Cart Items
          </td>

        </tr>

        <!-- dynamic cart -->
        <tr
          v-for="item in cartItems"
          :key="item.id"
        >

          <!-- image -->
          <td>

            <img
              :src="item.product.image"
              class="product-img"
            />

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
          <td>
            ${{ item.price }}
          </td>

          <!-- qty -->
          <td>
            {{ item.qty }}
          </td>

          <!-- total -->
          <td>
            ${{ (item.price * item.qty).toFixed(2) }}
          </td>

          <!-- action -->
          <td>

            <button
              @click="removeCart(item.id)"
              class="btn btn-danger btn-sm"
            >
              Remove
            </button>

          </td>

        </tr>

      </tbody>

    </table>

    <!-- grand total -->
    <div
      class="d-flex justify-content-end mt-3"
    >

      <h5>

        Grand Total:

        <span class="text-success">
          ${{ grandTotal.toFixed(2) }}
        </span>

      </h5>

    </div>

  </div>

</template>

<style scoped>

.product-img{
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
}

.card-ui{
  border: none;
  border-radius: 20px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.05);
}

</style>