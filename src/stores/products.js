import { computed, ref } from "vue"
import { defineStore } from "pinia"

// useFirestore() -> composable de vuefire para autenticar y conectar nuestra app vue con el servicio Cloud Firestore de Firebase (servicio de base de datos) para poder hacer el CRUD en products (v332)
// useCollection -> composable de vuefire para hacer consultas SELECT a la DB (?) (v333)
// useFirebaseStorage() -> composable de vuefire para conectar mi app vue al servicio de Storage de Firebase (v340)
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire"

// funciones de Firebase para poder ejecutar acciones de CRUD en la DB (v332)
import { collection, addDoc, where, query, limit, orderBy, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore"; 

// funciones del Storage de Firebase para eliminar archivos (v340)
import { ref as storageRef, deleteObject } from "firebase/storage" 

export const useProductsStore = defineStore("products", () => {

    // instancia de la conexion a Cloud Firestore usando el composable de vuefire (v332)
    // con esta linea conecto mi app vue con Cloud Firestore (DB)
    const db = useFirestore() 

    // instancia de la conexion al storage de Firebase usando el composable de vuefire (v340)
    // con esta linea conecto mi app vue con el Storage de Firebase (la conexion se logra gracias a las credenciales que me dio Firebase cuando cree el backend y que tengo almacenadas en .env.local; de alguna manera en esta linea estoy utilizando esas credenciales y conectando esta app vue con el storage de Firebase)
    const storage = useFirebaseStorage()

    const selectedCategory = ref(1)
    const categories = [
        { id: 1, name: "Sudaderas" }, 
        { id: 2, name: "Tenis" },
        { id: 3, name: "Lentes" },
    ]

    const q = query(
        collection(db, "products"),
        // where("category", "==", 3),
        // limit(2),
        orderBy('name', 'desc'),
    )

    // SELECT a la DB (333)
    const productsCollection = useCollection(q) 

    // accion para realizar el INSERT en products 
    async function createProduct(product) {
        await addDoc(collection(db, "products"), product);
    }
    
    // accion para realizar el UPDATE de un producto en products (v338) 
    // docRef -> referencia al ducumento a editar (la obtuvimos en src\views\admin\EditProductView.vue y se la paamos como argumento desde ahí cuando mandamos llamar a esta accion) (v338)
    async function updateProduct(docRef, product) {
        
        // extraigo image y url del objeto recibido como segundo parametro, y el resto del objeto lo guardo en values 
        // image será un array vacio si el usuario no cargo una imagen nueva para reemplazar a la imagen vieja del producto, o un array con un objeto si el usuario si cargó imagen nueva (el objeto será referencia a esa imagen nueva)
        // url es el state de useImage, y su value será la URL de una imagen nueva (si el usuario actualizó la imagen del producto) o será un string vacío si el usuario no actualizó la imagen del producto
        const { image, url, ...values } = product
        
        // en este bloque valido si el usuario cargó o no imagen nueva
        if(image.length){
            // el usuario actualizó la imagen del producto, entonces elimino la imagen anterior de CLoud Storage por un lado, y al objeto con data para el UPDATE le agrego la propiedad image y como value la URL de la nueva imagen para actualizar correctamente el producto en DB

            // bloque para obtener la referencia a la imagen anterior del producto para poder eliminarla de Cloud Storage (servicio de almacenamiento de archivos de firebase) (implementacion LIO al finalizar v340))
            const docSnap = await getDoc(docRef)
            const { image } = docSnap.data()
            const imageRef = storageRef(storage, image);
            // fin bloque

            // con Promise.all me aseguro que ambas acciones se realizen al mismo tiempo ya que son independientes (implementacion LIO al finalizar v340)
            await Promise.all([
                await deleteObject(imageRef), // elimino el archivo anterior del storage de firebase (implementacion LIO al finalizar v340)
                await updateDoc(docRef, {
                    ...values,
                    image: url.value
                }), // UPDATE del registro en la DB (v338)
            ])
        } else {
            // el usuario no cargá imagen nueva, hago el UPDATE omitiendo el campo image (ya que tiene que conservar su valor previo)
            await updateDoc(docRef, values)
        }
    }
    
    // accion para eliminar un producto de la DB y su imagen del Storage de Firebase (v340)
    async function deleteProduct(id) {
        if(confirm("¿Eliminar Producto?")) {
            
            // referencia al documento a eliminar en la DB (v340)
            const docRef = doc(db, "products", id) 
            
            // bloque para obtener la URL de la imagen del producto a eliminar, para eliminar esta imagen del Storage de Firebase (v340)
            // uso la funcion getDoc de Firebase para obtener el snapshot del documento a eliminar (la data del documento)
            // como solo me interesa obtener la URL de la imagen del producto a eliminar, uso desctructuring para obtener solo ese dato en vez de toda la data del producto a eliminar (v340)
            const docSnap = await getDoc(docRef)
            const { image } = docSnap.data()
            // fin bloque 
            
            const imageRef = storageRef(storage, image); // referencia al archivo a eliminar
            
            // con Promise.all me aseguro que ambas acciones se realizen al mismo tiempo ya que son independientes (v340)
            await Promise.all([
                deleteDoc(docRef), // DELETE del registro en la DB
                await deleteObject(imageRef) // elimino el archivo del storage de firebase
            ])
        }
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

    const noResults = computed( () => productsCollection.value.length === 0)

    const filteredProducts = computed( () => {

        // solucion de Valdez para aplicar filtro por categoria y disponibilidad (v369)
        // return productsCollection.value
        //     .filter( product => product.category === selectedCategory.value)
        //     .filter( product => product.availability > 0)

        // solucion LIO ya que es mas performante (v369)
        return productsCollection.value.filter( product => product.category === selectedCategory.value && product.availability > 0)
    })

    return {
        // vars/consts
        categories,

        // states
        productsCollection,
        selectedCategory,

        // getters
        categoryOptions,
        noResults,
        filteredProducts,

        // acciones
        createProduct,
        updateProduct,
        deleteProduct,
    }
})