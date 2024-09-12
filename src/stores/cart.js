import { ref, computed, watchEffect } from "vue"
import { defineStore } from "pinia"
import { useCouponStore } from "@/stores/coupons"
import { getCurrentDate } from "@/helpers"

// funciones de vuefire y de firebase para registrar las ventas en la db (v365)
// runTransaction -> funcion de Firebase para realizar transacciones en la DB (v368)
import { useFirestore } from "vuefire"
import { collection, addDoc, runTransaction, doc } from "firebase/firestore"; 

export const useCartStore = defineStore("cart", () => {

    const coupon = useCouponStore()

    const db = useFirestore() // conexion a Cloud Firestore

    // state
    const items = ref([])
    const subtotal = ref(0)
    const taxes = ref(0)
    const total = ref(0)
    // fin state
    
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

            // INSERT de la compra realizada en sales
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

            // UPDATE en products para restarle a la cantidad de cada producto incluido en la compra realizada, la cantidad de producto comprado para cada articulo (v368)
            items.value.forEach( async(item) => { // itero los productos incluidos en la compra
                const productRef = doc(db, "products", item.id) // referencia al producto iterado en la DB
                await runTransaction(db, async (transaction) => {
                    const currentProduct = await transaction.get(productRef)
                    const availability = currentProduct.data().availability - item.quantity // calculo la nueva cantidad disponible del producto iterado
                    transaction.update(productRef, { availability }) // UPDATEO la cantidad disponible del producto iterado en la DB
                })
            })  

            // reinicio los states de cart y de coupon una vez que la compra se ha registrado en la DB (v366)
            $reset()
            coupon.$reset()

        } catch (error) {
            console.log(error);
        }
    }

    // funcion para resetear el state del store (nombrar a la funcion $reset es una convencion) (v366)
    function $reset() {
        items.value = []
        subtotal.value = 0
        taxes.value = 0
        total.value = 0
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