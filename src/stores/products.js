import { computed } from "vue"
import { defineStore } from "pinia"

// useFirestore() -> composable de vuefire para autenticar y conectar nuestra app vue con el servicio Cloud Firestore de Firebase (servicio de base de datos) para poder hacer el CRUD en products (v332)
import { useFirestore } from "vuefire"

// funciones de Firebase para poder ejecutar acciones de CRUD en la DB (v332)
import { collection, addDoc } from "firebase/firestore"; 

export const useProductsStore = defineStore("products", () => {

    // instancia de la conexion a Cloud Firestore (v332)
    const db = useFirestore() 

    const categories = [
        { id: 1, name: "Sudaderas" }, 
        { id: 2, name: "Tenis" },
        { id: 3, name: "Lentes" },
    ]

    // funcion para realizar el INSERT en products 
    async function createProduct(product) {
        await addDoc(collection(db, "products"), product);
    }

    // este getter retornará el array formateado como indica la documentacion de Formkit, con el que terminamos armando el select de src\views\admin\NewProductView.vue (v330)
    // documentacion -> https://formkit.com/inputs/select
    const categoryOptions = computed( () => {
        // armo el array para armar el <select> de Formkit en src\views\admin\NewProductView.vue con un primer <option> por default que diga "Seleccione" y luego desparrame las opciones de categories usando el spread operator 
        const options = [
            { label: "Seleccione", value: "", attrs: { disabled: true } }, 
            ...categories.map(category => ({ label: category.name, value: category.id }) ) 
        ]
        // const options = categories.map(category => ({ label: category.name, value: category.id }))
        return options
    })

    return {
        // states

        // getters
        categoryOptions,

        // acciones
        createProduct,
    }
})