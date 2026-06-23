<script setup>
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import Purchased from '@/components/profiles/Purchased.vue'
</script>

<template>
  <Navbar />
  <main class="page-section py-5">
    <div class="container">
      <div class="section-header text-center mb-5">
        <span class="section-badge">ប្រវត្តិការទិញ</span>
        <h2 class="section-title mt-3">ផលិតផលដែលអ្នកបានទិញ</h2>
        <p class="section-text text-muted mx-auto mt-3">
          មើលការបញ្ជាទិញដែលបានបំពេញ និងទំនិញដែលបានទិញបានយ៉ាងងាយស្រួល។
        </p>
      </div>
      <Purchased />
    </div>
  </main>
  <Footer />
</template>

<style scoped>
.section-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(13, 110, 253, 0.12);
  color: #0d6efd;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.section-title {
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 800;
  color: #102a43;
}
.section-text {
  max-width: 780px;
}
.page-section {
  min-height: calc(100vh - 160px);
}
</style>