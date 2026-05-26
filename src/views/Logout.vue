<script setup>
import { useauthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useauthStore()
const router = useRouter()

const handleLogout = () => {
    auth.Logout()
    alert('are you sur to log out ?')
    router.push('/login')
}
</script>

<template>
    <h1>Logout Page</h1>
    <button @click="handleLogout">
        Logout
    </button>
</template>