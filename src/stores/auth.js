import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import api from '@/API/api'

export const useauthStore = defineStore('auth', () => {
  let token = ref(localStorage.getItem('token') || null)

  const login = async (data) =>{
    console.log(data);
    try{
      let res =await api.post('/api/login' ,data);
      // console.log(res);
      token.value = res.data.data.token;
      localStorage.setItem('token', token.value)
    }catch(err){
      console.error(err);
    }
    
  }
  return {login, token};
})
