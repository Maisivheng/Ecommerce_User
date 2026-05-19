<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid justify-content-between">
            <a class="navbar-brand" href="#">ពិភពទំនិញ</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">  
                <form class="search-input-wrapper">
                    <i class="bi bi-search"></i>
                    <input type="text" placeholder="ស្វែងរក" class="search-input" autofocus>
                </form>

                <div class="btn-router d-flex align-items-center justify-content-between gap-2">
                    <router-link class="nav-link btn-item d-flex justify-content-center" to="/"><i class="bi bi-cart3 me-1"></i>ទិញ</router-link>
                    <router-link class="nav-link btn-item d-flex justify-content-center" to="/"><i class="bi bi-shop me-1"></i>លក់</router-link>

                    <ul class="navbar-nav align-items-center">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/">ទំព័រដើម</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/aboutUS">អំពីយើង</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/products">ផលិតផល</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/contactUS">ទំនាក់ទំនង</router-link>
                        </li>
                    </ul>
                </div>  
                
                <div class=" d-flex justify-content-between align-items-center gap-3">
                    <router-link class="nav-link cart-link px-2 py-1 rounded-5 d-flex justify-content-center" to="/"><i class="bi bi-cart3"></i><span class="text-danger">3</span>កន្រ្តក</router-link>
                    <router-link to="/"><i class="bi bi-person-circle"></i></router-link>
                </div>
            </div>
        </div>
    </nav>

    

</template>