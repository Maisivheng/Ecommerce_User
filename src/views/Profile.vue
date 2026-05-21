<script setup>
import { ref } from "vue";

const activeSection = ref("profile");
</script>
<template>
  <body>
    <div class="container-fluid">
      <div class="row">
        <!-- SIDEBAR -->
        <div class="col-lg-3 sidebar">
          <div class="text-center mb-4">
            <img
              src="https://i.pinimg.com/1200x/c2/6b/62/c26b629bb68ddf6ea556d62f13b3b361.jpg"
              class="profile-img mb-3"
            />

            <h4>Sreng Menglin</h4>

            <p class="text-muted">srengmenglin@gmail.com</p>
            <span class="badge bg-success">Verified</span>
          </div>

          <div class="nav flex-column">
            <a
              href="#"
              class="nav-link"
              @click.prevent="activeSection = 'profile'"
            >
              <i class="bi bi-person"></i>
              ប្រវត្តិរូប
            </a>
            
            <a
              href="#"
              class="nav-link"
              @click.prevent="activeSection = 'password'"
            >
              <i class="bi bi-lock"></i>
              ផ្លាស់ប្តូរពាក្យសម្ងាត់
            </a>

            <a
              href="#"
              class="nav-link"
              @click.prevent="activeSection = 'cart'"
            >
              <i class="bi bi-cart"></i>
              របស់ខ្ញុំ
            </a>

            <a
              href="#"
              class="nav-link"
              @click.prevent="activeSection = 'purchased'"
            >
              <i class="bi bi-bag"></i>
              ផលិតផលដែលបានទិញ
            </a>

            <a href="#" class="nav-link" @click.prevent="activeSection = 'own'">
              <i class="bi bi-box"></i>
              ផលិតផលរបស់ខ្ញុំ
            </a>

            <!-- <a
              href="#"
              class="nav-link"
              @click.prevent="activeSection = 'devices'"
            >
              <i class="bi bi-phone"></i>
              Devices
            </a> -->

            <a href="#" class="nav-link text-danger">
              <i class="bi bi-box-arrow-right"></i>
              Logout
            </a>
          </div>
        </div>

        <!-- CONTENT -->
        <div class="col-lg-9 p-4">
          <!-- DASHBOARD -->
          <section id="">
            <div class="section-title">Account Overview</div>
            <div class="row mb-4">
              <div class="col-md-4 mb-3">
                <div class="card card-ui stat-card">
                  <h2>20</h2>
                  <p>ផលិតផលសរុប</p>
                </div>
              </div>

              <div class="col-md-4 mb-3">
                <div class="card card-ui stat-card">
                  <h2>12</h2>
                  <p>ផលិតផលដែលបានទិញ</p>
                </div>
              </div>

              <div class="col-md-4 mb-3">
                <div class="card card-ui stat-card">
                  <h2>5</h2>
                  <p>Devices</p>
                </div>
              </div>
            </div>
          </section>

          <!-- PROFILE -->
          <section v-if="activeSection === 'profile'" id="" class="mb-5">
            <div class="card card-ui p-4">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h4>ប្រវត្តិរូប</h4>
              <button class="btn btn-primary">កែប្រែ​ ប្រវត្តិរូប</button>
                <!-- <div class="d-flex gap-2">
                  <button class="btn btn-primary">កែប្រែ​ ប្រវត្តិរូប</button>
                  <button class="btn btn-danger">លុបគណនី</button>
                </div> -->
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label>ឈ្មោះ​</label>
                  <input
                    type="text"
                    class="form-control"
                    readonly
                    value="Chandalen"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    class="form-control"
                    value="user@gmail.com"
                    readonly
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label>លេខទូរសព្ទ</label>
                  <input
                    type="text"
                    class="form-control"
                    value="+85512345678"
                    readonly
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class=""> Profile Image</label>

                  <input type="file" class="form-control" accept="image/*" />
                </div>
                <div class="col-12">
                  <label class="form-label"> Account Created </label>

                  <input
                    type="text"
                    class="form-control"
                    :value="'2024-01-01 12:00:00'"
                    readonly
                  />
                </div>
                <div class="col-12 mb-3">
                  <label>Address</label>
                  <textarea class="form-control" readonly rows="4">Phnom Penh, Cambodia
                  </textarea>
                </div>
              </div>
            </div>
          </section>

          <!-- CHANGE PASSWORD -->
          <section v-if="activeSection === 'password'" id="" class="mb-5">
            <div class="card card-ui p-4">
              <h3 class="mb-4">ផ្លាស់ប្តូរពាក្យសម្ងាត់</h3>

              <div class="mb-3">
                <label>ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
                <input type="password" class="form-control" />
              </div>

              <div class="mb-3">
                <label>ពាក្យសម្ងាត់ថ្មី</label>
                <input type="password" class="form-control" />
              </div>

              <div class="mb-3">
                <label>បញ្ជាក់ពាក្យសម្ងាត់</label>
                <input type="password" class="form-control" />
              </div>

             <div class="">
               <button class="btn btn-primary">ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់</button>
             </div>
            </div>
            
          </section>

          <!-- MY CART -->
          <section v-if="activeSection == 'cart'" id="" class="mb-5">
            <div class="card card-ui p-4">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h4>របស់ខ្ញុំ</h4>
                <button class="btn btn-success">ទូទាត់ប្រាក់</button>
              </div>

              <table class="table align-middle">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Categories</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      <img
                        src="https://i.pinimg.com/736x/a8/5c/d6/a85cd6f4555a80585e33e333523acf79.jpg"
                        class="product-img"
                      />
                    </td>

                    <td>iPhone 17 Promax</td>
                    <td>Electronics</td>
                    <td>$900</td>
                    <td>1</td>
                    <td>$900</td>

                    <td>
                      <button class="btn btn-danger btn-sm">Remove</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img
                        src="https://i.pinimg.com/1200x/f0/0d/f9/f00df9f9550c347e901ef3ec72be3522.jpg"
                        class="product-img"
                      />
                    </td>

                    <td>Sumsung S26 Ultra</td>
                    <td>Electronics</td>
                    <td>$900</td>
                    <td>1</td>
                    <td>$900</td>

                    <td>
                      <button class="btn btn-danger btn-sm">Remove</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img
                        src="https://i.pinimg.com/1200x/bd/16/0c/bd160c8a571eecfa20b58612d424d06c.jpg"
                        class="product-img"
                      />
                    </td>

                    <td>Sumsung S26 Ultra</td>
                    <td>Electronics</td>
                    <td>$900</td>
                    <td>1</td>
                    <td>$900</td>

                    <td>
                      <button class="btn btn-danger btn-sm">Remove</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- PURCHASED PRODUCTS -->
          <section v-if="activeSection === 'purchased'" id="" class="mb-5">
            <!-- <div class="section-title">ផលិតផលដែលបានទិញ</div> -->
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

                    <RouterLink
                      to="/detail"
                      class="btn btn-outline-primary w-100"
                    >
                      View Detail
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- OWN PRODUCTS -->
          <section v-if="activeSection === 'own'" id="" class="mb-5">
            <div class="card card-ui p-4">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h4>ផលិតផលរបស់ខ្ញុំ</h4>
                <button class="btn btn-primary">Add Product</button>
              </div>

              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>#001</td>
                    <td>Gaming Laptop</td>
                    <td>Electronics</td>
                    <td>$1200</td>
                    <td>2026-05-07</td>

                    <td class="d-flex gap-2">
                      <button class="btn btn-warning btn-sm px-3">Edit</button>

                      <button class="btn btn-danger btn-sm px-3">Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td>#001</td>
                    <td>Gaming Laptop</td>
                    <td>Electronics</td>
                    <td>$1200</td>
                    <td>2026-05-07</td>

                    <td class="d-flex gap-2">
                      <button class="btn btn-warning btn-sm px-3">Edit</button>

                      <button class="btn btn-danger btn-sm px-3">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- DEVICES -->
          <section v-if="activeSection === 'devices'" id="" class="mb-5">
            <div class="card card-ui p-4">
              <!-- <h3 class="mb-4">ឧបករណ៍ដែលបានតភ្ជាប់</h3> -->
              <h4>ឧបករណ៍ដែលបានតភ្ជាប់</h4>

              <div class="list-group">
                <div
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h6 class="mb-1">Windows Laptop</h6>
                    <small>Chrome Browser</small>
                  </div>

                  <button class="btn btn-outline-danger btn-sm">Remove</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </body>
</template>

<style scoped>

body {
  background: #f5f7fb;
  /* font-family: Arial, sans-serif; */
}

.sidebar {
  min-height: 100vh;
  background: white;
  border-right: 1px solid #eee;
  padding: 25px;
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #0d6efd;
}

.nav-link {
  color: #333;
  padding: 14px 18px;
  border-radius: 12px;
  margin-bottom: 10px;
  transition: 1s;
  font-weight: 500;
}

.nav-link:hover {
  background: #0d6efd;
  color: white;
}
.nav-link.active {
  background: #0d6efd;
  color: white;
}

.card-ui {
  border: none;
  border-radius: 20px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
}

.stat-card {
  padding: 25px;
  text-align: center;
}

.product-img {
  width: 70px;
  border-radius: 10px;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
