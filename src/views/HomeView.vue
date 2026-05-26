<template>
    <Navbar></Navbar>
    <section class="hero-banner-full border-bottom">
        <div class="container-fluid py-3">
            <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between">
                <div class="col-12 col-lg-6 order-1 hero-text-content">
                    <h1 class="fw-bold mb-3" style="font-size: 36px; color: var(--primary-blue);">សម្រាប់ជីវិតឌីជីថលរបស់អ្នក</h1>
                    <p class="text-muted mb-4" style="font-size: 16px;">ស្វែងរក Laptop, Gaming PC និងគ្រឿងអេឡិចត្រូនិចទំនើបៗជាមួយតម្លៃពិសេសបំផុត។</p>
                    <div class="d-flex gap-2 justify-content-center justify-content-lg-start">
                        <button class="btn btn-primary px-4 py-2" style="background-color: var(--primary-blue); border: none;">ទិញឥឡូវនេះ</button>
                        <button class="btn btn-outline-secondary px-4 py-2">មើលបន្ថែម</button>
                    </div>
                </div>

                <div class="col-12 col-lg-6 order-2 hero-image-wrapper">
                    <img src="https://thumbs.dreamstime.com/b/bottles-global-soft-drink-brands-poznan-poland-oct-bottles-global-soft-drink-brands-including-products-coca-cola-company-233983437.jpg" class="img-fluid d-block rounded-2" alt="Hero Laptop">
                </div>
            </div>
        </div>
    </section>
    <BaseCard></BaseCard>
    <Footer></Footer>
    
</template>


<script setup>
    import BaseCard from '@/components/ui/BaseCard.vue';

</script>