<template>
    <footer class="py-4 Footer">
		<div class="container">
			<div class="row d-flex justify-content-between align-items-center">
				<div class="col-12 col-lg-3 pe-lg-0 mb-4 mb-lg-0">
					<h1 class="navbar-brand">ពិភពទំនិញ</h1>
				</div>
				<div class="col-12 col-lg-9 pe-lg-0 mb-4 mb-lg-0">
					<div class="row d-flex justify-content-between align-items-start">
						<div class="col-12 col-lg-3">
							<h3 class="footer-title">Quick Links</h3>
							<ul class="list-unstyled">
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
						<div class="col-12 col-lg-3">
							<h3 class="footer-KHtitle">ព័ត៌មានទំនាក់ទំនង</h3>
							<ul class="list-unstyled">
								<li class="nav-item">
									<router-link class="nav-link" to="/"><i class="bi bi-envelope me-2"></i>Example@gmail.com</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" to="/"><i class="bi bi-telephone me-2"></i>+855 XX XXX XXX</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" to="/"><i class="bi bi-geo-alt me-2"></i>ភ្នំពេញ, កម្ពុជា</router-link>
								</li>
							</ul>
						</div>
						<!-- <div class="col-12 col-lg-1"></div> -->
						<div class="col-12 col-lg-3">
							<h3 class="footer-title">Follow us</h3>
							<ul class="list-unstyled">
								<li class="nav-item">
									<router-link class="nav-link" to="/"><i class="bi bi-facebook me-2"></i>Facebook</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" to="/"><i class="bi bi-twitter-x me-2"></i>Twitter</router-link>
								</li>
								<li class="nav-item">
									<router-link class="nav-link" to="/"><i class="bi bi-instagram me-2"></i>Instagram</router-link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>