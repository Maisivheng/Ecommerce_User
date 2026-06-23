<template>
  <Navbar />
  <div class="checkout-wrapper">

    <h2 class="page-title">កន្រ្តកទំនិញរបស់អ្នក ( {{ totalCartItems }} ទំនិញ)</h2>

    <!-- Cart Items Card -->
    <div class="cart-card">
      <div v-if="cartItems.length === 0" class="empty-cart">
        <i class="bi bi-cart-x"></i>
        <p>មិនទាន់មានទំនិញនៅក្នុងកន្រ្តកនៅឡើយទេ</p>
      </div>
      <div v-else class="cart-list">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-img-wrap">
            <img :src="item.image" :alt="item.title" />
          </div>
          <div class="item-details">
            <div class="item-top-row">
              <div>
                <p class="item-cat">{{ item.title }}</p>
                <p class="item-name">{{ item.description }}</p>
                <p class="item-condition">ស្ថានភាព: {{ item.condition }}</p>
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
                <span class="item-price">${{ (item.price * item.qty).toFixed(2) }}</span>
              </div>
            </div>
            <div class="qty-row">
              <button class="qty-btn" @click="decreaseQty(item)">−</button>
              <span class="qty-val">{{ item.qty }}</span>
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

    <!-- Address + Map -->
    <div class="note-section">
      <p class="note-label">អាសយដ្ឋាន</p>

      <div class="address-input-wrap">
        <svg class="addr-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <input
          v-model="note"
          class="note-input"
          type="text"
          placeholder="វាយបញ្ចូល ឬជ្រើសរើសលើផែនទី..."
          readonly
          @click="openMap"
        />
        <button v-if="note" class="clear-addr-btn" @click="clearAddress" title="Clear">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div v-if="selectedCoords" class="coords-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>
        {{ selectedCoords.lat.toFixed(5) }}, {{ selectedCoords.lng.toFixed(5) }}
      </div>

      <button class="map-toggle-btn" @click="openMap">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
          <line x1="9" y1="3" x2="9" y2="18"/>
          <line x1="15" y1="6" x2="15" y2="21"/>
        </svg>
        {{ note ? 'ផ្លាស់ប្តូរទីតាំង' : 'ជ្រើសរើសលើផែនទី' }}
      </button>

      <!-- Map Modal -->
      <div v-if="showMap" class="map-overlay" @click.self="closeMap">
        <div class="map-modal">
          <div class="map-modal-header">
            <p class="map-modal-title">ជ្រើសរើសទីតាំងដឹកជញ្ជូន</p>
            <button class="map-close-btn" @click="closeMap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="map-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              v-model="mapSearch"
              class="map-search-input"
              type="text"
              placeholder="ស្វែងរកទីតាំង..."
              @keydown.enter.prevent="searchLocation"
            />
            <button class="map-search-btn" @click="searchLocation">ស្វែងរក</button>
          </div>

          <div class="map-frame-wrap">
            <iframe
              ref="mapFrame"
              :src="mapSrc"
              class="map-iframe"
              frameborder="0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <div class="map-crosshair">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="5" fill="#3a6bdf" stroke="white" stroke-width="2"/>
                <line x1="16" y1="2" x2="16" y2="10" stroke="#3a6bdf" stroke-width="2" stroke-linecap="round"/>
                <line x1="16" y1="22" x2="16" y2="30" stroke="#3a6bdf" stroke-width="2" stroke-linecap="round"/>
                <line x1="2" y1="16" x2="10" y2="16" stroke="#3a6bdf" stroke-width="2" stroke-linecap="round"/>
                <line x1="22" y1="16" x2="30" y2="16" stroke="#3a6bdf" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>

          <div class="map-actions">
            <button class="locate-me-btn" @click="locateMe">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              </svg>
              ទីតាំងបច្ចុប្បន្ន
            </button>
            <button class="confirm-location-btn" @click="confirmLocation">
              បញ្ជាក់ទីតាំង
            </button>
          </div>

          <p class="map-hint">* ចុចលើផែនទីដើម្បីជ្រើសរើសទីតាំង ឬស្វែងរកអាសយដ្ឋាន</p>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="summary-section">
      <p class="summary-heading">សង្ខេប</p>
      <div class="summary-row">
        <span class="summary-key">ទំនិញសរុប</span>
        <span class="qty-count">{{ totalCartItems }}</span>
      </div>
      <div class="summary-row">
        <span class="summary-key">តម្លៃសរុប</span>
        <span class="sum-price">${{ totalCartPrice }}</span>
      </div>
      <button class="order-btn" @click="placeOrder" :disabled="cartItems.length === 0 || loading">
        <span v-if="!loading">បញ្ជាក់ការបញ្ជាទិញ</span>
        <span v-else class="spinner"></span>
      </button>
    </div>

  </div>
  <Footer />
