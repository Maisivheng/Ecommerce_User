<template>
  <div class="cart-page">

    <!-- ═══ NAVBAR ═══ -->
    <AppNavbar :cart-count="cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)" />

    <div class="page-body">
      <h2 class="page-title">កន្លែងទិញ</h2>

      <div class="cart-layout">
        <!-- ═══ LEFT: CART ITEMS ═══ -->
        <div class="cart-left">
          <div class="cart-box">
            <div v-if="loadingCart" class="loading-msg">កំពុងទាញទិន្នន័យ...</div>

            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <img
                :src="item.image || item.product_image || 'https://placehold.co/80x80/f5f5f5/555?text=IMG'"
                :alt="item.name"
                class="item-img"
                @error="onImgError"
              />
              <div class="item-info">
                <p class="item-name">{{ item.name || item.product_name }}</p>
                <p class="item-sub">{{ item.subtitle || item.description || '' }}</p>
                <div class="qty-row">
                  <button class="qty-btn" @click="decreaseQty(item)">−</button>
                  <span class="qty-val">{{ item.quantity }}</span>
                  <button class="qty-btn" @click="increaseQty(item)">+</button>
                </div>
              </div>
              <div class="item-right">
                <button class="remove-btn" @click="removeItem(item.id)">🗑</button>
                <span class="item-price">${{ ((item.price || 0) * item.quantity).toLocaleString() }}.00</span>
              </div>
            </div>

            <div v-if="!loadingCart && cartItems.length === 0" class="empty-cart">
              មិនមានទំនិញក្នុងរទេះទេ។
            </div>
          </div>
        </div>

        <!-- ═══ RIGHT: SUMMARY ═══ -->
        <div class="cart-right">
          <div class="summary-box">
            <p class="summary-title">សង្ខេប</p>
            <div class="summary-row">
              <span>ចំនួនទំនិញ</span>
              <span class="summary-count">{{ cartItems.length }}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row summary-total">
              <span>តម្លៃសរុប</span>
              <span class="total-amt">${{ totalPrice.toLocaleString() }}.00</span>
            </div>
            <button class="checkout-btn" @click="goCheckout">ទូទាត់ប្រាក់</button>
          </div>
        </div>
      </div>

      <!-- ═══ RECOMMENDED PRODUCTS ═══ -->
      <div class="recommended">
        <button class="rec-arrow left" @click="prevRec">‹</button>
        <div class="rec-track">
          <div v-for="product in recommendedProducts" :key="product.id" class="rec-card">
            <img
              :src="product.image || 'https://placehold.co/120x100/f5f5f5/555?text=IMG'"
              :alt="product.name"
              class="rec-img"
              @error="onImgError"
            />
            <p class="rec-name">{{ product.name }}</p>
            <p class="rec-sub">{{ product.subtitle }}</p>
            <p class="rec-price">${{ product.price.toLocaleString() }}.00</p>
            <button class="btn-add" @click="addToCart(product)">ជ្រើសរើស</button>
          </div>
        </div>
        <button class="rec-arrow right" @click="nextRec">›</button>
      </div>

      <!-- Checkout CTA -->
      <div class="cta-row">
        <button class="cta-btn" @click="goCheckout">បន្តការទូទាត់ប្រាក់</button>
      </div>
    </div>

    <!-- ═══ FOOTER ═══ -->
    <footer class="footer">
      <div class="footer-brand">តិកពត័និញ</div>
      <div class="footer-cols">
        <div class="footer-col">
          <p class="footer-col-title">ព័ត៌មានទំនាក់ទំនង</p>
          <p>✉ Example@gmail.com</p>
          <p>📞 +855 XX XXX XXX</p>
          <p>📍 Phnom Penh, Cambodia</p>
        </div>
        <div class="footer-col">
          <p class="footer-col-title">Quick Links</p>
          <p>ផ្ទះ</p><p>ផលិត</p><p>អំពីពួក</p><p>ទំនាក់</p>
        </div>
        <div class="footer-col">
          <p class="footer-col-title">Follow us</p>
          <p>📘 Facebook</p><p>🐦 Twitter</p><p>📸 Instagram</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import api from '@/API/api'
import AppNavbar from '@/components/layout/Navbar.vue'
import { useauthStore } from '@/stores/auth.js'

