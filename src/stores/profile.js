import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "@/API/api";
import { useauthStore } from './auth';
export const useProfileStore = defineStore('profile',() => {
    const savedAvatar = localStorage.getItem('avatarUrl');
    const avatarUrl = ref(savedAvatar);
    function setAvatar(url) {
        avatarUrl.value = url;
        localStorage.setItem('avatarUrl', url);
    }

    return { avatarUrl, savedAvatar , setAvatar};
});