</template>

<script>
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import { useCart } from '@/stores/addToCart.js'
import { storeToRefs } from 'pinia'

export default {
  name: 'CheckoutPage',
  components: { Navbar, Footer },

  setup() {
    const cartStore = useCart()
    const { cartItems, totalCartItems, totalCartPrice } = storeToRefs(cartStore)
    return { cartStore, cartItems, totalCartItems, totalCartPrice }
  },

  data() {
    return {
      selectedPayment: 'pickup',
      note: '',
      loading: false,
      showMap: false,
      mapSearch: '',
      mapCenter: { lat: 11.5564, lng: 104.9282 },
      selectedCoords: null,
      paymentMethods: [
        { value: 'delivery', label: 'ទទួលផ្ទាល់' },
        { value: 'pickup', label: 'ដឹកជញ្ជូន' },
      ],
    }
  },

  computed: {
    mapSrc() {
      const { lat, lng } = this.mapCenter
      return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`
    },
  },

  methods: {
    increaseQty(item) {
      this.cartStore.updateQty(item.id, item.qty + 1)
    },
    decreaseQty(item) {
      if (item.qty > 1) this.cartStore.updateQty(item.id, item.qty - 1)
    },
    removeItem(id) {
      if (confirm('តើអ្នកពិតជាចង់លុបទំនិញនេះចេញពីកន្រ្តកមែនទេ?')) {
        this.cartStore.removeItem(id)
      }
    },

    openMap() {
      this.showMap = true
      document.body.style.overflow = 'hidden'
    },
    closeMap() {
      this.showMap = false
      document.body.style.overflow = ''
    },
    clearAddress() {
      this.note = ''
      this.selectedCoords = null
    },

    async searchLocation() {
      if (!this.mapSearch.trim()) return
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.mapSearch)}&format=json&limit=1`,
          { headers: { 'Accept-Language': 'km,en' } }
        )
        const data = await res.json()
        if (data?.length > 0) {
          const lat = parseFloat(data[0].lat)
          const lng = parseFloat(data[0].lon)
          this.mapCenter = { lat, lng }
          this.selectedCoords = { lat, lng }
          this.note = data[0].display_name.split(',').slice(0, 3).join(', ')
        } else {
          alert('រកមិនឃើញទីតាំង។ សូមព្យាយាមម្តងទៀត។')
        }
      } catch {
        alert('កំហុសក្នុងការស្វែងរក។ សូមព្យាយាមម្តងទៀត។')
      }
    },

    locateMe() {
      if (!navigator.geolocation) {
        alert('Browser របស់អ្នកមិនគាំទ្រ Geolocation។')
        return
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          this.mapCenter = { lat, lng }
          this.selectedCoords = { lat, lng }
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
              { headers: { 'Accept-Language': 'km,en' } }
            )
            const data = await res.json()
            this.note = data?.display_name
              ? data.display_name.split(',').slice(0, 3).join(', ')
              : `${lat.toFixed(5)}, ${lng.toFixed(5)}`
          } catch {
            this.note = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
          }
        },
        () => {
          alert('មិនអាចទទួលបានទីតាំងបច្ចុប្បន្ន។ សូមអនុញ្ញាតការចូលប្រើទីតាំង។')
        }
      )
    },

    confirmLocation() {
      if (!this.selectedCoords && !this.note) {
        alert('សូមជ្រើសរើសទីតាំងមុន។')
        return
      }
      if (!this.note && this.selectedCoords) {
        this.note = `${this.selectedCoords.lat.toFixed(5)}, ${this.selectedCoords.lng.toFixed(5)}`
      }
      this.closeMap()
    },

    async placeOrder() {
      if (this.cartItems.length === 0) {
        alert('កន្រ្តកទំនិញទទេ។')
        return
      }
      if (!this.note) {
        alert('សូមបញ្ចូលអាសយដ្ឋានដឹកជញ្ជូន។')
        return
      }
      this.loading = true
      await new Promise(r => setTimeout(r, 1400))
      this.loading = false
      alert('ការបញ្ជាទិញបានជោគជ័យ!')
      this.cartStore.clearCart()
    },
  },
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

