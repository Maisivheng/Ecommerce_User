<template>
    <footer style="background-color: #e5e7eb;">
        <div class="container-fluid custom-padding-container">
            <div class="row g-4">
                <div class="col-lg-4 col-md-12">
                    <h3 class="navbar-brand text-dark mb-3">ពិភពទំនិញ</h3>
                    <p class="text-muted" style="font-family: 'Kantumruy Pro', sans-serif; font-size: 18px;">បទពិសោធន៍ទិញទំនិញអនឡាញដ៏ងាយស្រួល ទំនុកចិត្តខ្ពស់ និងរហ័សទាន់ចិត្ត។</p>
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <h6 class="fw-bold text-dark mb-3" style="font-family: 'Kantumruy Pro', sans-serif; font-size: 18px;">ព័ត៌មានទំនាក់ទំនង</h6>
                    <ul class="list-unstyled text-muted lh-lg">
                        <li><i class="bi bi-envelope me-2" style="font-family: 'Kantumruy Pro', sans-serif; font-size: 18px;"></i>anttraining2023@gmail.com</li>
                        <li><i class="bi bi-telephone me-2" style="font-family: 'Kantumruy Pro', sans-serif; font-size: 18px;"></i>+855 XX XXX XXX</li>
                        <li><i class="bi bi-geo-alt me-2" style="font-family: 'Kantumruy Pro', sans-serif; font-size: 18px;"></i>Phnom Penh, Cambodia</li>
                    </ul>
                </div>
                <div class="col-6 col-md-4 col-lg-2">
                    <h6 class="fw-bold text-dark mb-3" style="font-family: 'Inter', sans-serif; font-size: 18px;">Quick Links</h6>
                    <ul class="list-unstyled">
                        <li><router-link to="/" class="text-decoration-none text-muted mb-2 d-block" style="font-family: 'Kantumruy Pro', sans-serif; font-size: 18px;">ទំព័រដើម</router-link></li>
                        <li><router-link to="/" class="text-decoration-none text-muted mb-2 d-block" style="font-family: 'Kantumruy Pro', sans-serif; font-size: 18px;">អំពីយើង</router-link></li>
                        <li><router-link to="/" class="text-decoration-none text-muted mb-2 d-block" style="font-family: 'Kantumruy Pro', sans-serif; font-size: 18px;">ផលិតផល</router-link></li>
                        <li><router-link to="/" class="text-decoration-none text-muted mb-2 d-block" style="font-family: 'Kantumruy Pro', sans-serif; font-size: 18px;">ទំនាក់ទំនង</router-link></li>
                    </ul>
                </div>
                <div class="col-md-4 col-lg-3">
                    <h6 class="fw-bold text-dark mb-3" style="font-family: 'Inter', sans-serif; font-size: 18px;">Follow us</h6>
                    <div class="d-flex gap-3">
                        <router-link to="anttraining2023@gmail.com" class="text-dark fs-5"><i class="bi bi-facebook"></i></router-link>
                        <router-link to="anttraining2023@gmail.com" class="text-dark fs-5"><i class="bi bi-youtube"></i></router-link>
                        <router-link to="/" class="text-dark fs-5"><i class="bi bi-instagram"></i></router-link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
    import { ref } from 'vue';
</script>