import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)
    function increment(){
        count.value++
    }
    function decrement() {
        if (count.value >= 1) {
            count.value--
        }
    }
    return { count, decrement, increment }
})
