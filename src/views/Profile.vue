<script setup>
import Navbar from "@/components/layout/Navbar.vue";
import Mycart from "@/components/profiles/Mycart.vue";
import Purchased from "@/components/profiles/Purchased.vue";
import Own from "@/components/profiles/Own.vue";
import Devices from "@/components/profiles/Devices.vue";
import ChangePW from "@/components/profiles/ChangePW.vue";

import { ref, reactive, onMounted } from "vue";
import api from "@/API/api";

// ===========================
// ACTIVE SECTION
// ===========================

const activeSection = ref("profile");

// ===========================
// LOADING
// ===========================

const loading = ref(false);

// ===========================
// IMAGE PREVIEW
// ===========================

const imagePreview = ref("");

// ===========================
// SUCCESS MESSAGE
// ===========================

const successMessage = ref("");

// ===========================
// ERRORS
// ===========================

const errors = reactive({
  name: "",
  email: "",
  phone: "",
  location: "",
});

// ===========================
// FORM
// ===========================

const form = reactive({
  name: "",
  email: "",
  phone: "",
  location: "",
  created_at: "",
  verified: true,
  image: null,
});

const getProfile = async () => {
  try {
    loading.value = true;

    const response = await api.get("/api/me");

    console.log(response.data);

    const user = response.data.data;

    form.name = user.name || "";

    form.email = user.email || "";

    form.phone = user.phone || "";

    form.location = user.location || "";

    form.created_at = user.created_at || "";

    form.verified = user.verified || false;

    imagePreview.value =
      user.avatar ||
      "https://api-loukbontor.g2.ant.com.kh/storage/avatars/no_photo.jpg";
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Get Profile Failed");
  } finally {
    loading.value = false;
  }
};

const handleImage = (event) => {
  const file = event.target.files[0];

  if (file) {
    form.image = file;

    imagePreview.value = URL.createObjectURL(file);
  }
};

// ===========================
// VALIDATE
// ===========================

const validateForm = () => {
  let isValid = true;

  errors.name = "";
  errors.email = "";
  errors.phone = "";
  errors.location = "";

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

  return isValid;
};

// ===========================
// UPDATE PROFILE INFO
// API => /api/profile/info
// ===========================

const updateProfile = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;

    const response = await api.put("/api/profile/info", {
      name: form.name,
      email: form.email,
      phone: form.phone,
      location: form.location,
    });

    console.log(response.data);

    successMessage.value = response.data.message || "Update Success";

    alert(response.data.message || "Profile Updated");
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Update Failed");
  } finally {
    loading.value = false;
  }
};

// ===========================
// UPDATE PROFILE IMAGE
// API => /api/profile/image
// ===========================

