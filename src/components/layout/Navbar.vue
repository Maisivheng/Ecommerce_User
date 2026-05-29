<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
        <div class="container">

            <!-- Logo -->
            <router-link to="/" class="navbar-brand fw-bold fs-4 text-primary">
                ពិភពទំនិញ
            </router-link>


            <!-- Navbar -->
            <div class="collapse navbar-collapse" id="navbarNav">

                <!-- Buy / Sell -->
                <div class="d-flex gap-2 my-3 my-lg-0">

                    <router-link to="/" class="btn btn-primary rounded-pill px-4">
                        <i class="bi bi-cart me-1"></i>
                        ចង់ទិញ
                    </router-link>

                    <router-link to="/sell" class="btn btn-outline-primary rounded-pill px-4">
                        <i class="bi bi-shop me-1"></i>
                        ចង់លក់
                    </router-link>

                </div>

                <!-- Menu -->
                <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3 mt-3 mt-lg-0">

                    <li class="nav-item">
                        <router-link to="/" class="nav-link">
                            ទំព័រដើម
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link to="/about" class="nav-link">
                            អំពីយើង
                        </router-link>
                    </li>

                    <li class="nav-item">
                        <router-link to="/contact" class="nav-link">
                            ទំនាក់ទំនង
                        </router-link>
                    </li>

                    <!-- Right Side -->
                    <li class="nav-item d-flex align-items-center gap-2 ms-lg-3">

                        <!-- Cart -->
                        <router-link to="/cart" class="icon-link">
                            <i class="bi bi-cart3"></i>
                        </router-link>

                        <!-- Wishlist -->
                        <router-link to="/wishlist" class="icon-link">
                            <i class="bi bi-heart"></i>
                        </router-link>

                        <router-link v-if="auth.token" to="/profile" class="icon-link">
                            <i class="bi bi-person-circle"></i>
                        </router-link>
                        
                        <!-- Login -->
                        <router-link v-else to="/login" class="btn btn-outline-primary rounded-pill px-4">
                            Login
                        </router-link>
                    </li>

                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useauthStore } from '@/stores/auth';
const auth = useauthStore();
</script>
