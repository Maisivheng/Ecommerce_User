<template>
	<footer>
        <div class="container">
            <div class="row g-4 g-lg-5">
                <div class="col-12 col-md-3">
                    <div class="footer-title mb-3">ពិភពទំនិញ</div>
                    <p class="text-muted">រាល់ការទិញទំនិញបច្ចេកវិទ្យាប្រកបដោយទំនុកចិត្ត និងគុណភាពខ្ពស់។</p>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <h6 class="footer-title mb-3">ព័ត៌មានទំនាក់ទំនង</h6>
                    <ul class="list-unstyled text-muted d-grid gap-2">
                        <li><i class="bi bi-envelope me-2"></i> Example@gmail.com</li>
                        <li><i class="bi bi-telephone me-2"></i> +855 XX XXX XXX</li>
                        <li><i class="bi bi-geo-alt me-2"></i> Phnom Penh, Cambodia</li>
                    </ul>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <h6 class="footer-title mb-3">Quick Links</h6>
                    <ul class="list-unstyled d-grid gap-2">
                        <li><router-link to="/aboutUs" class="text-decoration-none text-muted">អំពីយើង</router-link></li>
                        <li><router-link to="/products" href="#" class="text-decoration-none text-muted">ផលិតផល</router-link></li>
                        <li><router-link to="/" class="text-decoration-none text-muted">សេវាកម្ម</router-link></li>
                    </ul>
                </div>
                <div class="col-12 col-md-3">
                    <h6 class="footer-title mb-3">Follow us</h6>
                    <div class="d-flex gap-3">
                        <router-link to="/" class="text-dark fs-5"><i class="bi bi-facebook"></i></router-link>
                        <router-link to="/" class="text-dark fs-5"><i class="bi bi-twitter-x"></i></router-link>
                        <router-link to="/" class="text-dark fs-5"><i class="bi bi-instagram"></i></router-link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>