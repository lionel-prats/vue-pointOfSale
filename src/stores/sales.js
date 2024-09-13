import { ref, computed } from "vue"
import { defineStore } from "pinia"

// imports para hacer peticicones a Cloud Firestore (v373)
import { useFirestore, useCollection } from "vuefire"
import { query, collection, where } from "firebase/firestore"; 
// fin imports (v373)

export const useSalesStore = defineStore("sales", () => {

    // states
    const date = ref("")
    // fin states
    
    const db = useFirestore() // conexion a CloudFirestore (v373)

    // SELECT a la tabla sales en la DB cada vez que el usuario seleccione una nueva fecha en el calendario (373)
    const salesSource = computed( () => {
        if(date.value) {
            const q = query(
                collection(db, "sales"),
                where("date", "==", date.value),
            )
            return q
        }
    })
    const salesCollection = useCollection(salesSource)
    // fin SELECT

    const isDateSelected = computed( () => date.value)

    const noSales = computed( () => !salesCollection.length && date.value)

    const totalSalesOfDay = computed( () => {
        return salesCollection.value ?
            salesCollection.value.reduce( (total, sale) => total + sale.total, 0) : 0
    })

    return {
        // vars/consts

        // states
        date,
        salesCollection,
        
        // getters
        isDateSelected,
        noSales,
        totalSalesOfDay,

        // actions
    }
})