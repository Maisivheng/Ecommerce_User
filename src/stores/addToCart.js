import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';
import { watch } from 'vue';
import { computed } from 'vue';
import api from "@/API/api"; 

export const useCart = defineStore('cart', () => {
    // ទម្រង់ Form សម្រាប់ផ្ញើទៅ API
    const formData = reactive({
        product_id: '',
        qty: 0
    });

    const loading = ref(false);
    const responseMessage = ref('');
    const responseClass = ref('');
  
    // ២. ទាញយកទិន្នន័យចាស់ពី LocalStorage មកប្រើជាតម្លៃដើម (បើគ្មានទេ ឱ្យស្មើ Array ទទេ [])
    const cartItems = ref(JSON.parse(localStorage.getItem('my_cart')) || []);

    // 2. ប្រើប្រាស់ watch ដើម្បីតាមដានរាល់ពេលមានការផ្លាស់ប្តូរក្នុង cartItems 
    // វានឹងរុញទិន្នន័យថ្មីទៅ localStorage ដោយស្វ័យប្រវត្តិ
    watch(cartItems, (newItems) => {
        localStorage.setItem('my_cart', JSON.stringify(newItems))
    }, { deep: true }) // deep: trueជា Object នៅក្នុង Array

    const purchaseHistory = ref(JSON.parse(localStorage.getItem('purchase_history')) || [])
    watch(purchaseHistory, (newItems) => {
        localStorage.setItem('purchase_history', JSON.stringify(newItems))
    }, { deep: true })

    // 3. Action សម្រាប់កែប្រែចំនួនទំនិញ (បូក/ដក qty)
    function updateQty(id, newQty) {
        if (newQty < 0) return // ការពារមិនឱ្យតូចជាង 0

        const item = cartItems.value.find(i => i.id === id)
        if (item) {
            item.qty = newQty
        }
    }

    // Action សម្រាប់លុបទំនិញមួយចេញពីកន្ត្រក
    function removeItem(id) {
        //ស្វែងរក Index នៃទំនិញដែលត្រូវលុប
        const index = cartItems.value.findIndex(item => item.id === id);
        
        if (index !== -1) {
            // ២. ប្រើ .splice() ដើម្បីលុបចេញពី Array ដោយរក្សា Reactivity ១០០%
            cartItems.value.splice(index, 1);
            
            // ៣. បង្ខំឱ្យវា Save ចូល LocalStorage ភ្លាមៗ (ប្រសិនបើអ្នកមិនបានប្រើ watch)
            localStorage.setItem('my_cart', JSON.stringify(cartItems.value));
        }
    }

    // Action សម្រាប់សម្អាតកន្ត្រកទាំងមូល
    function clearCart() {
        cartItems.value = []
    }

    // Action សម្រាប់ទាញយកទំនិញក្នុងកន្ត្រកពី LocalStorage / state
    function fetchCartItems() {
        cartItems.value = JSON.parse(localStorage.getItem('my_cart')) || cartItems.value || []
        return cartItems.value
    }

    // Action សម្រាប់រក្សាទុកការបញ្ជាទិញរួច
    function addPurchase(order) {
        purchaseHistory.value.unshift(order)
    }

    // Action សម្រាប់សម្អាតប្រវត្តិការទិញ
    function clearPurchaseHistory() {
        purchaseHistory.value = []
    }

    // 6. Getters (Computed) សម្រាប់គណនាចំនួន និងតម្លៃសរុប
    const totalCartItems = computed(() => {
        return cartItems.value.reduce((total, item) => total + item.qty, 0)
    })

    const totalCartPrice = computed(() => {
        return cartItems.value.reduce((total, item) => total + (item.price * item.qty), 0)
    })
    //Function សម្រាប់រុញផលិតផលចូល និងរក្សាទុកក្នុង LocalStorage
    const pushToLocalCart = (product, selectedQty) => {
    // ស្វែងរកមើលថាតើមានទំនិញ ID នេះនៅក្នុងកន្ត្រករួចហើយឬនៅ
    const existingItem = cartItems.value.find(item => item.id === product.id);
    if (existingItem) {
      // បើមានហើយ គឺបូកបន្ថែមចំនួន (Quantity)
      existingItem.qty += selectedQty;
    } else {
      // បើមិនទាន់មាន គឺបង្កើត Object ថ្មីចូលទៅក្នុង Array
        cartItems.value.push({
            id: product.id || product.product_id,
            title: product.title || product.name || 'មិនមានឈ្មោះ', 
            description: product.description || product.desc || 'មិនមានការពិពណ៌នា',
            condition: product.condition || 'ថ្មី',
            price: Number(product.price || product.prod_price || 0), // បំប្លែងជាលេខជានិច្ច
            image: product.image || product.thumbnail || 'https://via.placeholder.com/125',
            qty: selectedQty
        });
    }
    
    // រក្សាទុកបញ្ជីបច្ចុប្បន្នទៅក្នុង LocalStorage របស់ Browser
    localStorage.setItem('my_cart', JSON.stringify(cartItems.value));
  };

    // Function សម្រាប់បាញ់ POST ទៅ Backend និងហៅកូដរក្សាទុកខាងលើ
    const addToCart = async (productDetail) => {
        if (loading.value) return;
        loading.value = true;
        responseMessage.value = '';
        
        try {
            const payload = new FormData();
            payload.append('product_id', formData.product_id);
            payload.append('qty', formData.qty);

            // បាញ់ POST ទៅ Backend API
            const response = await api.post('/api/carts', payload);

            if (response.status == 200 || response.status == 201) {
                // ប្រសិនបើ Backend ឆ្លើយតបមកថាជោគជ័យ យើងចាប់ផ្តើមរក្សាទុកទិន្នន័យក្នុងម៉ាស៊ីនភ្លាម
                pushToLocalCart(productDetail, formData.qty);
                
                // responseMessage.value = 'បានបន្ថែមទំនិញទៅក្នុងកន្ត្រកជោគជ័យ!';
                // responseClass.value = 'success';
                // alert('បានបន្ថែមទំនិញទៅក្នុងកន្ត្រកជោគជ័យ!');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            responseMessage.value = `មានបញ្ហា: ${errorMsg}`;
            responseClass.value = 'error';
            console.error('API Error:', error);
        } finally {
            loading.value = false;
        }
    };

  // Export variables និង functions ទាំងអស់ចេញទៅក្រៅសម្រាប់ឱ្យទំព័រផ្សេងៗហៅប្រើ
  return {
    formData,
    loading,
    responseMessage,
    responseClass,
    cartItems,
    purchaseHistory,
    totalCartItems, 
    totalCartPrice, // សម្រាប់យកទៅ Loop បង្ហាញនៅលើទំព័រ Cart Page
    updateQty, 
    removeItem, 
    clearCart,
    addPurchase,
    clearPurchaseHistory,
    addToCart,
    pushToLocalCart
  };
});