export default {
  name: 'CartView',
  components: { AppNavbar },
  data() {
    return {
      loadingCart: false,
      cartItems: [],
      recommendedProducts: [
        { id: 1, name: 'SMART PHONE', subtitle: 'Samsung Galaxy S24 Ultra Titanium Violet', price: 1329, image: 'https://placehold.co/120x100/f5f5f5/333?text=Phone' },
        { id: 2, name: 'SMART PHONE', subtitle: 'Samsung Galaxy S24 Ultra', price: 1099.99, image: 'https://placehold.co/120x100/f5f5f5/333?text=Phone' },
        { id: 3, name: 'PC', subtitle: 'iPhone MPG Gaming Case pro max', price: 499, image: 'https://placehold.co/120x100/f5f5f5/333?text=PC' },
      ],
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    },
    authToken() {
      return localStorage.getItem('token') || localStorage.getItem('access_token') || sessionStorage.getItem('token') || '';
    },
    authHeaders() {
      return this.authToken
        ? { Authorization: `Bearer ${this.authToken}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };
    },
  },
  mounted() {
    this.fetchCart();
    this.fetchRecommended();
  },
  methods: {
    async fetchCart() {
      this.loadingCart = true;
      try {
        const res = await api.get('/carts', { headers: this.authHeaders });
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.data ?? data?.items ?? data?.cart_items ?? [];
        if (list.length > 0) {
          this.cartItems = list.map(i => ({ ...i, quantity: i.quantity || 1 }));
        } else {
          this.cartItems = this.sampleItems();
        }
      } catch {
        this.cartItems = this.sampleItems();
      } finally {
        this.loadingCart = false;
      }
    },
    async fetchRecommended() {
      try {
        const res = await api.get('/products', { headers: this.authHeaders });
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.data ?? [];
        if (list.length > 0) {
          this.recommendedProducts = list.slice(0, 4).map(p => ({
            id: p.id, name: p.name || p.product_name,
            subtitle: p.description || p.model || '',
            price: p.price || p.product_price || 0,
            image: p.image || p.product_image || '',
          }));
        }
      } catch { /* keep sample */ }
    },
    sampleItems() {
      return [
        { id: 1, name: 'SMART PHONE', subtitle: 'iPhone 16 pro max',     quantity: 1, price: 1329, image: '' },
        { id: 2, name: 'SMART PHONE', subtitle: 'Samsung Galaxy S25 Ultra', quantity: 1, price: 1099, image: '' },
        { id: 3, name: 'MOUSE',       subtitle: 'Gaming Mouse',           quantity: 1, price: 10,   image: '' },
      ];
    },
    async updateCartItem(item, quantity) {
      const payload = { quantity };
      const candidates = [
        () => api.put(`/carts/${item.id}`, payload, { headers: this.authHeaders }),
        () => api.patch(`/carts/${item.id}`, payload, { headers: this.authHeaders }),
        () => api.post('/carts/update', { id: item.id, quantity }, { headers: this.authHeaders }),
      ];
      for (const call of candidates) {
        try {
          await call();
          await this.fetchCart();
          return true;
        } catch {
          // try next endpoint variant
        }
      }
      return false;
    },
    async increaseQty(item) {
      const ok = await this.updateCartItem(item, (item.quantity || 1) + 1);
      if (!ok) item.quantity += 1;
    },
    async decreaseQty(item) {
      if (item.quantity <= 1) return;
      const ok = await this.updateCartItem(item, item.quantity - 1);
      if (!ok) item.quantity -= 1;
    },
    async removeItem(id) {
      const candidates = [
        () => api.delete(`/carts/${id}`, { headers: this.authHeaders }),
        () => api.post('/carts/remove', { id }, { headers: this.authHeaders }),
      ];
      for (const call of candidates) {
        try {
          await call();
          await this.fetchCart();
          return;
        } catch {
          // try next endpoint variant
        }
      }
      this.cartItems = this.cartItems.filter(i => i.id !== id);
    },
    async addToCart(product) {
      const payload = { product_id: product.id, quantity: 1 };
      const candidates = [
        () => api.post('/carts', payload, { headers: this.authHeaders }),
        () => api.post('/carts/add', payload, { headers: this.authHeaders }),
      ];
      for (const call of candidates) {
        try {
          await call();
          await this.fetchCart();
          return;
        } catch {
          // try next endpoint variant
        }
      }
    },
    goCheckout() {
      const auth = useauthStore();
      if (!auth.token) {
        this.$router.push({ name: 'login', query: { redirect: 'checkout' } });
        return;
      }
      this.$router.push('/checkout');
    },
    prevRec() {},
    nextRec() {},
    onImgError(e) { e.target.src = 'https://placehold.co/120x100/eee/999?text=IMG'; },
  },
};
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.cart-page {
  font-family: 'Khmer OS', 'Battambang', Arial, sans-serif;
  color: #2d2d2d;
  background: #fff;
  min-height: 100vh;
}

/* PAGE */
.page-body { padding: 24px 32px; }
.page-title { font-size: 15px; font-weight: 700; margin-bottom: 18px; }

/* CART LAYOUT */
.cart-layout { display: flex; gap: 20px; margin-bottom: 28px; }
.cart-left { flex: 1; }
.cart-right { width: 200px; flex-shrink: 0; }

/* CART BOX */
.cart-box {
  background: #fdf0f0;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-item {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 6px;
  background: #f5f5f5;
  flex-shrink: 0;
}

.item-info { flex: 1; min-width: 0; }
.item-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
.item-sub { font-size: 11px; color: #888; margin-bottom: 8px; }

.qty-row {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}
.qty-btn {
  background: none; border: none;
  padding: 3px 9px; cursor: pointer;
  font-size: 15px; color: #444; line-height: 1.4;
}
.qty-btn:hover { background: #f0f0f0; }
.qty-val {
  padding: 3px 10px; font-size: 13px;
  border-left: 1px solid #ddd; border-right: 1px solid #ddd;
  min-width: 28px; text-align: center;
}

.item-right {
  display: flex; flex-direction: column;
  align-items: flex-end; gap: 8px; flex-shrink: 0;
}
.remove-btn {
  background: none; border: none;
  cursor: pointer; font-size: 16px; color: #e53935; padding: 0;
}
.item-price { font-size: 13px; font-weight: 600; }

.loading-msg { text-align: center; color: #888; padding: 24px; font-size: 13px; }
.empty-cart { text-align: center; color: #bbb; padding: 24px; font-size: 13px; }

/* SUMMARY */
.summary-box {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 16px;
}
.summary-title { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
.summary-row {
  display: flex; justify-content: space-between;
  font-size: 12px; color: #555; margin-bottom: 6px;
}
.summary-count { color: #e53935; font-weight: 700; }
.summary-divider { border-top: 1px solid #e5e7eb; margin: 10px 0; }
.summary-total { font-size: 13px; font-weight: 700; color: #222; }
.total-amt { color: #e53935; }
.checkout-btn {
  display: block; width: 100%; margin-top: 14px;
  background: #2563eb; color: #fff;
  border: none; border-radius: 6px;
  padding: 10px; font-size: 13px;
  font-family: inherit; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.checkout-btn:hover { background: #1d4ed8; }

/* RECOMMENDED */
.recommended {
  position: relative;
  background: #fdf0f0;
  border-radius: 10px;
  padding: 16px 48px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.rec-track {
  display: flex;
  gap: 16px;
  flex: 1;
  overflow: hidden;
}

.rec-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  min-width: 160px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.rec-img {
  width: 100px;
  height: 80px;
  object-fit: contain;
  border-radius: 6px;
  background: #f5f5f5;
}
.rec-name { font-size: 12px; font-weight: 700; }
.rec-sub { font-size: 10px; color: #888; line-height: 1.4; }
.rec-price { font-size: 13px; font-weight: 700; color: #333; }

.btn-add {
  background: #2563eb; color: #fff;
  border: none; border-radius: 5px;
  padding: 6px 16px; font-size: 11px;
  font-family: inherit; cursor: pointer;
  transition: background 0.2s; width: 100%;
}
.btn-add:hover { background: #1d4ed8; }

.rec-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.9); border: none;
  border-radius: 50%; width: 30px; height: 30px;
  font-size: 18px; cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  display: flex; align-items: center; justify-content: center;
  z-index: 2;
}
.rec-arrow.left { left: 10px; }
.rec-arrow.right { right: 10px; }

/* CTA */
.cta-row { text-align: center; margin-bottom: 32px; }
.cta-btn {
  background: #2563eb; color: #fff;
  border: none; border-radius: 6px;
  padding: 12px 48px; font-size: 13px;
  font-family: inherit; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.cta-btn:hover { background: #1d4ed8; }

/* FOOTER */
.footer {
  background: #f5f5f5; padding: 32px;
  display: flex; gap: 40px; flex-wrap: wrap;
}
.footer-brand { font-size: 16px; font-weight: 800; color: #1e3a5f; }
.footer-cols { display: flex; gap: 48px; flex: 1; flex-wrap: wrap; }
.footer-col { min-width: 130px; }
.footer-col-title { font-size: 12px; font-weight: 700; color: #1e3a5f; margin-bottom: 8px; }
.footer-col p { font-size: 11px; color: #666; margin-bottom: 5px; }
</style>


