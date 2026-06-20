import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from "@/API/api";

export const useProductStore = defineStore('product', () => {

    const products = ref([]);
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const categories = ref([]); // បង្កើត state ដើម្បីរក្សាទុក category

    async function fetchCategories() {
        let res = await api.get('/api/categories'); // ហៅ API ទៅកាន់ backend
        categories.value = res.data?.data;
    }
 
    async function fetchProduct(params = {}) {
        const query = params.search !== undefined ? params.search : searchQuery.value;
        let url = "/api/products";
        if (params.search) {
            url += `?search=${encodeURIComponent(query)}`;
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
        // console.log(params)
        let res = await api.get(`/api/products/${params}`);  
        // console.log(ref)      
        product.value = res.data?.data;
    }


    return {
        products,
        product,
        searchQuery,
        selectedCategory,
        categories,
        fetchProduct,
        fetchCatchID,
        fetchCategories,
    };
});