.page-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

/* ── Empty Cart ── */
.empty-cart {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}
.empty-cart i {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}
.empty-cart p {
  font-size: 14px;
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
  margin-bottom: 2px;
}

.item-condition {
  font-size: 12px;
  color: #888;
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

/* ── Address ── */
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

.address-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.addr-icon {
  position: absolute;
  left: 14px;
  color: #3a6bdf;
  flex-shrink: 0;
  pointer-events: none;
}

.note-input {
  width: 100%;
  height: 52px;
  border: 1.5px solid #c8c8c8;
  border-radius: 8px;
  padding: 0 40px 0 38px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  outline: none;
  background: #fff;
  transition: border-color 0.2s;
  cursor: pointer;
}
.note-input:focus { border-color: #3a6bdf; }

.clear-addr-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  padding: 2px;
}
.clear-addr-btn:hover { color: #555; }

.coords-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #666;
  background: #f0f0f0;
  border-radius: 4px;
  padding: 4px 10px;
  width: fit-content;
}

.map-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #eef1fb;
  border: 1.5px solid #b8c6f0;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-family: inherit;
  color: #3a6bdf;
  cursor: pointer;
  font-weight: 600;
  width: fit-content;
  transition: background 0.15s;
}
.map-toggle-btn:hover { background: #dce5f9; }

/* ── Map Modal ── */
.map-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.map-modal {
  background: #fff;
  width: 100%;
  max-width: 720px;
  border-radius: 18px 18px 0 0;
  padding: 20px 20px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 90vh;
  overflow-y: auto;
}

.map-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-modal-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
}

.map-close-btn {
  background: #f2f2f2;
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #444;
}
.map-close-btn:hover { background: #e0e0e0; }

.map-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid #d0d0d0;
  border-radius: 8px;
  padding: 0 12px;
  background: #fafafa;
}

.map-search-input {
  flex: 1;
  height: 44px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  outline: none;
}

.map-search-btn {
  background: #3a6bdf;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
}
.map-search-btn:hover { background: #2d57c4; }

.map-frame-wrap {
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid #d8d8d8;
}

.map-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.map-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3));
}

.map-actions {
  display: flex;
  gap: 10px;
}

.locate-me-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  border: 1.5px solid #d0d0d0;
  border-radius: 8px;
  padding: 11px 16px;
  font-size: 13px;
  font-family: inherit;
  color: #444;
  cursor: pointer;
  font-weight: 600;
  transition: border-color 0.15s;
}
.locate-me-btn:hover { border-color: #3a6bdf; color: #3a6bdf; }

.confirm-location-btn {
  flex: 1;
  background: #1e3a6e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.confirm-location-btn:hover { background: #162d56; }

.map-hint {
  font-size: 11px;
  color: #999;
  text-align: center;
}

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
.order-btn:hover:not(:disabled) { background: #162d56; }
.order-btn:disabled { opacity: 0.6; cursor: not-allowed; }

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