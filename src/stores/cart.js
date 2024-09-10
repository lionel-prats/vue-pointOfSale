import { ref, computed, watchEffect } from "vue"
import { defineStore } from "pinia"
import { useCouponStore } from "@/stores/coupons"
import { getCurrentDate } from "@/helpers"

// funciones de vuefire y de firebase para registrar las ventas en la db (v365)
import { useFirestore } from "vuefire"
import { collection, addDoc } from "firebase/firestore"; 

export const useCartStore = defineStore("cart", () => {

    const coupon = useCouponStore()

    const db = useFirestore() // conexion a Cloud Firestore

    const items = ref([])
    const subtotal = ref(0)
    const taxes = ref(0)
    const total = ref(0)

    const MAX_PRODUCTS = 5
    const TAX_RATE = .10 // impuestos (v353) 

    watchEffect( () => { 
        subtotal.value = items.value.reduce( (total, item) => total + (item.quantity * item.price), 0)
        taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2))
        total.value = Number( ( (subtotal.value + taxes.value) - coupon.discount).toFixed(2) )
    })

    function addItem(item) {
        const index = isItemInCart(item.id)
        if(index >= 0) {
            if(isProductAvaliable(item, index)) {
                alert("Has alcanzado el límite")
                return
            }
            items.value[index].quantity++ 
        } else {
            items.value.push({...item, quantity: 1, id: item.id})
        }
    }

    function updateQuantity(id, quantity) { // v350
        items.value = items.value.map( item => item.id === id ? { ...item, quantity } : item )
    }

    function removeItem(id) {
        items.value = items.value.filter(item => item.id !== id)
    }

    
    async function checkout() {
        try {
            await addDoc(collection(db, "sales"), {
                items: items.value.map( item => {
                    const { availability, category, ...data} = item
                    return data
                }),
                subtotal: subtotal.value,
                taxes: taxes.value,
                discount: coupon.discount,
                total: total.value,
                date: getCurrentDate(),
            });
        } catch (error) {
            console.log(error);
        }
    }

    const isItemInCart = id => items.value.findIndex(item => item.id === id)

    const isProductAvaliable = (item, index) => {
        return items.value[index].quantity >= item.availability || items.value[index].quantity >= MAX_PRODUCTS
    }

    const isEmpty = computed( () => items.value.length === 0) 

    const checkProductAvailability = computed( () => {
        return (product) => product.availability < MAX_PRODUCTS ? product.availability : MAX_PRODUCTS
    }) 

    return {
        // vars/consts

        // states
        items,
        subtotal,
        taxes,
        total,

        // getters
        isEmpty,
        checkProductAvailability,

        // actions
        addItem,
        updateQuantity,
        removeItem,
        checkout,
    }
})