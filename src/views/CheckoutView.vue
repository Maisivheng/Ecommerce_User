<template>
   <Navbar />
  <div class="checkout-wrapper">

    <!-- Page Title -->
    <h2 class="page-title">កន្រ្តកទំនិញរបស់អ្នក ( {{ totalQuantity }} ទំនិញ)</h2>

    <!-- Cart Items Card -->
    <div class="cart-card">
      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>កន្ត្រករបស់អ្នកទទេ។ សូមបន្ថែមទំនិញទៅកន្ត្រកសិន។</p>
      </div>
      <div v-else class="cart-list">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-img-wrap">
            <img :src="item.image" :alt="displayName(item)" />
          </div>
          <div class="item-details">
            <div class="item-top-row">
              <div>
                <p class="item-cat">{{ displayCategory(item) }}</p>
                <p class="item-name">{{ displayName(item) }}</p>
              </div>
              <div class="item-right">
                <button class="del-btn" @click="removeItem(item.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
                <span class="item-price">${{ (item.price * displayQty(item)).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>
            <div class="qty-row">
              <button class="qty-btn" @click="decreaseQty(item)">−</button>
              <span class="qty-val">{{ displayQty(item) }}</span>
              <button class="qty-btn" @click="increaseQty(item)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Method -->
    <div class="payment-section">
      <p class="payment-label">ជ្រើសរើសសម្រាប់ការដឹកជញ្ជូន</p>
      <div class="payment-options">
        <label
          v-for="method in paymentMethods"
          :key="method.value"
          class="pay-option"
          :class="{ active: selectedPayment === method.value }"
        >
          <input type="radio" :value="method.value" v-model="selectedPayment" hidden />
          <span class="radio-circle" :class="{ checked: selectedPayment === method.value }"></span>
          {{ method.label }}
        </label>
      </div>
    </div>

    <!-- Note -->
    <div class="note-section">
      <p class="note-label">អាសយដ្ឋាន</p>
      <input v-model="note" class="note-input" type="text" placeholder="" />
    </div>

    <!-- Summary -->
    <div class="summary-section">
      <p class="summary-heading">សង្ខេប</p>
      <div class="summary-row">
        <span class="summary-key">ទំនិញសរុប</span>
        <span class="qty-count">{{ totalQuantity }}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">តម្លៃសរុប</span>
        <span class="sum-price">$ {{ totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</span>
      </div>
      <button class="order-btn" @click="placeOrder" :disabled="cartItems.length === 0">
        <span v-if="!loading">បញ្ជាក់ការបញ្ជាទិញ</span>
        <span v-else class="spinner"></span>
      </button>
    </div>

  </div>
  <Footer />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCart } from '@/stores/addToCart'

const cart = useCart()
const selectedPayment = ref('pickup')
const note = ref('')
const loading = ref(false)
const paymentMethods = [
  { value: 'delivery', label: 'ទទួលផ្ទាល់' },
  { value: 'pickup', label: 'ដឹកជញ្ជូន' },
]

const cartItems = computed(() => cart.cartItems)
const totalQuantity = computed(() => cart.totalCartItems)
const totalPrice = computed(() => cart.totalCartPrice)

function displayName(item) {
  return item.title || item.name || 'មិនមានឈ្មោះ'
}

function displayCategory(item) {
  return item.category || item.condition || ''
}

function displayQty(item) {
  return item.qty ?? item.quantity ?? 0
}

function increaseQty(item) {
  const current = displayQty(item)
  cart.updateQty(item.id, current + 1)
}

function decreaseQty(item) {
  const current = displayQty(item)
  if (current > 1) {
    cart.updateQty(item.id, current - 1)
  }
}

function removeItem(id) {
  cart.removeItem(id)
}

async function placeOrder() {
  if (cartItems.value.length === 0) return
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1400))
  loading.value = false
  cart.clearCart()
  alert('ការបញ្ជាទិញបានជោគជ័យ!')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.checkout-wrapper {
  font-family: 'Noto Sans Khmer', sans-serif;
  background: #ffffff;
  min-height: 100vh;
  max-width: 720px;
  margin: 0 auto;
  padding: 28px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Page title */
.page-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

/* ── Cart Card ── */
.cart-card {
  border: 1px solid #d0d0d0;
  border-radius: 10px;
  padding: 14px;
  background: #fff;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #f2f2f2;
  border-radius: 8px;
  padding: 14px 16px;
}

.item-img-wrap {
  width: 72px;
  height: 72px;
  border-radius: 6px;
  overflow: hidden;
  background: #e4e4e4;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-cat {
  font-size: 11px;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 3px;
}

.item-name {
  font-size: 13px;
  color: #222;
  font-weight: 400;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
  flex-shrink: 0;
  margin-left: 8px;
}

.del-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #e04040;
  padding: 0;
  display: flex;
  align-items: center;
}

.del-btn:hover { color: #b82020; }

.item-price {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
  white-space: nowrap;
}

/* Qty */
.qty-row {
  display: flex;
  align-items: center;
  width: fit-content;
  border: 1px solid #bbb;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

.qty-btn {
  background: #fff;
  border: none;
  padding: 4px 11px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  line-height: 1;
  transition: background 0.1s;
}

.qty-btn:hover { background: #e8e8e8; }

.qty-val {
  font-size: 13px;
  font-weight: 600;
  color: #222;
  padding: 4px 12px;
  border-left: 1px solid #bbb;
  border-right: 1px solid #bbb;
  min-width: 30px;
  text-align: center;
}

/* ── Payment ── */
.payment-section {
  background: #ebebeb;
  border-radius: 10px;
  padding: 22px 24px;
}

.payment-label {
  font-size: 16px;
  font-weight: 700;
  color: #222;
  margin-bottom: 16px;
}

.payment-options {
  display: flex;
  gap: 14px;
}

.pay-option {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border: 1.5px solid #c4c4c4;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  background: #fff;
  transition: border-color 0.2s, background 0.2s;
  user-select: none;
}

.pay-option.active {
  border-color: #3a6bdf;
  background: #fff;
  color: #222;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #bbb;
  flex-shrink: 0;
  transition: all 0.2s;
}

.radio-circle.checked {
  border-color: #3a6bdf;
  background: #3a6bdf;
  box-shadow: inset 0 0 0 4px #fff;
}

/* ── Note ── */
.note-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.note-label {
  font-size: 16px;
  font-weight: 700;
  color: #222;
}

.note-input {
  width: 100%;
  height: 52px;
  border: 1.5px solid #c8c8c8;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 15px;
  font-family: inherit;
  color: #333;
  outline: none;
  background: #fff;
  transition: border-color 0.2s;
}

.note-input:focus { border-color: #3a6bdf; }

/* ── Summary ── */
.summary-section {
  background: #e8e8e8;
  border-radius: 10px;
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.summary-heading {
  font-size: 17px;
  font-weight: 700;
  color: #222;
  margin-bottom: 2px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #333;
}

.summary-key { color: #333; }

.qty-count {
  color: #e03030;
  font-weight: 700;
  font-size: 16px;
}

.sum-price {
  font-weight: 600;
  color: #111;
  font-size: 16px;
}

.order-btn {
  margin-top: 6px;
  width: 100%;
  padding: 16px;
  background: #1e3a6e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  letter-spacing: 0.02em;
}

.order-btn:hover { background: #162d56; }

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>