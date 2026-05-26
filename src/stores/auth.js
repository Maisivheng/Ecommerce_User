import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import api from '@/API/api'
import Logout from '@/views/Logout.vue'

export const useauthStore = defineStore('auth', () => {
  let token = ref(localStorage.getItem('token') || null)
  let success = ref(null)
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
// register
  const register = async (data) =>{
    console.log(data);
    try{
      let res =await api.post('/api/register' ,data);
      success.value = res.status;
      console.log(res);
      token.value = res.data.data.token;
      localStorage.setItem('token', token.value)
    }catch(err){
      console.error(err.response);
    }
    
  }
  // logout
  const Logout = () => {
    token.value = null
    localStorage.removeItem('g7_token')
}

  return {login, Logout, register, token, success};
  })
//   const Logout = async (data) => {
//     try {
//         await api.delete('/api/logout', {
//             headers: {
//                 Accept: 'application/json',
//                 Authorization: Bearer `${token.value}`
//             }
//         })

//         token.value = null
//         localStorage.removeItem('token')

//     } catch (err) {
//         console.error(err.response)
//     }
// }
  

