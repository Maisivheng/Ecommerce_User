<script setup>
import Navbar from "@/components/layout/Navbar.vue";
import Mycart from "@/components/profiles/Mycart.vue";
import { ref, onMounted, reactive } from "vue";
import api from "@/API/api";
import Purchased from "@/components/profiles/Purchased.vue";
import Own from "@/components/profiles/Own.vue";
import Devices from "@/components/profiles/Devices.vue";



const activeSection = ref("profile");

// loading
const loading = ref(false);

// image preview
const imagePreview = ref("");

// success message
const successMessage = ref("");

// validation errors
const errors = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
});

// form data
const form = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  verified: false,
  accountCreated: "",
  image: null,
});

// get profile
const getProfile = async () => {
  try {
   
    const response = await api.post("/api/profile/update", formData);
    const user = response.data.data;

    form.name = user.name || "";
    form.email = user.email || "";
    form.phone = user.phone || "";
    form.address = user.address || "";
    form.accountCreated = user.created_at || "";
    form.verified = user.verified || false;
    imagePreview.value = user.image || "";
  } catch (error) {
    console.log(error);
  }
};

// image upload
const handleImage = (event) => {
  const file = event.target.files[0];

  if (file) {
    form.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

// validation
const validateForm = () => {
  let isValid = true;

  errors.name = "";
  errors.email = "";
  errors.phone = "";
  errors.address = "";

  // name
  if (!form.name) {
    errors.name = "Name is required";
    isValid = false;
  }

  // email
  if (!form.email) {
    errors.email = "Email is required";
    isValid = false;
  }

  // phone
  if (!form.phone) {
    errors.phone = "Phone is required";
    isValid = false;
  }

  // address
  if (!form.address) {
    errors.address = "Address is required";
    isValid = false;
  }

  return isValid;
};

// update profile
const Editprofile = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("address", form.address);

    if (form.image) {
      formData.append("image", form.image);
    }

    // const response = await api.post("/api/user/update-profile", formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    const response = await api.post("/api/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);
    successMessage.value = "Profile updated successfully";

    console.log(response.data);
  } catch (error) {
    console.log(error);

    // alert("Update Failed");
    alert(error.response?.data?.message || "Update Failed");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getProfile();
});
</script>
<template>
  <body>
    <Navbar></Navbar>
    <div class="container-fluid">
      <div class="row">
        <!-- SIDEBAR -->
        <div class="col-lg-3 sidebar">
          <div class="text-center mb-4">
            <img
              :src="
                imagePreview ||
                'https://api-loukbontor.g2.ant.com.kh/storage/avatars/no_photo.jpg'
              "
              class="profile-img mb-3"
            />

            <h4>{{ form.name || "Name not available" }}</h4>

            <p class="text-muted">{{ form.email || "Email not available" }}</p>
            <!-- <span class="badge bg-success">Verified</span> -->
            <span
              class="badge"
              :class="form.verified ? 'bg-success' : 'bg-danger'"
            >
              {{ form.verified ? "Verified" : "Not Verified" }}
            </span>
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

            <a
              href="#"
              class="nav-link"
              @click.prevent="activeSection = 'devices'"
            >
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
            <Profileus></Profileus>
            <div class="card card-ui p-4">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h4>ប្រវត្តិរូប</h4>
                <button
                  @click="Editprofile"
                  :disabled="loading"
                  class="btn btn-primary"
                >
                  {{ loading ? "កំពុងផ្ទុក..." : "ធ្វើបច្ចុប្បន្នភាព" }}
                </button>
              </div>
              <!-- add alert -->
              <div v-if="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label>ឈ្មោះ​</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.name"
                    placeholder="បញ្ចូល​ឈ្មេាះ"
                  />
                  <small class="text-danger">
                    {{ errors.name }}
                  </small>
                </div>

                <div class="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="form.email"
                    placeholder="បញ្ចូលអុីមែល"
                  />
                  <small class="text-danger">
                    {{ errors.email }}
                  </small>
                </div>

                <div class="col-md-6 mb-3">
                  <label>លេខទូរសព្ទ</label>
                  <input
                    v-model="form.phone"
                    type="text"
                    class="form-control"
                    placeholder="បញ្ចូលលេខទូរសព្ទ"
                  />
                  <small class="text-danger">
                    {{ errors.phone }}
                  </small>
                </div>

                <div class="col-md-6 mb-3">
                  <label class=""> Profile Image</label>

                  <input
                    type="file"
                    class="form-control"
                    accept="image/*"
                    @change="handleImage"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label"> Account Created </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model="form.accountCreated"
                    readonly
                  />
                </div>
                <div class="col-12 mb-3">
                  <label>Address</label>
                  <textarea
                    class="form-control"
                    rows="4"
                    v-model="form.address"
                    placeholder="បញ្ចូលអាសយដ្ឋាន"
                  >
Phnom Penh, Cambodia
                  </textarea>
                  <small class="text-danger">
                    {{ errors.address }}
                  </small>
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
                <button class="btn btn-primary">
                  ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់
                </button>
              </div>
            </div>
          </section>

          <!-- MY CART -->
          <section v-if="activeSection == 'cart'" id="" class="mb-5">
            
            <Mycart></Mycart>

          </section>

          <!-- PURCHASED PRODUCTS -->
          <section v-if="activeSection === 'purchased'" id="" class="mb-5">
            <Purchased></Purchased>
          </section>

          <!-- OWN PRODUCTS -->
          <section v-if="activeSection === 'own'" id="" class="mb-5">
            <Own></Own>
      
          </section>

          <!-- DEVICES -->
          <section v-if="activeSection === 'devices'" id="" class="mb-5">
            <Devices></Devices>

          </section>
        </div>
      </div>
    </div>
  </body>
</template>

<style scoped>
body {
  /* background: #f5f7fb; */
  background: #f6f9fc;
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
