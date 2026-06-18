import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "@/API/api";

export const useProfileStore = defineStore('profile', () => {
    const profile = ref('');
    const imagePreview = ref("https://api-loukbontor.g2.ant.com.kh/storage/avatars/no_photo.jpg");

    const getProfile = async () => {
        try {
            const response = await api.get("/api/me");
            profile.value = response.data?.data;
            imagePreview.value = (profile.value.avatar || "https://api-loukbontor.g2.ant.com.kh/storage/avatars/no_photo.jpg"); 
            // imagePreview.value =+ "?t=" + new Date().getTime();
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const updateImage = (newUrl) => {
        imagePreview.value = newUrl + "?t=" + new Date().getTime();
    };

    return { profile, imagePreview, getProfile, updateImage };
});