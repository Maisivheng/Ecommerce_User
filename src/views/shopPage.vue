<template>
  <div class="shop-page">
    <header class="header-nav bg-white border-bottom py-3">
      <div class="container d-flex align-items-center justify-content-between">
        <div class="logo fw-bold fs-4 text-dark">Technology</div>
        
        <div class="search-container d-none d-md-block position-relative">
          <i class="bi bi-search search-icon position-absolute top-50 start-3 translate-middle-y text-muted"></i>
          <input type="text" class="form-control search-input" placeholder="ស្វែងរក">
        </div>

        <nav class="nav-menu d-flex align-items-center gap-3">
          <a href="#" class="nav-link active">ទំព័រដើម</a>
          <a href="#" class="nav-link">ផលិតផល</a>
          <a href="#" class="nav-link">សេវាកម្ម</a>
          <a href="#" class="nav-link">អំពីយើង</a>
          <a href="#" class="nav-link">ទំនាក់ទំនង</a>
          <a href="#" class="nav-icon ms-2 text-dark"><i class="bi bi-cart3 fs-5"></i></a>
          <a href="#" class="nav-icon text-dark"><i class="bi bi-person-circle fs-5"></i></a>
        </nav>
      </div>
    </header>

    <main class="container my-5">
        
        <section class="hero-banner row align-items-center px-4 py-5 p-md-5 mb-5 mx-0 position-relative">
            <div class="col-md-6 order-2 order-md-1 text-center text-md-start">
                <h1 class="hero-title fw-bold text-primary mb-3">សម្រាប់ជីវិតឌីជីថលរបស់អ្នក</h1>
                <p class="hero-desc text-muted mb-4">
                    ស្វែងរក Laptop, Gaming PC និងគ្រឿងបន្លាស់ជាច្រើនប្រភេទ ទំនើប ជាមួយតម្លៃសមរម្យ
                </p>
                <div class="d-flex justify-content-center justify-content-md-start gap-2">
                    <button class="btn btn-primary px-4 btn-sm rounded-2"><i class="bi bi-cart-fill me-2"></i>ទិញឥឡូវនេះ</button>
                    <button class="btn btn-outline-secondary px-4 btn-sm rounded-2">ព័ត៌មានបន្ថែម</button>
                </div>
            </div>
            <div class="col-md-6 order-1 order-md-2 text-center mb-4 mb-md-0">
                <img src="/public/6138jYxjJ1L.jpg" alt="Laptop" class="img-fluid hero-img">
            </div>
        </section>

        <section class="section-header mb-4">
          <h2 class="fw-bold section-title text-dark mb-1">ផលិតផលពិសេស</h2>
          <p class="text-muted small">ឧបករណ៍បច្ចេកវិទ្យាដែលពេញនិយមបំផុតសម្រាប់ជីវិតសម័យថ្មី</p>
        </section>

        <section class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          <div class="col" v-for="product in products" :key="product.id">
            <div class="card h-100 product-card border-0 position-relative overflow-hidden shadow-sm">
              
              <div class="image-wrapper position-relative overflow-hidden">
                <img :src="product.image" :alt="product.title" class="product-thumb">
                
                <div class="badge-group d-flex flex-column gap-1 position-absolute top-0 start-0 m-3">
                  <span class="badge bg-danger badge-custom badge-top-color" v-if="product.badgeTop">{{ product.badgeTop }}</span>
                  <span class="badge bg-secondary badge-custom badge-bottom-color" v-if="product.badgeBottom">{{ product.badgeBottom }}</span>
                </div>

                <button @click="addToCart(product)" class="hover-cart-btn position-absolute border-0 d-flex align-items-center justify-content-center shadow">
                  <i class="bi bi-cart3 fs-6 text-white"></i>
                </button>
              </div>

              <div class="card-body p-3 d-flex flex-column justify-content-between">
                <div>
                  <span class="brand-text text-muted text-uppercase mb-1 d-block">{{ product.brand }}</span>
                  <h5 class="product-name text-dark fw-semibold text-truncate mb-1" :title="product.title">
                    {{ product.title }}
                  </h5>

                  <div class="rating-container d-flex align-items-center mb-2 text-warning">
                    <div class="stars d-flex gap-1 me-2">
                      <i class="bi bi-star-fill small" v-for="n in 5" :key="n"></i>
                    </div>
                    <span class="review-text text-muted small">({{ product.reviews }})</span>
                  </div>

                  <div class="price-container d-flex align-items-baseline gap-2 mb-3">
                      <span class="current-price fw-bold text-dark">{{ product.price }}</span>
                      <span class="old-price text-muted small text-decoration-line-through" v-if="product.oldPrice">
                          {{ product.oldPrice }}
                      </span>
                  </div>
                </div>

                <div class="card-actions d-flex align-items-center justify-content-between gap-2">
                    <span class="stock-text text-success small fw-medium">
                        <i class="bi bi-check-circle-fill me-1"></i>មាននៅក្នុងស្តុក
                    </span>
                    <button class="btn btn-primary btn-sm px-2 action-btn buy-btn">ព័ត៌មានលម្អិត</button>
                </div>
              </div>

            </div>
          </div>
        </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const products = ref([
  {
    id: 1,
    brand: 'Camera',
    title: 'camera Sony Alpha 7 IV',
    reviews: '12398',
    price: 'BDT 125,980',
    oldPrice: 'BDT 135,129',
    badgeTop: 'លក់ដាច់បំផុត',
    badgeBottom: 'បញ្ចុះតម្លៃ',
    image: '/sony.jpg',
  },
])

