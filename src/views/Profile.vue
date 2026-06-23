<script setup>
import Navbar from "@/components/layout/Navbar.vue";
import Mycart from "@/components/profiles/Mycart.vue";
import Purchased from "@/components/profiles/Purchased.vue";
import Own from "@/components/profiles/Own.vue";
import Devices from "@/components/profiles/Devices.vue";
import ChangePW from "@/components/profiles/ChangePW.vue";

import { ref, reactive, onMounted } from "vue";
import api from "@/API/api";
import Footer from "@/components/layout/Footer.vue";

///get image and user name to profile.js
import { useProfileStore } from "@/stores/profile";
const profileStore = useProfileStore();

const activeSection = ref("profile");
const loading = ref(false);
const imagePreview = ref("");
const successMessage = ref("");
const errors = reactive({
  name: "",
  email: "",
  phone: "",
  location: "",
});
const form = reactive({
  name: "",
  email: "",
  phone: "",
  location: "",
  created_at: "",
  verified: false,
  image: null,
});

// ===========================
// TOAST STATE
// ===========================
const toasts = ref([]);
let toastId = 0;

const showToast = (message, type = "success") => {
  const id = toastId++;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3000); // Auto remove after 3 seconds
};

// ===========================
// MODAL STATE
// ===========================
const confirmModal = reactive({
  show: false,
  title: "",
  message: "",
  onConfirm: null,
});

const showConfirmModal = ({ title, message, onConfirm }) => {
  confirmModal.title = title;
  confirmModal.message = message;
  confirmModal.onConfirm = onConfirm;
  confirmModal.show = true;
};

const closeModal = () => {
  confirmModal.show = false;
  confirmModal.onConfirm = null;
};

const executeConfirm = () => {
  if (confirmModal.onConfirm) {
    confirmModal.onConfirm();
  }
  closeModal();
};
// ===========================

const getProfile = async () => {
  try {
    loading.value = true;
    const response = await api.get("/api/me");
    const user = response.data.data;
    form.name = user.name || "";
    form.email = user.email || "";
    form.phone = user.phone || "";
    form.location = user.location || "";
    form.created_at = user.created_at
      ? new Date(user.created_at).toLocaleString()
      : "";
    form.verified = user.verified || false;

    imagePreview.value =
      user.avatar ||
      "https://api-loukbontor.g2.ant.com.kh/storage/avatars/no_photo.jpg";

  } catch (error) {
    console.log(error);
    showToast(error.response?.data?.message || "Get Profile Failed", "error");
  } finally {
    loading.value = false;
  }
};

const handleImage = async (event) => {
  const file = event.target.files[0];

  if (file) {
    form.image = file;
    imagePreview.value = URL.createObjectURL(file);
    await updateProfileImage();
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

  if (!form.name) {
    errors.name = "Name is required";
    isValid = false;
  }

  if (!form.email) {
    errors.email = "Email is required";
    isValid = false;
  }

  return isValid;
};

// ===========================
// UPDATE PROFILE INFO
// ===========================
const isEditing = ref(false);
const updateProfile = async () => {
  if (!isEditing.value) {
    isEditing.value = true;
    return;
  }

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

    successMessage.value = response.data.message || "Update Success";
    showToast(response.data.message || "Profile Updated", "success");
    profileStore.setName(response.data?.data.name);
    isEditing.value = false;
  } catch (error) {
    console.log(error);
    showToast(error.response?.data?.message || "Update Failed", "error");
  } finally {
    loading.value = false;
  }
};

const updateProfileImage = async () => {
  if (!form.image) {
    showToast("Please select image", "error");
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

    // ប្រើប្រាស់ពេលវេលាដែលច្បាស់លាស់ដើម្បីបំបែក Cache
    const freshTimestamp = new Date().getTime();
    imagePreview.value = response.data?.data.avatar + "?t=" + freshTimestamp;
    showToast(response.data.message || "Image Updated", "success");

    profileStore.setAvatar(imagePreview.value); // Update ទៅ store

    getProfile();
  } catch (error) {
    console.log(error);
    showToast(error.response?.data?.message || "Upload Failed", "error");
  } finally {
    loading.value = false;
  }
  
};

// ===========================
// DELETE ACCOUNT & IMAGE (USING MODAL)
// ===========================

const deleteAccount = () => {
  showConfirmModal({
    title: "លុបគណនី",
    message: "តើអ្នកប្រាកដថាចង់លុបគណនីមែនទេ?",
    onConfirm: async () => {
      try {
        loading.value = true;
        const response = await api.delete("/api/profile/acc");

        showToast(response.data.message || "Account Deleted", "success");

        localStorage.removeItem("token");
        window.location.href = "/login";
      } catch (error) {
        console.log(error);
        showToast(
          error.response?.data?.message || "Delete Account Failed",
          "error",
        );
      } finally {
        loading.value = false;
      }
    },
  });
};

