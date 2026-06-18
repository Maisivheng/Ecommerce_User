<script setup>
import { ref, onMounted } from "vue";
import api from "@/API/api";

// =========================
// STATES
// =========================

const devices = ref([]);
const loading = ref(false);

// =========================
// GET DEVICES
// API => /api/profile/devices
// =========================

const getDevices = async () => {
  try {
    loading.value = true;

    const response = await api.get("/api/profile/devices");

    // =========================
    // REMOVE DUPLICATE DEVICES (Optimized with reduce)
    // =========================

    const uniqueDevices = response.data.data.reduce(
      (acc, device) => {
        // បង្កើត Unique Key ដោយភ្ជាប់ឈ្មោះ, browser និង ip ចូលគ្នា
        const key = `${device.device_name}-${device.browser}-${device.ip_address}`;

        if (!acc.found[key]) {
          acc.found[key] = true;
          acc.result.push(device);
        }

        return acc;
      },
      { found: {}, result: [] },
    ).result;

    devices.value = uniqueDevices;
  } catch (error) {
    console.error("Error fetching devices:", error);
    alert(error.response?.data?.message || "Get Devices Failed");
  } finally {
    loading.value = false;
  }
};

// =========================
// REMOVE DEVICE
// =========================
const removeDevice = async (id) => {
  const confirmRemove = confirm("តើអ្នកប្រាកដថាចង់លុបឧបករណ៍នេះមែនទេ?");

  if (!confirmRemove) {
    return;
  }

  try {
    const response = await api.delete(`/api/profile/device/remove/${id}`);

    // Update UI ដោយការលុបឧបករណ៍ដែលមាន ID ត្រូវគ្នា ដោយមិនចាំបាច់ហៅ API មកវិញ
    devices.value = devices.value.filter((device) => device.id !== id);

    alert(response.data.message || "Remove Success");
  } catch (error) {
    console.error("Error removing device:", error.response || error);
    alert(error.response?.data?.message || error.message || "Remove Failed");
  }
};

// =========================
// DEVICE ICON
// =========================

const getDeviceIcon = (deviceName) => {
  const name = deviceName?.toLowerCase() || "";

  if (
    name.includes("iphone") ||
    name.includes("android") ||
    name.includes("mobile")
  ) {
    return "bi-phone";
  }

  if (
    name.includes("mac") ||
    name.includes("windows") ||
    name.includes("laptop")
  ) {
    return "bi-laptop";
  }

  return "bi-pc-display";
};

// =========================
// MOUNTED
// =========================

onMounted(() => {
  getDevices();
});
</script>

<template>
  <div class="card card-ui p-4">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4>ឧបករណ៍ដែលបានតភ្ជាប់</h4>

      <span class="badge bg-primary"> {{ devices.length }} Devices </span>
    </div>

    <!-- LOADING -->
    <div v-if="loading">
      <div v-for="n in 4" :key="n" class="device-skeleton mb-3">
        <div class="skeleton skeleton-icon"></div>

        <div class="flex-grow-1">
          <div class="skeleton skeleton-title mb-2"></div>

          <div class="skeleton skeleton-text"></div>
        </div>

        <div class="skeleton skeleton-btn"></div>
      </div>
    </div>

    <!-- EMPTY -->
    <div v-else-if="devices.length === 0" class="text-center py-5">
      <i class="bi bi-phone empty-icon"></i>

      <h5 class="mt-3">មិនមានឧបករណ៍ទេ</h5>

      <p class="text-muted">មិនទាន់មានឧបករណ៍បានភ្ជាប់</p>
    </div>

    <!-- DEVICES -->
    <div v-else class="list-group">
      <div
        v-for="device in devices"
        :key="device.id"
        class="list-group-item device-item d-flex justify-content-between align-items-center"
      >
        <!-- LEFT -->
        <div class="d-flex align-items-center gap-3">
          <!-- ICON -->
          <div class="device-icon">
            <i :class="`bi ${getDeviceIcon(device.device_name)}`"></i>
          </div>

          <!-- INFO -->
          <div>
            <h6 class="mb-1 fw-bold">
              {{ device.device_name || "Unknown Device" }}
            </h6>

            <small class="text-muted">
              {{ device.browser || "Unknown Browser" }}
            </small>

            <br />

            <small class="text-secondary">
              {{ device.ip_address }}
            </small>
          </div>
        </div>

        <!-- BUTTON -->
        <button
          @click="removeDevice(device.id)"
          class="btn btn-outline-danger btn-sm"
        >
          Remove
        </button>
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

/* =========================
   DEVICE ITEM
========================= */

.device-item {
  border: none;
  border-radius: 15px;
  margin-bottom: 12px;
  padding: 18px;
  transition: 0.3s;
}

.device-item:hover {
  background: #f8f9fa;
}

.device-icon {
  width: 55px;
  height: 55px;
  border-radius: 15px;
  background: #0d6efd;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.empty-icon {
  font-size: 80px;
  color: #adb5bd;
}

/* =========================
   SKELETON
========================= */

.device-skeleton {
  display: flex;
  align-items: center;
  gap: 15px;
}

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

.skeleton-icon {
  width: 55px;
  height: 55px;
  border-radius: 15px;
}

.skeleton-title {
  width: 180px;
  height: 18px;
}

.skeleton-text {
  width: 120px;
  height: 14px;
}

.skeleton-btn {
  width: 90px;
  height: 35px;
  border-radius: 10px;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}
</style>