const updateProfileImage = async () => {
  if (!form.image) {
    alert("Please select image");

    return;
  }

  try {
    loading.value = true;

    const formData = new FormData();

    formData.append("image", form.image);

    const response = await api.post("/api/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);

    alert(response.data.message || "Image Updated");

    getProfile();
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Upload Failed");
  } finally {
    loading.value = false;
  }
};

// ===========================
// DELETE ACCOUNT
// API => /api/profile/acc
// ===========================

const deleteAccount = async () => {
  const confirmDelete = confirm("តើអ្នកប្រាកដថាចង់លុបគណនីមែនទេ?");

  if (!confirmDelete) {
    return;
  }

  try {
    loading.value = true;

    const response = await api.delete("/api/profile/acc");

    console.log(response.data);

    alert(response.data.message || "Account Deleted");

    // remove token
    localStorage.removeItem("token");

    // redirect login
    window.location.href = "/login";
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Delete Account Failed");
  } finally {
    loading.value = false;
  }
};

// ===========================
// MOUNTED
// ===========================

onMounted(() => {
  getProfile();
});
</script>

<template>
  <Navbar></Navbar>
  <body>
    <div class="container-fluid min-vh-100">
      <div class="row">
        <!-- SIDEBAR -->
        <div class="col-lg-3 sidebar">
          <div class="text-center mb-4">
            <img :src="imagePreview" class="profile-img mb-3" />

            <h4>
              {{ form.name }}
            </h4>

            <p class="text-muted">
              {{ form.email }}
            </p>

            <span
              class="badge"
              :class="form.verified ? 'bg-success' : 'bg-danger'"
            >
              {{ form.verified ? "Verified" : "Not Verified" }}
            </span>
          </div>

          <!-- MENU -->
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
          </div>
        </div>

        <!-- CONTENT -->
        <div class="col-lg-9 p-4">
          <!-- PROFILE -->

          <section v-if="activeSection === 'profile'">
            <div class="card card-ui p-4">
              <!-- =========================
         HEADER SKELETON
    ========================== -->

              <div
                v-if="loading"
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <div class="skeleton skeleton-title"></div>

                <div class="skeleton skeleton-btn"></div>
              </div>

              <!-- =========================
         REAL HEADER
    ========================== -->

              <div
                v-else
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <h4>ប្រវត្តិរូប</h4>

                <button
                  @click="updateProfile"
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  រក្សាទុក
                </button>
              </div>

              <!-- =========================
         SKELETON BODY
    ========================== -->

              <div v-if="loading" class="row">
                <!-- name -->
                <div class="col-md-6 mb-3">
                  <div class="skeleton skeleton-label mb-2"></div>

                  <div class="skeleton skeleton-input"></div>
                </div>

                <!-- email -->
                <div class="col-md-6 mb-3">
                  <div class="skeleton skeleton-label mb-2"></div>

                  <div class="skeleton skeleton-input"></div>
                </div>

                <!-- phone -->
                <div class="col-md-6 mb-3">
                  <div class="skeleton skeleton-label mb-2"></div>

                  <div class="skeleton skeleton-input"></div>
                </div>

                <!-- location -->
                <div class="col-md-6 mb-3">
                  <div class="skeleton skeleton-label mb-2"></div>

                  <div class="skeleton skeleton-input"></div>
                </div>

                <!-- created at -->
                <div class="col-12 mb-3">
                  <div class="skeleton skeleton-label mb-2"></div>

                  <div class="skeleton skeleton-input"></div>
                </div>

                <!-- image -->
                <div class="col-12 mb-3">
                  <div class="skeleton skeleton-label mb-2"></div>

                  <div class="skeleton skeleton-input"></div>
                </div>

                <!-- buttons -->
                <div class="d-flex gap-3 mt-3">
                  <div class="skeleton skeleton-btn"></div>

                  <div class="skeleton skeleton-btn"></div>
                </div>
              </div>

              <!-- =========================
         REAL FORM
    ========================== -->

              <div v-else class="row">
                <!-- name -->
                <div class="col-md-6 mb-3">
                  <label> ឈ្មោះ </label>

                  <input v-model="form.name" type="text" class="form-control" placeholder="បញ្ចូលឈ្មោះ"/>

                  <small class="text-danger">
                    {{ errors.name }}
                  </small>
                </div>

                <!-- email -->
                <div class="col-md-6 mb-3">
                  <label> Email </label>

                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    placeholder="បញ្ចូលអ៊ីមែល"
                  />

                  <small class="text-danger">
                    {{ errors.email }}
                  </small>
                </div>

                <!-- phone -->
                <div class="col-md-6 mb-3">
                  <label> លេខទូរសព្ទ </label>

                  <input
                    v-model="form.phone"
                    type="text"
                    class="form-control"

                    placeholder="បញ្ចូលលេខទូរសព្ទ"
                  />
                </div>

                <!-- location -->
                <div class="col-md-6 mb-3">
                  <label> ទីតាំង </label>

                  <input
                    v-model="form.location"
                    type="text"
                    class="form-control"
                    placeholder="បញ្ចូលទីតាំង"
                  />
                </div>

                <!-- created at -->
                <div class="col-12 mb-3">
                  <label> Account Created </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model="form.created_at"
                    readonly
                  />
                </div>

                <!-- image -->
                <div class="col-12 mb-3">
                  <label> Profile Image </label>

                  <input
                    type="file"
                    class="form-control"
                    accept="image/*"
                    @change="handleImage"
                  />
                </div>

                <!-- buttons -->
                <div
                  class="d-flex justify-content-start gap-3 align-items-center"
                >
                  <button @click="updateProfileImage" class="btn btn-success">
                    Upload Image
                  </button>

                  <button @click="deleteAccount" class="btn btn-danger">
                    លុបគណនី
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- PASSWORD -->
          <section v-if="activeSection === 'password'">
            <ChangePW />
          </section>

          <!-- CART -->
          <section v-if="activeSection === 'cart'">
            <Mycart />
          </section>

          <!-- PURCHASED -->
          <section v-if="activeSection === 'purchased'">
            <Purchased />
          </section>

          <!-- OWN -->
          <section v-if="activeSection === 'own'">
            <Own />
          </section>

          <!-- DEVICES -->
          <section v-if="activeSection === 'devices'">
            <Devices />
          </section>
        </div>
      </div>
    </div>
  </body>
</template>

<style scoped>
body {
  font-family: "Kantumruy Pro", sans-serif;
  background: #f6f9fc;
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
  transition: 0.3s;
  font-weight: 500;
}

.nav-link:hover {
  background: #0d6efd;
  color: white;
}

.card-ui {
  border: none;
  border-radius: 20px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
}

/* =========================
   SKELETON
========================= */

.skeleton {
  position: relative;
  overflow: hidden;
  background: #e9ecef;
  border-radius: 10px;
}

.skeleton::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150px;
  width: 150px;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: shimmer 1.2s infinite;
}

.skeleton-title {
  width: 180px;
  height: 32px;
}

.skeleton-btn {
  width: 140px;
  height: 42px;
  border-radius: 12px;
}

.skeleton-label {
  width: 100px;
  height: 16px;
}

.skeleton-input {
  width: 100%;
  height: 42px;
  border-radius: 10px;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}
</style>
