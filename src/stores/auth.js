import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// import axios from 'axios'
import api from '@/API/api'

export const useauthStore = defineStore('auth', () => {
  let token = ref(localStorage.getItem('token') || null)
  let errMassage = ref("")
  let success = ref(null)
  // login
  const login = async (data) =>{
    console.log(data);
    try{
      const res =await api.post('/api/login', data);
      success.value = res.status;

      // console.log(res);
      errMassage.value = res.data.message;
      console.log(errMassage.value);
      if(errMassage.value !== 'Incorrect email or password.'){
        token.value = res.data.data.token;
        localStorage.setItem('token', token.value)
        // alert('Login Success')
        router.push('/');
        return true
      }
      else{
        // alert("Incorrect email or password.")
        return false
      }
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
      // console.log(res);
      token.value = res.data.data.token;
      localStorage.setItem('token', token.value)
    }catch(err){
      console.error(err.response);
    }
  }
  // logout
  const Logout = async () =>{
      const res =await api.delete('/api/logout');
      // console.log(res);
      localStorage.removeItem('token');
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
  

