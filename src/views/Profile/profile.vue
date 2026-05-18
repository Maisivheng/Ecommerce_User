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

            <h4>Chandalen Teang</h4>

            <p class="text-muted">chandalen@gmail.com</p>
            <div class="gap-2 d-flex mt-4 justify-content-center">
              <button class="btn btn-primary">Edit Profile</button>
              <!-- <button class="btn btn-danger">Delete Account</button> -->
            </div>
          </div>

          <div class="nav flex-column">
            <a href="#profile" class="nav-link">
              <i class="bi bi-person"></i>
              Profile Info
            </a>

            <a href="#" class="nav-link">
              <i class="bi bi-lock"></i>
              Change Password
            </a>

            <a href="#cart" class="nav-link">
              <i class="bi bi-cart"></i>
              My Cart
            </a>

            <a href="#purchased" class="nav-link">
              <i class="bi bi-bag"></i>
              Purchased Products
            </a>

            <a href="#own" class="nav-link">
              <i class="bi bi-box"></i>
              Own Products
            </a>

            <a href="#devices" class="nav-link">
              <i class="bi bi-phone"></i>
              Devices
            </a>

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
            <div class="section-title">Products Information</div>
            <div class="row mb-4">
              <div class="col-md-4 mb-3">
                <div class="card card-ui stat-card">
                  <h2>20</h2>
                  <p>Total Products</p>
                </div>
              </div>

              <div class="col-md-4 mb-3">
                <div class="card card-ui stat-card">
                  <h2>12</h2>
                  <p>Orders</p>
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
          <section id="profile" class="mb-5">
            <div class="card card-ui p-4">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h3>Profile Information</h3>
                <!-- <button class="btn btn-primary">Save</button> -->
                <div class="d-flex gap-2">
                  <button class="btn btn-primary">Edit Profile</button>
                  <button class="btn btn-danger">Delete Account</button>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label>Name</label>
                  <input type="text" class="form-control" value="Chandalen" />
                </div>

                <div class="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    class="form-control"
                    value="user@gmail.com"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    class="form-control"
                    value="+85512345678"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label>Username</label>
                  <input type="text" class="form-control" value="chandalen" />
                </div>
                <div class="col-md-12 mb-3">
                  <label class="form-label"> Profile Image </label>

                  <input type="file" class="form-control" accept="image/*" />
                </div>
                <div class="col-12 mb-3">
                  <label>Address</label>
                  <textarea class="form-control" rows="4">
Phnom Penh, Cambodia</textarea
                  >
                </div>
              </div>
            </div>
          </section>

          <!-- CHANGE PASSWORD -->
          <section id="password" class="mb-5">
            <div class="card card-ui p-4">
              <h3 class="mb-4">Change Password</h3>

              <div class="mb-3">
                <label>Current Password</label>
                <input type="password" class="form-control" />
              </div>

              <div class="mb-3">
                <label>New Password</label>
                <input type="password" class="form-control" />
              </div>

              <div class="mb-3">
                <label>Confirm Password</label>
                <input type="password" class="form-control" />
              </div>

              <button class="btn btn-primary">Update Password</button>
            </div>
          </section>

          <!-- MY CART -->
          <section id="cart" class="mb-5">
            <div class="card card-ui p-4">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h3>My Cart</h3>
                <button class="btn btn-success">Checkout</button>
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
          <section id="purchased" class="mb-5">
            <div class="section-title">Purchased Products</div>

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

                    <button class="btn btn-outline-primary w-100">
                      View Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- OWN PRODUCTS -->
          <section id="own" class="mb-5">
            <div class="card card-ui p-4">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h3>Own Products</h3>
                <button class="btn btn-primary">Add Product</button>
              </div>

              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Categories</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>#001</td>
                    <td>Gaming Laptop</td>
                    <td>Electronics</td>
                    <td>$1200</td>
                    <td>
                      <span class="badge bg-success"> Active </span>
                    </td>

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
          <section id="devices" class="mb-5">
            <div class="card card-ui p-4">
              <h3 class="mb-4">Connected Devices</h3>

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
  font-family: Arial, sans-serif;
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
.nav-link.active,
:focus {
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
