import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/API/api'

export const useauthStore = defineStore('auth', () => {
  let token = ref(localStorage.getItem('token') || null)
  let errMassage = ref("")
  let success = ref(null)
  // login
  const login = async (data) => {
    try {
      const res = await api.post('/api/login', data);
      success.value = res.status;
      const tokenValue = res?.data?.data?.token;
      if (res.status === 200 && tokenValue) {
        token.value = tokenValue;
        localStorage.setItem('token', token.value);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  }

  const register = async (data) => {
    try {
      const res = await api.post('/api/register', data);
      success.value = res.status;
      const tokenValue = res?.data?.data?.token;
      if ((res.status === 200 || res.status === 201) && tokenValue) {
        token.value = tokenValue;
        localStorage.setItem('token', token.value);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Register error:', err);
      return false;
    }
  }
  // logout
  const Logout = async () =>{
      try {
        if(token.value){
          await api.delete('/api/logout');
        }
      } catch (error) {
        console.error("Logout API failed, but clearing local state:", error);
      } finally {
        token.value = null;
        localStorage.removeItem('token');
      }
  }
  return {login, Logout, register, token, success};
  });
  

