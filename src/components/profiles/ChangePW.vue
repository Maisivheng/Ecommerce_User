<script setup>
import { ref, reactive } from "vue";
import api from "@/API/api";

// SHOW / HIDE PASSWORD
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// LOADING
const loading = ref(false);

// =======================
// TOAST STATE
// =======================
const toasts = ref([]);
let toastId = 0;

const showToast = (message, type = "success") => {
  const id = toastId++;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3000); // Auto remove after 3 seconds
};

// =======================
// FORM
// =======================
const form = reactive({
  old_pass: "",
  new_pass: "",
  new_pass_confirmation: "",
});

// =======================
// ERRORS
// =======================
const errors = reactive({
  old_pass: "",
  new_pass: "",
  new_pass_confirmation: "",
});

// =======================
// VALIDATE
// =======================
const validateForm = () => {
  let isValid = true;

  // reset errors
  errors.old_pass = "";
  errors.new_pass = "";
  errors.new_pass_confirmation = "";

  // old password
  if (!form.old_pass) {
    errors.old_pass = "Current password is required";
    isValid = false;
  }

  // new password
  if (!form.new_pass) {
    errors.new_pass = "New password is required";
    isValid = false;
  }

  // confirm password
  if (!form.new_pass_confirmation) {
    errors.new_pass_confirmation = "Confirm password is required";
    isValid = false;
  }

  // password not match
  if (
    form.new_pass &&
    form.new_pass_confirmation &&
    form.new_pass !== form.new_pass_confirmation
  ) {
    errors.new_pass_confirmation = "Password does not match";
    isValid = false;
  }

  return isValid;
};

// =======================
// CHANGE PASSWORD
// =======================
const changePassword = async () => {
  // validate
  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;

    const response = await api.put("/api/profile/change-pass", form);

    // Replaced alert with Toast
    showToast(
      response.data.message || "ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ។",
      "success",
    );

    // reset form
    form.old_pass = "";
    form.new_pass = "";
    form.new_pass_confirmation = "";
  } catch (error) {
    console.log(error);

    // api validation
    if (error.response?.data?.data) {
      const apiErrors = error.response.data.data;

      errors.old_pass = apiErrors.old_pass?.[0] || "";
      errors.new_pass = apiErrors.new_pass?.[0] || "";
      errors.new_pass_confirmation = apiErrors.new_pass_confirmation?.[0] || "";
    }

    // Replaced alert with Toast
    showToast(
      error.response?.data?.message ||
        "ផ្លាស់ប្តូរពាក្យសម្ងាត់បានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។",
      "error",
    );
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card card-ui p-4">
          <!-- Loading -->
          <template v-if="loading">
            <div class="skeleton skeleton-title mb-4"></div>

            <!-- Old Password -->
            <div class="mb-3">
              <div class="skeleton skeleton-label mb-2"></div>
              <div class="skeleton skeleton-input"></div>
            </div>

            <!-- New Password -->
            <div class="mb-3">
              <div class="skeleton skeleton-label mb-2"></div>
              <div class="skeleton skeleton-input"></div>
            </div>

            <!-- Confirm Password -->
            <div class="mb-4">
              <div class="skeleton skeleton-label mb-2"></div>
              <div class="skeleton skeleton-input"></div>
            </div>

            <!-- Button -->
            <div class="skeleton skeleton-btn"></div>
          </template>

          <!-- Content -->
          <template v-else>
            <h4 class="mb-4 text-start">ផ្លាស់ប្តូរពាក្យសម្ងាត់</h4>

            <!-- OLD PASSWORD -->
            <div class="mb-3">
              <label class="form-label">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
              <div class="input-group">
                <input
                  v-model="form.old_pass"
                  :type="showOldPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក"
                />
                <span
                  class="input-group-text"
                  style="cursor: pointer"
                  @click="showOldPassword = !showOldPassword"
                >
                  <i
                    :class="showOldPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                  ></i>
                </span>
              </div>
              <small class="text-danger">{{ errors.old_pass }}</small>
            </div>

            <!-- NEW PASSWORD -->
            <div class="mb-3">
              <label class="form-label">ពាក្យសម្ងាត់ថ្មី</label>
              <div class="input-group">
                <input
                  v-model="form.new_pass"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="សូមបញ្ចូលពាក្យសម្ងាត់ថ្មី"
                />
                <span
                  class="input-group-text"
                  style="cursor: pointer"
                  @click="showNewPassword = !showNewPassword"
                >
                  <i
                    :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                  ></i>
                </span>
              </div>
              <small class="text-danger">{{ errors.new_pass }}</small>
            </div>

            <!-- CONFIRM PASSWORD -->
            <div class="mb-4">
              <label class="form-label">បញ្ជាក់ពាក្យសម្ងាត់</label>
              <div class="input-group">
                <input
                  v-model="form.new_pass_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
                />
                <span
                  class="input-group-text"
                  style="cursor: pointer"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <i
                    :class="
                      showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                    "
                  ></i>
                </span>
              </div>
              <small class="text-danger">
                {{ errors.new_pass_confirmation }}
              </small>
            </div>

            <!-- BUTTON -->
            <div class="">
              <button
                @click="changePassword"
                class="btn btn-primary px-3"
                :disabled="loading"
              >
                {{ loading ? "Loading..." : "ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់" }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

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
  </div>
</template>

<style scoped>
.card-ui {
  width: 100%;
  border: none;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.input-group-text {
  background: white;
}

/* =========================
   Skeleton Loading
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
    rgba(255, 255, 255, 0.7),
    transparent
  );
  animation: shimmer 1.2s infinite;
}

.skeleton-title {
  width: 250px;
  height: 32px;
}

.skeleton-label {
  width: 140px;
  height: 16px;
}

.skeleton-input {
  width: 100%;
  height: 44px;
  border-radius: 8px;
}

.skeleton-btn {
  width: 220px;
  height: 42px;
  border-radius: 10px;
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
  background: #198754; /* Bootstrap success color */
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
</style>
