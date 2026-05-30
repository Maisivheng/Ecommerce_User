import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "@/API/api";

export const useProductStore = defineStore('product', () => {

    const products = ref([]);
    async function fetchProduct(params = {}) { 
        let url = "/api/products";
        if (params.search) {
            url += `?search=${encodeURIComponent(params.search)}`;
        }
        let res = await api.get(url);
        products.value = res.data?.data;
    }

    let product = ref([])
    async function fetchCatchID(params) {
        if (!params) {
            console.error("Error: ID របស់ផលិតផលគឺ undefined មិនអាចហៅ API បានទេ!");
            return;
        }
        console.log(params)
        let res = await api.get(`/api/products/${params}`);  
        console.log(ref)      
        product.value = res.data?.data;
    }

    return {
        products,
        product,
        fetchProduct,
        fetchCatchID
    };
});