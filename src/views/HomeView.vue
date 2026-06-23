<template>  
  <Navbar />
  <!-- HERO SECTION -->
  <section class="hero-section" style="position: relative;">
    <div class="container">

      <div class="row align-items-center min-vh-75">

        <!-- LEFT -->
        <div class="col-lg-6 mb-5 mb-lg-0">

          <span class="badge-custom mb-3">
            🔥 ទិញទំនិញគ្រប់ប្រភេទក្នុងតម្លៃពិសេស
          </span>

          <h1 class="hero-title mb-4">
            ផ្សារអនឡាញសម្រាប់
            <span class="text-primary-custom">
              គ្រប់តម្រូវការ
            </span>
            របស់អ្នក
          </h1>

          <p class="hero-description mb-4">
            ស្វែងរកសម្លៀកបំពាក់, គ្រឿងអេឡិចត្រូនិច,
            Laptop, ទូរស័ព្ទ, សម្ភារៈផ្ទះបាយ,
            គ្រឿងសំអាង និងផលិតផលជាច្រើនទៀត
            ក្នុងតម្លៃសមរម្យ និងគុណភាពល្អ។
          </p>

          <!-- BUTTONS -->
          <div class="d-flex flex-wrap gap-3">

            <RouterLink to="/shop-page" class="btn btn-shop d-inline-flex align-items-center">
              <i class="bi bi-bag-fill me-2"></i>
              ទិញឥឡូវនេះ
            </RouterLink>

            <RouterLink to="/purchased" class="btn btn-outline-custom d-inline-flex align-items-center">
              មើលការទិញរួច
            </RouterLink>

          </div>

          <!-- STATS -->
          <div class="row mt-5 g-4">

            <div class="col-4">
              <h4 class="fw-bold mb-1">10K+</h4>
              <p class="text-muted small mb-0">ផលិតផល</p>
            </div>

            <div class="col-4">
              <h4 class="fw-bold mb-1">5K+</h4>
              <p class="text-muted small mb-0">អតិថិជន</p>
            </div>

            <div class="col-4">
              <h4 class="fw-bold mb-1">24/7</h4>
              <p class="text-muted small mb-0">សេវាកម្ម</p>
            </div>

          </div>

        </div>

        <!-- RIGHT -->
        <div class="col-lg-6">

          <div class="hero-image-box">

            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop"
              class="img-fluid hero-image"
              alt="shopping"
            >

            <!-- Floating Card -->
            <div class="floating-card">

              <div class="d-flex align-items-center gap-3">

                <div class="icon-circle">
                  <i class="bi bi-truck"></i>
                </div>

                <div>
                  <h6 class="mb-0 fw-bold">ដឹកជញ្ជូនរហ័ស</h6>
                  <small class="text-muted">
                    ដឹកដល់ផ្ទះទូទាំងប្រទេស
                  </small>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  </section>
  <BaseCard />
  <Footer />
  

</template>

<script setup>
  
  import Navbar from '@/components/layout/Navbar.vue'
  import Footer from '@/components/layout/Footer.vue'
  import BaseCard from '@/components/ui/BaseCard.vue'


  
</script>

<style scoped>
:global(:root) {
  --primary-color: #0d6efd;
}

.hero-section {
  margin-bottom: 0px !important;
  position: relative;
  background: linear-gradient(to right, #f8fbff, #eef5ff);
  padding: 120px 0;
}

.min-vh-75 {
  min-height: 75vh;
}

.badge-custom {
  display: inline-block;
  background: #dbeafe;
  color: #2563eb;
  padding: 10px 18px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
}

.hero-title {
  font-size: 55px;
  font-weight: 800;
  line-height: 1.3;
}

.text-primary-custom {
  color: var(--primary-color);
}

.hero-description {
  color: #6c757d;
  font-size: 18px;
  line-height: 1.8;
}

.btn-shop{
  background: var(--primary-color);
  color: white;
  border-radius: 50px;
  padding: 12px 28px;
  border: none;
  font-weight: 600;
}

.btn-shop:hover {
  background: #0b5ed7;
  color: white;
}

.btn-outline-custom {
  border: 2px solid #dee2e6;
  border-radius: 50px;
  padding: 12px 28px;
  font-weight: 600;
}


.hero-image-box {
  position: relative;
}

.hero-image {
  border-radius: 30px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

.floating-card {
  position: absolute;
  bottom: -20px;
  left: -20px;
  background: white;
  padding: 18px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.icon-circle {
  width: 50px;
  height: 50px;
  background: #e7f1ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 20px;
}

.category-card {
  background: white;
  padding: 30px 20px;
  border-radius: 20px;
  text-align: center;
  transition: 0.3s;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0,0,0,0.05);
}

.category-card:hover {
  transform: translateY(-8px);
}

.category-icon {
  font-size: 40px;
  color: var(--primary-color);
}

@media(max-width: 991px) {
  .hero-title {
    font-size: 38px;
  }

  .hero-section {
    text-align: center;
  }

  .floating-card {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