const addToCart = (product) => {
  console.log(product.title)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kantumruuy+Pro:wght@300;400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css');

.shop-page {
  font-family: 'Kantumruuy Pro', sans-serif;
  background-color: #fafafa;
  min-height: 100vh;
}

/* Navbar */
.search-input {
  padding-left: 2.2rem;
  border-radius: 20px;
  background-color: #f0f2f5;
  border: none;
  font-size: 0.85rem;
  width: 260px;
}
.search-icon {
  left: 12px;
  z-index: 4;
}
.nav-link {
  color: #65676b;
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-link:hover, .nav-link.active {
  color: #0d6efd;
}

/* Banner Section */
.hero-banner {
  background-color: #fff;
  border: 1.5px solid #d1c4e9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  min-height: 450px; 
  display: flex;
  align-items: center;
}
.hero-title {
  color: #1a237e !important;
  font-size: 2.4rem;
  line-height: 1.3;
}
.hero-desc {
  font-size: 1rem;
  line-height: 1.6;
}
.hero-img {
  max-height: 380px;
  width: auto;
  object-fit: contain;
  animation: float-animation 4s ease-in-out infinite;
}

@keyframes float-animation {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* Product Cards */
.product-card {
  background-color: #ffffff;
  border-radius: 12px !important;
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), 
              box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.image-wrapper {
  height: 210px;
  width: 100%;
  background-color: #fbe134;
  position: relative;
}

.product-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.hover-cart-btn {
  bottom: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  background-color: #212529;
  border-radius: 50%;
  z-index: 10;
  opacity: 0;
  transform: translateY(8px) scale(0.9);
  transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
}

.product-card:hover .product-thumb {
  transform: scale(1.05);
}

.product-card:hover .hover-cart-btn {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hover-cart-btn:hover {
  background-color: #000;
  box-shadow: 0 0 12px rgba(251, 225, 52, 0.6) !important;
  transform: scale(1.08);
}

.action-btn {
  font-size: 0.8rem;
  padding: 7px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}
.buy-btn:hover {
  background-color: #000 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.badge-custom {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 20px !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.badge-top-color {
  background-color: #dc3545 !important;
}
.badge-bottom-color {
  background-color: #6c757d !important;
}

.stock-text {
  font-size: 0.85rem;
}
.brand-text {
  font-size: 0.8rem;
}
.product-name {
  font-size: 1rem;
}
.current-price {
  font-size: 1.05rem;
}
</style>