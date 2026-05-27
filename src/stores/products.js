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

    return {
        products,
        fetchProduct,
    };
});