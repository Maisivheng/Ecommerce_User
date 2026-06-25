// checkout page
<template>
  <Navbar />
  <div class="checkout-wrapper">

    <h2 class="page-title">កន្រ្តកទំនិញរបស់អ្នក ( {{ totalCartItems }} ទំនិញ)</h2>

    <!-- Cart Items Card -->
    <div class="checkout-card">
      <div v-if="cartItems.length === 0" class="empty-cart">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          <line x1="3" y1="3" x2="21" y2="21"></line>
        </svg>
        <p>មិនទាន់មានទំនិញនៅក្នុងកន្រ្តកនៅឡើយទេ</p>
      </div>
      
      <div v-else class="cart-list">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-img-wrap">
            <img :src="item.image" :alt="item.title" />
          </div>
          <div class="item-details">
            <div class="item-top-row">
              <div class="item-info">
                <p class="item-cat">{{ item.title }}</p>
                <p class="item-name">{{ item.description }}</p>
                <p class="item-condition">ស្ថានភាព: {{ item.condition }}</p>
              </div>
              <button class="del-btn" @click="removeItem(item.id)" title="លុបទំនិញ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
            
            <div class="item-bottom-row">
              <span class="item-price">${{ (item.price * item.qty).toFixed(2) }}</span>
              <div class="qty-pill">
                <button class="qty-btn" @click="decreaseQty(item)">−</button>
                <span class="qty-val">{{ item.qty }}</span>
                <button class="qty-btn" @click="increaseQty(item)">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Method Card -->
    <div class="checkout-card">
      <div class="card-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3a6bdf" stroke-width="2">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
        <p class="card-title">ជ្រើសរើសសម្រាប់ការដឹកជញ្ជូន</p>
      </div>
      <div class="payment-options">
        <label
          v-for="method in paymentMethods"
          :key="method.value"
          class="pay-option"
          :class="{ active: selectedPayment === method.value }"
        >
          <input type="radio" :value="method.value" v-model="selectedPayment" hidden />
          <span class="radio-circle" :class="{ checked: selectedPayment === method.value }">
            <span class="radio-dot" v-if="selectedPayment === method.value"></span>
          </span>
          {{ method.label }}
        </label>
      </div>
    </div>

    <!-- Address & Map Card -->
    <div class="checkout-card address-card-relative">
      <div class="card-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3a6bdf" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <p class="card-title">អាសយដ្ឋានដឹកជញ្ជូន</p>
      </div>

      <div class="address-input-wrap">
        <input
          v-model="note"
          class="note-input"
          type="text"
          placeholder="វាយបញ្ចូលអាសយដ្ឋានរបស់អ្នកដើម្បីស្វែងរក..."
          @input="onAddressInput"
          @keydown.enter.prevent="searchMainAddress"
        />
        <button v-if="note" class="clear-addr-btn" @click="clearAddress" title="Clear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </button>
      </div>

      <!-- Autocomplete Suggestions Dropdown -->
      <div v-if="addressSuggestions.length > 0" class="suggestions-dropdown">
        <div 
          v-for="sug in addressSuggestions" 
          :key="sug.place_id" 
          class="suggestion-item"
          @click="selectSuggestion(sug)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" class="sug-icon">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span class="sug-text">{{ sug.display_name }}</span>
        </div>
      </div>

      <div class="address-actions">
        <div v-if="selectedCoords" class="coords-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          {{ selectedCoords.lat.toFixed(5) }}, {{ selectedCoords.lng.toFixed(5) }}
        </div>
        
        <button class="map-toggle-btn" @click="openMap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/>
            <line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
          ផ្ទៀងផ្ទាត់លើផែនទី
        </button>
      </div>

      <!-- Map Modal -->
      <Transition name="fade">
        <div v-if="showMap" class="map-overlay" @click.self="closeMap">
          <div class="map-modal">
            <div class="map-modal-header">
              <p class="map-modal-title">ពិនិត្យ និងកែតម្រូវទីតាំង</p>
              <button class="map-close-btn" @click="closeMap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="map-search-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                v-model="mapSearch"
                class="map-search-input"
                type="text"
                placeholder="ស្វែងរកទីតាំងបន្ថែម..."
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
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#E63946" stroke="#fff" stroke-width="1.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5" fill="#fff" stroke="none"/>
                </svg>
                <div class="pin-shadow"></div>
              </div>
            </div>

            <div class="map-actions">
              <button class="locate-me-btn" @click="locateMe">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                </svg>
              </button>
              <button class="confirm-location-btn" @click="confirmLocation">
                រក្សាទុកទីតាំងនេះ
              </button>
            </div>
            <p class="map-hint">* ផ្ទាំងផែនទីសម្រាប់ផ្ទៀងផ្ទាត់ចំណុច Pin ឲ្យចំផ្ទះរបស់អ្នក</p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Summary Section -->
    <div class="summary-section checkout-card">
      <p class="summary-heading">សង្ខេបការបញ្ជាទិញ</p>
      <div class="summary-details">
        <div class="summary-row">
          <span class="summary-key">ទំនិញសរុប</span>
          <span class="qty-count">{{ totalCartItems }}</span>
        </div>
        <div class="summary-row grand-total">
          <span class="summary-key">តម្លៃសរុបត្រូវទូទាត់</span>
          <span class="sum-price">${{ totalCartPrice }}</span>
        </div>
      </div>
      
      <button class="order-btn" @click="placeOrder" :disabled="cartItems.length === 0 || loading">
        <span v-if="!loading">បញ្ជាក់ការបញ្ជាទិញ</span>
        <span v-else class="spinner"></span>
      </button>
    </div>

  </div>

  <!-- ══ INVOICE MODAL ══ -->
  <Transition name="fade">
    <div v-if="showInvoice" class="invoice-overlay" @click.self="closeInvoice">
      <div class="invoice-modal" id="invoice-print-area">
        <div class="invoice-cutout-top"></div>

        <div class="invoice-header">
          <div class="invoice-brand">
            <span class="invoice-logo-icon">🛍️</span>
            <h2>ពិភពទំនិញ</h2>
          </div>
          <div class="invoice-title-block">
            <p class="invoice-title">វិក្កយបត្រ / INVOICE</p>
            <p class="invoice-no">#INV-{{ currentOrder.id }}</p>
          </div>
        </div>

        <div class="invoice-meta">
          <div class="inv-meta-row">
            <span class="inv-label">កាលបរិច្ឆេទ:</span>
            <span class="inv-value">{{ currentOrder.date }}</span>
          </div>
          <div class="inv-meta-row">
            <span class="inv-label">វិធីសាស្រ្ត:</span>
            <span class="inv-value">{{ currentOrder.delivery }}</span>
          </div>
          <div class="inv-meta-row" v-if="currentOrder.address">
            <span class="inv-label">អាសយដ្ឋាន:</span>
            <span class="inv-value address-value">{{ currentOrder.address }}</span>
          </div>
        </div>

        <table class="inv-table">
          <thead>
            <tr>
              <th>បរិយាយ (Description)</th>
              <th class="text-center">ចំនួន</th>
              <th class="text-right">តម្លៃ</th>
              <th class="text-right">សរុប</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentOrder.items" :key="item.id">
              <td>
                <div class="inv-prod">
                  <span class="inv-prod-title">{{ item.title }}</span>
                </div>
              </td>
              <td class="text-center">{{ item.qty }}</td>
              <td class="text-right">${{ Number(item.price).toFixed(2) }}</td>
              <td class="text-right font-medium">${{ (item.price * item.qty).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="invoice-totals">
          <div class="total-row grand-total-row">
            <span>សរុបទឹកប្រាក់ (Grand Total)</span>
            <span class="total-price">${{ currentOrder.totalPrice }}</span>
          </div>
        </div>

        <div class="inv-footer">
          <p class="inv-thanks">សូមអរគុណសម្រាប់ការគាំទ្រ! 🙏</p>
          <p class="inv-sub-thanks">Thank you for your purchase.</p>
        </div>

        <div class="invoice-actions no-print">
          <button class="inv-close-btn" @click="closeInvoice">បិទ</button>
          <button class="inv-print-btn" @click="printInvoice">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            បោះពុម្ព
          </button>
        </div>
      </div>
    </div>
  </Transition>

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
      showInvoice: false,
      currentOrder: null,
      addressSuggestions: [],
      debounceTimer: null,
      paymentMethods: [
        { value: 'delivery', label: 'ទទួលផ្ទាល់នៅហាង' },
        { value: 'pickup', label: 'ដឹកជញ្ជូនដល់ទីកន្លែង' },
      ],
    }
  },

  computed: {
    mapSrc() {
      const { lat, lng } = this.mapCenter
      return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.005},${lng + 0.005},${lat + 0.005}&layer=mapnik&marker=${lat},${lng}`
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
      this.mapSearch = this.note;
      this.showMap = true;
      document.body.style.overflow = 'hidden';
    },
    closeMap() {
      this.showMap = false;
      document.body.style.overflow = '';
    },
    clearAddress() {
      this.note = '';
      this.selectedCoords = null;
      this.addressSuggestions = [];
    },

    // Inline Main Address Typing Logic (with debounce)
    onAddressInput() {
      clearTimeout(this.debounceTimer);
      if (!this.note.trim()) {
        this.addressSuggestions = [];
        return;
      }
      this.debounceTimer = setTimeout(() => {
        this.fetchAddressSuggestions(this.note);
      }, 500); // Wait 500ms after user stops typing
    },

    async fetchAddressSuggestions(query) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
          { headers: { 'Accept-Language': 'km,en' } }
        );
        this.addressSuggestions = await res.json();
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    },

    selectSuggestion(sug) {
      const lat = parseFloat(sug.lat);
      const lng = parseFloat(sug.lon);
      this.mapCenter = { lat, lng };
      this.selectedCoords = { lat, lng };
      this.note = sug.display_name.split(',').slice(0, 4).join(', ');
      this.addressSuggestions = []; // Close suggestion box
    },

    async searchMainAddress() {
      if (!this.note.trim()) return;
      clearTimeout(this.debounceTimer);
      await this.fetchAddressSuggestions(this.note);
      if (this.addressSuggestions.length > 0) {
        this.selectSuggestion(this.addressSuggestions[0]);
      }
    },

    // Map Modal Search Logic
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
          this.note = data[0].display_name.split(',').slice(0, 4).join(', ')
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
              ? data.display_name.split(',').slice(0, 4).join(', ')
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
      if (!this.note && this.selectedPayment === 'pickup') {
        alert('សូមបញ្ចូលអាសយដ្ឋានដឹកជញ្ជូន។')
        return
      }
      
      this.loading = true
      await new Promise(r => setTimeout(r, 1400))
      this.loading = false

      const order = {
        id: Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' }),
        delivery: this.selectedPayment === 'pickup' ? 'ដឹកជញ្ជូនដល់ទីកន្លែង' : 'ទទួលផ្ទាល់នៅហាង',
        address: this.selectedPayment === 'pickup' ? this.note : 'មកទទួលនៅទីតាំងហាងផ្ទាល់',
        items: this.cartItems.map(i => ({
          id: i.id,
          title: i.title,
          image: i.image,
          price: i.price,
          qty: i.qty,
        })),
        totalPrice: this.totalCartPrice.toFixed ? this.totalCartPrice.toFixed(2) : this.totalCartPrice,
      }

      this.cartStore.addPurchase(order)
      this.cartStore.clearCart()

      this.currentOrder = order
      this.showInvoice = true
    },

    closeInvoice() {
      this.showInvoice = false
    },

    printInvoice() {
      window.print()
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;500;600;700&display=swap');

* { 
  box-sizing: border-box; 
  margin: 0; 
  padding: 0; 
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.checkout-wrapper {
  font-family: 'Noto Sans Khmer', sans-serif;
  background: #f4f6f8; 
  min-height: 100vh;
  max-width: 768px;
  margin: 0 auto;
  padding: 32px 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 4px;
}

/* ── UI Cards ── */
.checkout-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.address-card-relative {
  position: relative; /* Essential for dropdown alignment */
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

/* ── Cart Items ── */
.empty-cart {
  text-align: center;
  padding: 40px 20px;
  color: #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}
.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-img-wrap {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f9fa;
  flex-shrink: 0;
  border: 1px solid #eee;
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
  justify-content: space-between;
  min-height: 80px;
}

.item-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-cat {
  font-size: 11px;
  font-weight: 700;
  color: #3a6bdf;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.item-name {
  font-size: 14px;
  color: #222;
  font-weight: 600;
  line-height: 1.3;
}

.item-condition {
  font-size: 12px;
  color: #888;
}

.del-btn {
  background: #fff0f0;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #e63946;
}
.del-btn:hover { background: #ffe4e4; }

.item-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.qty-pill {
  display: flex;
  align-items: center;
  background: #f4f6f8;
  border-radius: 20px;
  padding: 4px;
}

.qty-btn {
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.qty-val {
  font-size: 13px;
  font-weight: 600;
  color: #222;
  min-width: 32px;
  text-align: center;
}

/* ── Payment ── */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pay-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1.5px solid #eaeaea;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #444;
}
.pay-option.active {
  border-color: #3a6bdf;
  background: #f4f7ff;
  color: #1a1a2e;
}

.radio-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.radio-circle.checked { border-color: #3a6bdf; }
.radio-dot { width: 10px; height: 10px; background: #3a6bdf; border-radius: 50%; }

/* ── Editable Address Input & Dropdown ── */
.address-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.note-input {
  width: 100%;
  height: 54px;
  border: 1.5px solid #eaeaea;
  border-radius: 12px;
  padding: 0 44px 0 16px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  outline: none;
  background: #f9f9f9;
  transition: all 0.2s;
}
.note-input:focus { 
  border-color: #3a6bdf; 
  background: #fff;
  box-shadow: 0 0 0 4px rgba(58, 107, 223, 0.1);
}

.clear-addr-btn {
  position: absolute;
  right: 14px;
  background: #eee;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Suggestions Autocomplete Box */
.suggestions-dropdown {
  position: absolute;
  top: 105px; /* Directly below input */
  left: 24px;
  right: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  z-index: 99;
  max-height: 240px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f8fafc;
  transition: background 0.15s;
}
.suggestion-item:last-child { border-bottom: none; }
.suggestion-item:hover { background: #f4f7ff; }

.sug-icon { flex-shrink: 0; color: #3a6bdf; }
.sug-text {
  font-size: 13px;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.address-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  gap: 10px;
}

.coords-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-family: monospace;
  color: #555;
  background: #f0f0f0;
  border-radius: 6px;
  padding: 6px 12px;
}

.map-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #3a6bdf;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-family: inherit;
  color: #3a6bdf;
  cursor: pointer;
  font-weight: 600;
  margin-left: auto;
  transition: all 0.2s;
}
.map-toggle-btn:hover { background: #3a6bdf; color: #fff; }

/* ── Map Modal ── */
.map-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 600px) {
  .map-overlay { align-items: center; padding: 20px; }
}

.map-modal {
  background: #fff;
  width: 100%;
  max-width: 600px;
  border-radius: 24px 24px 0 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
  max-height: 90vh;
}

@media (min-width: 600px) {
  .map-modal { border-radius: 20px; }
}

.map-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-modal-title { font-size: 18px; font-weight: 700; color: #1a1a2e; }
.map-close-btn {
  background: #f4f6f8;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.map-search-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid #eaeaea;
  border-radius: 12px;
  padding: 6px 6px 6px 14px;
  background: #fff;
}

.map-search-input {
  flex: 1;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.map-search-btn {
  background: #1e3a6e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.map-frame-wrap {
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  background: #e5e3df;
}

.map-iframe { width: 100%; height: 100%; border: none; }

.map-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pin-shadow {
  width: 12px;
  height: 4px;
  background: rgba(0,0,0,0.3);
  border-radius: 50%;
  margin-top: 2px;
  filter: blur(2px);
}

.map-actions { display: flex; gap: 12px; margin-top: 8px; }

.locate-me-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1.5px solid #eaeaea;
  border-radius: 12px;
  width: 52px;
  height: 52px;
  cursor: pointer;
}

.confirm-location-btn {
  flex: 1;
  background: #1e3a6e;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.map-hint { font-size: 12px; color: #888; text-align: center; }

/* ── Summary ── */
.summary-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #555;
}

.grand-total {
  border-top: 1px dashed #ccc;
  padding-top: 12px;
  margin-top: 4px;
}
.grand-total .summary-key { font-weight: 700; color: #1a1a2e; }

.sum-price { font-weight: 800; color: #e63946; font-size: 18px; }

.order-btn {
  width: 100%;
  height: 56px;
  background: #3a6bdf;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(58, 107, 223, 0.25);
}
.order-btn:disabled { background: #a0b8f0; cursor: not-allowed; box-shadow: none; }

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ══ INVOICE MODAL ══ */
.invoice-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.invoice-modal {
  background: #fff;
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  padding: 32px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  font-family: 'Courier New', Courier, monospace;
}

.invoice-cutout-top {
  position: absolute;
  top: -8px;
  left: 0;
  right: 0;
  height: 8px;
  background: radial-gradient(circle at 10px 0, transparent 10px, #fff 11px);
  background-size: 20px 20px;
}

.invoice-header { text-align: center; border-bottom: 2px dashed #ddd; padding-bottom: 20px; margin-bottom: 20px; }
.invoice-brand { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 12px; }
.invoice-brand h2 { font-family: 'Noto Sans Khmer', sans-serif; font-size: 22px; color: #1a1a2e; }

.invoice-meta { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; font-size: 13px; }
.inv-meta-row { display: flex; justify-content: space-between; }
.inv-label { color: #666; }
.inv-value { font-weight: 600; text-align: right; }
.address-value { max-width: 60%; word-break: break-word; font-family: 'Noto Sans Khmer', sans-serif; }

.inv-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
.inv-table th { border-bottom: 2px dashed #ddd; padding: 8px 4px; font-weight: 700; text-align: left; }
.inv-table td { padding: 12px 4px; border-bottom: 1px dashed #eee; }
.inv-prod-title { font-family: 'Noto Sans Khmer', sans-serif; }

.invoice-totals { border-top: 2px dashed #ddd; padding-top: 16px; margin-bottom: 24px; }
.grand-total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; }

.inv-footer { text-align: center; border-top: 1px dashed #eee; padding-top: 24px; margin-bottom: 24px; }
.inv-thanks { font-family: 'Noto Sans Khmer', sans-serif; font-size: 15px; font-weight: 600; }
.inv-sub-thanks { font-size: 12px; color: #888; }

.invoice-actions { display: flex; gap: 12px; }
.inv-close-btn { flex: 1; padding: 12px; background: #f0f0f0; border: none; border-radius: 8px; font-family: 'Noto Sans Khmer', sans-serif; font-weight: 600; cursor: pointer; }
.inv-print-btn { flex: 2; display: flex; align-items: center; justify-content: center; gap: 8px; background: #1a1a2e; color: #fff; border: none; border-radius: 8px; font-family: 'Noto Sans Khmer', sans-serif; font-weight: 600; cursor: pointer; }

@media print {
  body * { visibility: hidden; }
  #invoice-print-area, #invoice-print-area * { visibility: visible; }
  #invoice-print-area { position: fixed; inset: 0; padding: 20px; box-shadow: none; max-width: 100%; border-radius: 0; }
  .no-print, .invoice-cutout-top { display: none !important; }
  .invoice-overlay { background: transparent; backdrop-filter: none; padding: 0; }
}
</style>