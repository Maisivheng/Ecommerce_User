import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "@/API/api";

export const useProductStore = defineStore('product', () => {

    const products = ref([]);
    async function fetchProduct(params = {}) { 
        // let res = await api.get('/api/products?page=1&per_page=20&search=');
        // products.value = res.data?.data;

        let url = "/api/products";
        if (params.search) {
            url += `?search=${encodeURIComponent(params.search)}`;
        }
        let res = await api.get(url);
        products.value = res.data?.data;
    }

    // async function fetchSearchProduct(params = {}) {
    //     let url = "/api/products/api/products?page=1&per_page=20&search=";
    //     if (params.search) {
    //       url += `${encodeURIComponent(params.search)}`;
    //     }
    //     let res = await api.get(url);
    //     products.value = res.data.data.items;
    // }

    return {
        products,
        fetchProduct,
        // fetchSearchProduct
    };
});