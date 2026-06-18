import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import api from "@/API/api"; // Make sure this path matches the file above

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

    // GET PROFILE DATA
    const getProfile = async () => {
        try {
            loading.value = true;

            // This request now includes the Authorization header automatically
            const response = await api.get("/api/me");

            // console.log(response.data);

            const user = response.data.data;

            form.name = user.name || "";
            form.email = user.email || "";
            form.phone = user.phone || "";
            form.location = user.location || "";
            form.created_at = user.created_at || "";
            form.verified = user.verified || false;

            imagePreview.value = user.avatar;
        } catch (error) {
            console.log(error);
            // Note: The interceptor in api.js handles the 401 alert/redirect automatically
        } finally {
            loading.value = false;
        }
    };

    // HANDLE IMAGE UPLOAD PREVIEW
    const handleImage = (event) => {
        const file = event.target.files[0];

        if (file) {
            form.image = file;
            imagePreview.value = URL.createObjectURL(file);
        }
    };

    // VALIDATE FORM
    const validateForm = () => {
        let isValid = true;

        errors.name = "";
        errors.email = "";
        errors.phone = "";
        errors.location = "";

        // name validation
        if (!form.name) {
            errors.name = "Name is required";
            isValid = false;
        }

        // email validation
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
            
            // Refresh profile to get new image URL
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
        const confirmDelete = confirm("តើអ្នកប្រាកដថាចង់លុបគណនីមែនទេ?"); // Khmer confirm text

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
        activeSection, // Added this return as it was defined but not returned
        getProfile,
        handleImage,
        validateForm,
        deleteAccount,
        updateProfileImage,
        updateProfile,
    };
});