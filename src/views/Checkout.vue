<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/API/api";

const router = useRouter();

// loading
const loading = ref(false);

// form
const form = reactive({
  name: "",
  phone: "",
  address: "",
});

// validation errors
const errors = reactive({
  name: "",
  phone: "",
  address: "",
});

// validate
const validateForm = () => {

  let isValid = true;

  // reset errors
  errors.name = "";
  errors.phone = "";
  errors.address = "";

  // name
  if (!form.name) {

    errors.name = "Name is required";

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

// confirm payment
const confirmPayment = async () => {

  // validate first
  if (!validateForm()) {
    return;
  }

  try {

    loading.value = true;

    // API checkout
    const response = await api.post(
      "/api/cart/checkout",
      {
        name: form.name,
        phone: form.phone,
        address: form.address,
      }
    );

    console.log(response.data);

    alert(response.data.message);

    // go success page
    router.push("/success");

  } catch (error) {

    console.log(error);

    console.log(error.response);

    alert(
      error.response?.data?.message ||
      "Payment Failed"
    );

  } finally {

    loading.value = false;
  }
};
</script>

<template>

  <div class="container d-flex justify-content-center mt-5">

    <div class="col-md-6 card p-4 shadow-sm">

      <h3 class="mb-4 text-center">
        ទូទាត់ប្រាក់
      </h3>

      <!-- name -->
      <div class="mb-3">

        <label class="form-label">
          Name
        </label>

        <input
          type="text"
          class="form-control"
          placeholder="Enter your name"
          v-model="form.name"
        />

        <small class="text-danger">
          {{ errors.name }}
        </small>

      </div>

      <!-- phone -->
      <div class="mb-3">

        <label class="form-label">
          Phone
        </label>

        <input
          type="text"
          class="form-control"
          placeholder="Enter your phone"
          v-model="form.phone"
        />

        <small class="text-danger">
          {{ errors.phone }}
        </small>

      </div>

      <!-- address -->
      <div class="mb-3">

        <label class="form-label">
          Address
        </label>

        <textarea
          rows="4"
          class="form-control"
          placeholder="Enter your address"
          v-model="form.address"
        ></textarea>

        <small class="text-danger">
          {{ errors.address }}
        </small>

      </div>

      <!-- button -->
      <button
        @click="confirmPayment"
        class="btn btn-success w-100"
        :disabled="loading"
      >

        {{
          loading
          ? "Processing..."
          : "Confirm Payment"
        }}

      </button>

    </div>

  </div>

</template>

<style scoped>
.card{
  border-radius: 15px;
}
</style>