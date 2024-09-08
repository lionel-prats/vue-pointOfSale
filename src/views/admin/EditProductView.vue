<script setup>
    import { watch, reactive } from 'vue'
    import { useRoute, useRouter  } from 'vue-router'
    import { doc } from 'firebase/firestore'
    import { useFirestore, useDocument } from 'vuefire'
    import Link from '@/components/Link.vue';
    import { useProductsStore } from '@/stores/products';
    import useImage from '@/composables/useImage'

    // Traer la data del producto a editar de Cloud Firestore (la DB) (v337)
    const route = useRoute()
    const router = useRouter()

    const db = useFirestore() // conecto la app Vue con Cloud Firestore (DB)
    const docRef = doc(db, "products", route.params.id) // obtengo la referencia al documento (producto a editar)
    const product = useDocument(docRef) // guardo en una variable el documento a editar (producto)

    const { onFileChange,  url, isImageUploaded } = useImage()
    // console.log(isImageUploaded);
    // console.log(url);
    
    const products = useProductsStore()

    const formData = reactive({
        name: '',
        category: '',
        price: '',
        availability: '',
        image: ''
    })

    // watch para cargar en el state la data de la respuesta de la API (v337)
    watch(product, (product) => {
        // si la respuesta de la API es null (por ej. si en la url se cargó un id de producto que no existe en DB) redirijo al usuario 
        if(!product) {
            router.push({name: 'products'})
        }

        // la respuesta fue exitosa, hay data de producto a editar, entonces cargo en el state la data del documento a editar 
        // el state esta bindeado con los inputs del form asi que los value de los inputs se cargan en automatico cuando se carga la vista y se resuelve la peticion a la DB
        Object.assign( (formData), product)
    })

    // submit del form, que realizará el UPDATE del producto en DB (v338)
    const submitHandler = async data => {
        try {
            // llamo a la funcion del store que va a hacer el UPDATE en DB 
            // le paso como argumentos la referencia al documento en DB y un objeto con la data cargada por el usuario en el form + el ref url de useImage (que si el usuario actualizó la imagen del producto, el value será la URL a esa imagen nueva, pero que si no actualizó la imagen del producto, entonces url.value será un string vacío)
            await products.updateProduct(docRef, {...data, url})
            router.push( { name: 'products' } ) 

        } catch (error) {
            console.log(error);
        } 
    }

</script>

<template>
    <div class="mt-10">
        <Link to="products">Volver</Link>
        <h1 class="text-4xl my-10 font-extrabold">Editar Producto</h1>
        <div class="flex justify-center bg-white shadow">
            <div class="mx-auto mt-10 p-10 w-full  2xl:w-2/4">
                <FormKit
                    type="form"
                    :value="formData"
                    submit-label="Guardar Cambios"
                    incomplete-message="La información de uno o más campos es incorrecta. Por favor, revisa el formulario."
                    @submit="submitHandler"
                    :actions="false"
                >
                    <FormKit 
                        type="text"
                        label="Nombre"
                        name="name"
                        placeholder="Nombre de Producto"
                        validation="required"
                        :validation-messages="{ required: 'El Nombre del Producto es Obligatorio' }"
                        v-model.trim="formData.name"
                    />

                    <FormKit 
                        type="select"
                        label="Categoría"
                        name="category"
                        validation="required"
                        :validation-messages="{ required: 'La Categoría es Obligatoria' }"
                        :options="products.categoryOptions"
                        v-model.number="formData.category"
                    />

                    <FormKit
                        type="number"
                        label="Precio"
                        name="price"
                        placeholder="Precio de Producto"

                        step="1"
                        min="1"
                        v-model.number="formData.price"
                    />

                    <FormKit
                        type="number"
                        label="Disponibles"
                        name="availability"
                        placeholder="Productos Disponibles"

                        step="1"
                        min="0"
                        v-model.number="formData.availability"
                    />

                    <div v-if="isImageUploaded">
                        <p class="font-black">Imagen Nueva:</p>
                        <img    
                          :src="url"
                          alt="Nueva imagen Producto" 
                          class="w-52"
                        />  
                    </div>

                    <div v-else>
                        <p class="font-black">Imagen Actual:</p>
                        <img  
                          :src="formData.image"
                          :alt="'Imagen de' + formData.image" 
                          class="w-52"
                        />  
                    </div>
                    
                    <FormKit
                        type="file"
                        label="Cambiar Imagen"
                        name="image"
                        multiple="false"
                        accept=".jpg"
                        @change="onFileChange"
                    />

                    <FormKit type="submit">Guardar Cambios</FormKit>

                </FormKit>
            </div>
        </div>
    </div>
</template>