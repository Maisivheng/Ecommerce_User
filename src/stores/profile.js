import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "@/API/api";
import { useauthStore } from './auth';
export const useProfileStore = defineStore('profile',() => {
    const savedAvatar = localStorage.getItem('avatarUrl');
    const savedName = localStorage.getItem('URLName');
    const avatarUrl = ref(savedAvatar);
    const userName = ref(savedName)

    // យក getProfile មកដាក់ក្នុង store នេះ
    async function getProfile() {
        try {
            const response = await api.get("/api/me");
            const user = response.data.data;
            
            // អាប់ដេតទិន្នន័យ
            userName.value = user.name;
            avatarUrl.value = user.avatar;
            
            // រក្សាទុកក្នុង localStorage
            localStorage.setItem('URLName', user.name);
            localStorage.setItem('avatarUrl', user.avatar);
        } catch (error) {
            console.log("Error fetching profile:", error);
        }
    }

    function setAvatar(url) {
        avatarUrl.value = url;
        localStorage.setItem('avatarUrl', url);
    }
    function setName(urlName) {
        userName.value = urlName;
        localStorage.setItem('URLname', urlName);
    }

    return { avatarUrl, savedAvatar, userName, savedName , setAvatar, setName, getProfile};
});