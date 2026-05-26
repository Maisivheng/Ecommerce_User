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

    alert(response.data.message || "ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ។");

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

    alert(error.response?.data?.message || "ផ្លាស់ប្តូរពាក្យសម្ងាត់បានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។");
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
          <!-- title -->
          <h4 class="mb-4 text-start">ផ្លាស់ប្តូរពាក្យសម្ងាត់</h4>

          <!-- OLD PASSWORD -->
          <div class="mb-3">
            <label class="form-label"> ពាក្យសម្ងាត់បច្ចុប្បន្ន </label>

            <div class="input-group">
              <input
                v-model="form.old_pass"
                :type="showOldPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Enter current password"
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

            <small class="text-danger">
              {{ errors.old_pass }}
            </small>
          </div>

          <!-- NEW PASSWORD -->
          <div class="mb-3">
            <label class="form-label"> ពាក្យសម្ងាត់ថ្មី </label>

            <div class="input-group">
              <input
                v-model="form.new_pass"
                :type="showNewPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Enter new password"
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

            <small class="text-danger">
              {{ errors.new_pass }}
            </small>
          </div>

          <!-- CONFIRM PASSWORD -->
          <div class="mb-4">
            <label class="form-label"> បញ្ជាក់ពាក្យសម្ងាត់ </label>

            <div class="input-group">
              <input
                v-model="form.new_pass_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Confirm password"
              />

              <span
                class="input-group-text"
                style="cursor: pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i
                  :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
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
        </div>
      </div>
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
</style>