const deleteProfileImage = () => {
  showConfirmModal({
    title: "លុបរូប Profile",
    message: "តើអ្នកចង់លុបរូប Profile មែនទេ?",
    onConfirm: async () => {
      try {
        loading.value = true;
        const response = await api.delete("/api/profile/image");

        showToast(response.data.message || "Image Deleted", "success");

        imagePreview.value =
          "https://api-loukbontor.g2.ant.com.kh/storage/avatars/no_photo.jpg";

        profileStore.setAvatar(imagePreview.value); // Update ទៅ store
        getProfile();
      } catch (error) {
        console.log(error);
        showToast(
          error.response?.data?.message || "Delete Image Failed",
          "error",
        );
      } finally {
        loading.value = false;
      }
    },
  });
};

onMounted(() => {
  getProfile();
});
</script>

<template>
  <Navbar></Navbar>
  <body>
    <div class="container min-vh-100">
      <div class="row">
        <!-- SIDEBAR -->
        <div class="col-lg-3 sidebar">
          <div class="profile-card">
            <img :src="imagePreview" class="profile-img" />

            <h5 class="mt-3 mb-1">
              {{ form.name }}
            </h5>

            <small class="text-muted">
              {{ form.email }}
            </small>

            <div class="mt-2">
              <span
                class="badge"
                :class="form.verified ? 'bg-success' : 'bg-danger'"
              >
                {{ form.verified ? "Verified" : "Unverified" }}
              </span>
            </div>
          </div>

          <!-- MENU -->
          <div class="nav flex-column">
            <a
              href="#"
              class="nav-link"
              :class="{ active: activeSection === 'profile' }"
              @click.prevent="activeSection = 'profile'"
            >
              <i class="bi bi-person"></i>
              ប្រវត្តិរូប
            </a>

            <a
              href="#"
              class="nav-link"
              :class="{ active: activeSection === 'password' }"
              @click.prevent="activeSection = 'password'"
            >
              <i class="bi bi-lock"></i>
              ផ្លាស់ប្តូរពាក្យសម្ងាត់
            </a>

            <a
              href="#"
              class="nav-link"
              :class="{ active: activeSection === 'cart' }"
              @click.prevent="activeSection = 'cart'"
            >
              <i class="bi bi-cart"></i>
              របស់ខ្ញុំ
            </a>

            <a
              href="#"
              class="nav-link"
              :class="{ active: activeSection === 'purchased' }"
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
              :class="{ active: activeSection === 'devices' }"
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
              <!-- Header -->
              <div
                v-if="!loading"
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <div>
                  <h4 class="mb-1">ប្រវត្តិរូប</h4>
                  <small class="text-muted">
                    គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក
                  </small>
                </div>

                <button
                  @click="updateProfile"
                  class="btn btn-primary px-4"
                  :disabled="loading"
                >
                  <i
                    :class="isEditing ? 'bi bi-check-lg' : 'bi bi-pencil'"
                    class="me-2"
                  ></i>

                  {{
                    loading
                      ? "កំពុងដំណើរការ..."
                      : isEditing
                        ? "រក្សាទុកការផ្លាស់ប្តូរ"
                        : "កែប្រែ"
                  }}
                </button>
              </div>

              <!-- Loading Skeleton -->
              <div v-if="loading" class="row">
                <div class="profile-header">
                  <div class="skeleton skeleton-avatar"></div>
                  <div class="flex-grow-1">
                    <div class="skeleton skeleton-name mb-2"></div>
                    <div class="skeleton skeleton-text mb-3"></div>
                    <div class="d-flex gap-2">
                      <div class="skeleton skeleton-btn"></div>
                      <div class="skeleton skeleton-btn"></div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="skeleton skeleton-label mb-2"></div>
                  <div class="skeleton skeleton-input"></div>
                </div>

                <div class="col-md-6 mb-3">
                  <div class="skeleton skeleton-label mb-2"></div>
                  <div class="skeleton skeleton-input"></div>
                </div>

                <div class="col-md-6 mb-3">
                  <div class="skeleton skeleton-label mb-2"></div>
                  <div class="skeleton skeleton-input"></div>
                </div>

                <div class="col-md-6 mb-3">
                  <div class="skeleton skeleton-label mb-2"></div>
                  <div class="skeleton skeleton-input"></div>
                </div>
              </div>

              <!-- Form -->
              <div v-else class="row">
                <!-- Name & Image -->
                <div class="profile-header">
                  <div class="profile-upload-wrapper">
                    <img :src="imagePreview" class="profile-upload-img" />
                    <label for="profileInput" class="profile-upload-overlay">
                      <i class="bi bi-camera-fill"></i>
                    </label>
                    <input
                      id="profileInput"
                      type="file"
                      accept="image/*"
                      class="d-none"
                      @change="handleImage"
                    />
                  </div>

                  <div>
                    <h5 class="mb-1">{{ form.name }}</h5>
                    <small class="text-muted"> PNG & JPG up to 2MB </small>
                    <div class="mt-3">
                      <label
                        for="profileInput"
                        class="btn btn-outline-primary btn-sm"
                      >
                        <i class="bi bi-upload me-1"></i>
                        Upload
                      </label>
                      <button
                        @click="deleteProfileImage"
                        class="btn btn-outline-danger ms-2 btn-sm"
                      >
                        <i class="bi bi-trash me-1"></i>
                        លុប
                      </button>
                    </div>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">ឈ្មោះ</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="បញ្ចូលឈ្មោះ"
                    :readonly="!isEditing"
                  />
                  <small class="text-danger">{{ errors.name }}</small>
                </div>

                <!-- Email -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">អ៊ីមែល</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    placeholder="បញ្ចូលអ៊ីមែល"
                    :readonly="!isEditing"
                  />
                  <small class="text-danger">{{ errors.email }}</small>
                </div>

                <!-- Phone -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">លេខទូរសព្ទ</label>
                  <input
                    v-model="form.phone"
                    type="text"
                    class="form-control"
                    placeholder="បញ្ចូលលេខទូរសព្ទ"
                    :readonly="!isEditing"
                  />
                </div>

                <!-- Location -->
                <div class="col-md-6 mb-3">
                  <label class="form-label">ទីតាំង</label>
                  <input
                    v-model="form.location"
                    type="text"
                    class="form-control"
                    placeholder="បញ្ចូលទីតាំង"
                    :readonly="!isEditing"
                  />
                </div>

                <!-- Created At -->
                <div class="col-12 mb-3">
                  <label class="form-label">ថ្ងៃបង្កើតគណនី</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="form.created_at"
                    readonly
                  />
                </div>

                <!-- Actions -->
                <div class="d-flex gap-3 align-items-center mt-2">
                  <button @click="deleteAccount" class="btn btn-danger">
                    <i class="bi bi-trash me-2"></i>
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
    <Footer></Footer>

    <!-- =========================== -->
    <!-- CUSTOM TOAST COMPONENT -->
    <!-- =========================== -->
    <div class="toast-container">
      <transition-group name="toast-fade">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="custom-toast"
          :class="toast.type === 'error' ? 'toast-error' : 'toast-success'"
        >
          <i
            :class="
              toast.type === 'error' ? 'bi bi-x-circle' : 'bi bi-check-circle'
            "
            class="me-2"
          ></i>
          {{ toast.message }}
        </div>
      </transition-group>
    </div>

    <!-- =========================== -->
    <!-- CUSTOM MODAL COMPONENT -->
    <!-- =========================== -->
    <transition name="modal-fade">
      <div v-if="confirmModal.show" class="modal-overlay">
        <div class="modal-box">
          <h5 class="mb-3">{{ confirmModal.title }}</h5>
          <p class="text-muted mb-4">{{ confirmModal.message }}</p>
          <div class="d-flex justify-content-end gap-2">
            <button @click="closeModal" class="btn btn-secondary">
              បោះបង់
            </button>
            <button @click="executeConfirm" class="btn btn-danger">លុប</button>
          </div>
        </div>
      </div>
    </transition>
  </body>
