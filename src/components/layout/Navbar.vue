<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div class="container-fluid">
            <a class="navbar-brand me-4" href="#">ពិភពទំនិញ</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                
                <div class="search-wrapper col-12 col-lg-3 my-2 my-lg-0 me-3">
                    <i class="bi bi-search"></i>
                    <input class="form-control" type="search" placeholder="ស្វែងរក" aria-label="Search">
                </div>

                <div class="d-flex gap-2 my-2 my-lg-0 me-auto">
                    <a href="#" class="btn-nav-outline"><i class="bi bi-cart"></i> ចង់ទិញ</a>
                    <a href="#" class="btn-nav-outline"><i class="bi bi-shop"></i> ចង់លក់</a>
                </div>

                <ul class="navbar-nav align-items-center gap-3">
                    <li class="nav-item"><a class="nav-link text-dark" href="#">ទំព័រដើម</a></li>
                    <li class="nav-item"><a class="nav-link text-dark" href="#">អំពីយើង</a></li>
                    <li class="nav-item"><a class="nav-link text-dark" href="#">ផលិតផល</a></li>
                    <li class="nav-item me-2"><a class="nav-link text-dark" href="#">ទំនាក់ទំនង</a></li>
                    <li class="nav-item d-flex gap-3 ms-2">
                        <a href="#" class="text-dark fs-5"><i class="bi bi-cart"></i></a>
<<<<<<< HEAD
                        <!-- <a href="#" class="text-dark fs-5"><i class="bi bi-person"></i></a> -->
                        <RouterLink class="fs-5 text-dark" to="/profile"><i class="bi bi-person"></i></RouterLink>
                        
                        
=======
                        <router-link to="/profile" class="text-dark fs-5"><i class="bi bi-person"></i></router-link>
>>>>>>> 4eebd8c9a6fc960540f42e4d21c2edba76e3ca9d
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    
</template>
<script setup>
import { RouterLink } from 'vue-router';
</script>