<template>
  <div class="checkout-container bg-white p-8 rounded shadow-md max-w-3xl mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-6">Check Out</h1>
    <div class="mb-6">
      <!-- Cart Items List (example, replace with real data) -->
      <div v-for="item in cartItems" :key="item.id" class="flex items-center justify-between border-b py-4">
        <div class="flex items-center gap-4">
          <img :src="item.image" alt="Product" class="w-16 h-16 object-cover rounded" />
          <div>
            <div class="font-semibold">{{ item.name }}</div>
            <div class="text-gray-500 text-sm">Qty: {{ item.quantity }}</div>
          </div>
        </div>
        <div class="font-semibold">${{ item.price }}</div>
      </div>
    </div>
    <div class="mb-6">
      <label class="block font-medium mb-2">Shipping Address</label>
      <input v-model="address" type="text" class="w-full border rounded px-4 py-2" placeholder="Enter your address" />
    </div>
    <div class="mb-6">
      <label class="block font-medium mb-2">Payment Method</label>
      <select v-model="paymentMethod" class="w-full border rounded px-4 py-2">
        <option value="cash">Cash</option>
        <option value="card">Card</option>
      </select>
    </div>
    <div class="flex justify-between items-center mb-6">
      <div class="font-bold text-lg">Total:</div>
      <div class="font-bold text-lg">${{ totalPrice }}</div>
    </div>
    <button @click="checkout" :disabled="loading" class="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">
      <span v-if="!loading">Confirm Checkout</span>
      <span v-else>Processing...</span>
    </button>
    <div v-if="message" class="mt-4 text-center text-green-600">{{ message }}</div>
    <div v-if="error" class="mt-4 text-center text-red-600">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CheckoutView',
  data() {
    return {
      cartItems: [
        // Example items, replace with real cart data
        { id: 1, name: 'SMART PHONE', quantity: 1, price: 1099, image: 'https://via.placeholder.com/64' },
        { id: 2, name: 'SMART PHONE', quantity: 1, price: 1099, image: 'https://via.placeholder.com/64' },
        { id: 3, name: 'MOUSE', quantity: 1, price: 25, image: 'https://via.placeholder.com/64' },
      ],
      address: '',
      paymentMethod: 'cash',
      loading: false,
      message: '',
      error: '',
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
  },
  methods: {
    async checkout() {
      this.loading = true;
      this.message = '';
      this.error = '';
      try {
        const response = await axios.post('https://api-loukbontor.g2.ant.com.kh/api/carts/checkout', {
          address: this.address,
          payment_method: this.paymentMethod,
          items: this.cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
          })),
        });
        this.message = 'Checkout successful!';
      } catch (err) {
        this.error = err.response?.data?.message || 'Checkout failed.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.bg-white {
  background-color: #fff;
}
</style>