</template>

<style scoped>
body {
  font-family: "Kantumruy Pro", sans-serif;
  background: #f6f9fc;
}

.form-control {
  background: #f8f9fa;
  cursor: not-allowed;
}

.form-control[readonly] {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  cursor: default;
}
.form-label {
  font-weight: 600;
  margin-bottom: 8px;
}
.sidebar {
  min-height: 100vh;
  background: white;
  border-right: 1px solid #eee;
  padding: 25px;
}

.profile-image-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  cursor: pointer;
}

.profile-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 28px;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.profile-image-wrapper:hover .profile-overlay {
  opacity: 1;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.profile-upload-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
}

.profile-upload-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0d6efd;
}

.profile-upload-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 22px;
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;
}

.profile-upload-wrapper:hover .profile-upload-overlay {
  opacity: 1;
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0d6efd;
}
.nav-link {
  color: #212529;
  padding: 14px 18px;
  border-radius: 12px;
  margin-bottom: 10px;
  transition: 0.3s;
  font-weight: 500;
}

.nav-link:hover {
  background: #0d6efd;
  color: white !important;
}

.nav-link.active {
  background: #0d6efd;
  color: white !important;
}

.nav-link:hover *,
.nav-link.active * {
  color: white !important;
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
.skeleton-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-name {
  width: 180px;
  height: 24px;
  border-radius: 8px;
}

.skeleton-text {
  width: 140px;
  height: 16px;
  border-radius: 6px;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}

/* =========================
   CUSTOM TOAST STYLES
========================= */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.custom-toast {
  padding: 14px 24px;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  min-width: 280px;
}

.toast-success {
  /* background: #198754; Bootstrap success color */
  background: #22c55e;
  
}

.toast-error {
  background: #dc3545; /* Bootstrap danger color */
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

/* =========================
   CUSTOM MODAL STYLES
========================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-box {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-box,
.modal-fade-leave-to .modal-box {
  transform: scale(0.9);
}
</style>
