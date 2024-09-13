import { defineStore } from "pinia"
import { ref, watch, computed } from "vue"
import { useCartStore } from "./cart"

export const useCouponStore = defineStore("coupon", () => {

    const cart = useCartStore()

    // state
    const couponInput = ref("")
    const couponValidationMessage = ref("")
    const discountPercentage = ref(0)
    const discount = ref(0)
    // fin state

    const VALID_COUPONS = [
        { name: "10DESCUENTO", discount: .10 },
        { name: "20DESCUENTO", discount: .20 },
    ]

    watch(discountPercentage, () => {
        discount.value = (cart.total * discountPercentage.value).toFixed(2)
    })

    function applyCoupon() {
        if(VALID_COUPONS.some(coupon => coupon.name === couponInput.value)) {
            couponValidationMessage.value = "Aplicando..." 
            setTimeout(() => {
                discountPercentage.value = VALID_COUPONS.find(coupon => coupon.name === couponInput.value).discount
                couponValidationMessage.value = "¡Descuento aplicado!" 
            }, 2000);
        } else {
            couponValidationMessage.value = "No existe es cupón" 
        }
        setTimeout(() => {
            couponValidationMessage.value = "" 
        }, 4000);
    }

    // funcion para resetear el state del store (nombrar a la funcion $reset es una convencion) (v366)
    function $reset() {
        couponInput.value = ""
        couponValidationMessage.value = ""
        discountPercentage.value = 0
        discount.value = 0
    }

    const isValidCoupon = computed ( () => discountPercentage.value > 0 ) 

    return {
        // vars/consts

        // states
        couponInput,
        couponValidationMessage,
        discount,
        
        // getters
        isValidCoupon,
        
        // actions
        applyCoupon,
        $reset,
    }
})