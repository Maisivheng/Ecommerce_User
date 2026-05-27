<template>
  <h4>ផលិតផលដែលបានទិញ</h4>

  <div class="row">
    <div class="col-md-4 mb-4">
      <div class="card card-ui overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/a8/5c/d6/a85cd6f4555a80585e33e333523acf79.jpg"
          class="card-img-top"
        />

        <div class="card-body">
          <h5>MacBook Pro</h5>

          <p class="text-muted">Purchased Successfully</p>

          <RouterLink to="/detail" class="btn btn-outline-primary w-100">
            View Detail
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.card-ui {
  border: none;
  border-radius: 20px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
}
</style>