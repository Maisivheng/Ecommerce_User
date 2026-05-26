<template>  
    <footer class="py-5 border-top">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-4 col-md-12">
                    <h3 class="navbar-brand text-dark mb-3">ពិភពទំនិញ</h3>
                    <p class="text-muted">បទពិសោធន៍ទិញទំនិញអនឡាញដ៏ងាយស្រួល ទំនុកចិត្តខ្ពស់ និងរហ័សទាន់ចិត្ត។</p>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <h6 class="fw-bold text-dark mb-3">ព័ត៌មានទំនាក់ទំនង</h6>
                    <ul class="list-unstyled text-muted lh-lg">
                        <li><i class="bi bi-envelope me-2"></i>anttraining2023@gmail.com</li>
                        <li><i class="bi bi-telephone me-2"></i>+855 XX XXX XXX</li>
                        <li><i class="bi bi-geo-alt me-2"></i>Phnom Penh, Cambodia</li>
                    </ul>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <h6 class="fw-bold text-dark mb-3">Quick Links</h6>
                    <ul class="list-unstyled">
                        <li><router-link to="/" class="text-decoration-none text-muted mb-2 d-block">ទំព័រដើម</router-link></li>
                        <li><router-link to="/" class="text-decoration-none text-muted mb-2 d-block">អំពីយើង</router-link></li>
                        <li><router-link to="/" class="text-decoration-none text-muted mb-2 d-block">ផលិតផល</router-link></li>
                        <li><router-link to="/" class="text-decoration-none text-muted mb-2 d-block">ទំនាក់ទំនង</router-link></li>
                    </ul>
                </div>
                <div class="col-md-4 col-lg-3">
                    <h6 class="fw-bold text-dark mb-3">Follow us</h6>
                    <div class="d-flex gap-3">
                        <a to="anttraining2023@gmail.com" class="text-dark fs-5"><i class="bi bi-facebook"></i></a>
                        <a to="anttraining2023@gmail.com" class="text-dark fs-5"><i class="bi bi-youtube"></i></a>
                        <a to="/" class="text-dark fs-5"><i class="bi bi-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
    import { ref } from 'vue';
</script>