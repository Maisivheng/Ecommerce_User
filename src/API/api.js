import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers:{
        accept: 'application/json',
        "Content-type": "application/json"
    }
})
export default api;