import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import api from "@/API/api";

export const useProfileStore = defineStore('profile', () => {
    // ACTIVE SECTION
    const activeSection = ref("profile");

    // LOADING
    const loading = ref(false);

    // IMAGE PREVIEW
    const imagePreview = ref("");

    // SUCCESS MESSAGE
    const successMessage = ref("");

    // ERRORS
    const errors = reactive({
        name: "",
        email: "",
        phone: "",
        location: "",
    });

    // FORM
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

    // VALIDATE
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


    return {
        loading,
        imagePreview,
        successMessage,
        form,
        getProfile,
        handleImage,
        validateForm,
        deleteAccount,
        updateProfileImage,
        updateProfile,
    };
});