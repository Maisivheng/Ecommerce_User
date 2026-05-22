<template>
  <section class="container py-4">
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="row g-0">
        <!-- Image -->
        <div class="col-lg-5">
          <img
            src="https://i.pinimg.com/736x/a8/5c/d6/a85cd6f4555a80585e33e333523acf79.jpg"
            class="w-100 h-100 object-fit-cover"
            style="min-height: 500px"
          />
        </div>

        <!-- Detail -->
        <div class="col-lg-7">
          <div class="p-4">
            <!-- Category -->
            <span class="badge bg-primary mb-3"> Book </span>

            <!-- Title -->
            <h2 class="fw-bold mb-3">Computer</h2>

            <!-- Price -->
            <h3 class="text-primary fw-bold mb-4">$20.5</h3>

            <!-- Condition -->
            <div class="mb-3">
              <strong>Condition:</strong>
              Super Old
            </div>

            <!-- Description -->
            <div class="mb-4">
              <h5 class="fw-bold">Description</h5>

              <p class="text-muted">This is description</p>
            </div>

            <!-- Detail -->
            <div class="mb-4">
              <h5 class="fw-bold">Product Detail</h5>

              <p class="text-muted">This is detail</p>
            </div>

            <!-- Story -->
            <div class="mb-4">
              <h5 class="fw-bold">Story</h5>

              <p class="text-muted">No story</p>
            </div>

            <!-- Creator -->
            <div class="d-flex align-items-center border rounded-4 p-3 mb-4">
              <img
                src="https://api-loukbontor.g2.ant.com.kh/storage/avatars/no_photo.jpg"
                width="60"
                height="60"
                class="rounded-circle me-3"
              />

              <div>
                <h6 class="fw-bold mb-1">Sreng menghlin</h6>

                <small class="text-muted d-block"> srengmenghlin@gmail.com </small>

                <small class="text-muted"> 2026-05-07 </small>
              </div>
            </div>

            <!-- Buttons -->
            <div class="d-flex justify-content-between gap-3">
              <div class="gap-2 d-flex">
                <button class="btn btn-primary btn-sm">
                  <i class="bi bi-cart-plus"></i>
                  Add to Cart
                </button>

                <!-- <button class="btn btn-warning px-4 text-light">
                  <i class="bi bi-pencil"></i>
                  Edit
                </button> -->
              </div>
              <button class="btn btn-secondary px-4 btn-sm" @click="$router.back()">
                <i class="bi bi-arrow-left"></i>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
