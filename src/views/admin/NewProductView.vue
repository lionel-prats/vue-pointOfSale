<script setup>
    import { reactive } from "vue"
    import { useRouter } from "vue-router"
    import Link from "@/components/Link.vue"
    import useImage from "@/composables/useImage"
    import { useProductsStore } from "@/stores/products" // store de Pinia (v329)

    const { url, isImageUploaded, onFileChange } = useImage()
    const products = useProductsStore() // store de Pinia (v329)
    const router = useRouter()

    const formData = reactive({
        name: "",
        category: "",
        price: "",
        availability: "",
        image: "",
    })

    const submitHandler = async data => {

        // armo el objeto values con la data para el INSERT en DB del producto a crear, incluyendo en el campo image la URL de la imagen ya subida al storage de Firebase (v331)
        const { image, ...values } = data
        values.image = url.value

        // ejecuto la accion createProduct del store de Pinia products, pasandole el objeto values con la data, ya que esta accion realizará la peticion para el INSERT en DB (v331)
        try {
            await products.createProduct(values)
            router.push({name: 'products'}) // luego del INSERT redirijo al usuario
        } catch (error) {
            console.log(error);
        }
    }

</script>

<template>
    <div class="mt-10">
        <Link to="products">Volver</Link>
        <h1 class="text-4xl font-black my-10">Nuevo Producto</h1>
        <div class="flex justify-center bg-white shadow">
            <div class="mt-10 p-10 w-full 2xl:w-2/4">
                <FormKit
                    type="form"
                    submit-label="Agregar Producto"
                    incomplete-message="La información de uno o más campos es incorrecta. Por favor, revisa el formulario."
                    :value="formData"
                    @submit="submitHandler"
                >

                    <FormKit 
                        type="text"
                        label="Nombre"
                        name="name"
                        placeholder="Nombre de Producto"
                        validation="required"
                        :validation-messages="{ required: 'El nombre del Producto es Obligatorio'}" 
                        v-model.trim="formData.name"
                    />
                    
                    <FormKit 
                        type="file"
                        label="Imagen Producto"
                        name="image"
                        validation="required"
                        :validation-messages="{ required: 'La Imagen del Producto es Obligatoria'}"
                        accept=".jpg" 
                        @change="onFileChange"
                        v-model.trim="formData.image"
                    />
                    <!-- con el atributo multiple="true" habilitamos a cargar multiples imagenes en el input file, por default su valor es false (v317) -->

                    <!-- preview imagen -->
                    <div v-if="isImageUploaded">
                        <p class="font-black">Imagen Producto:</p>
                        <img 
                            class="w-32" 
                            :src="url" 
                            alt="nueva imagen producto"
                        >
                    </div>
                    <!-- fin preview imagen -->

                    <FormKit 
                        type="select"
                        label="Categoría"
                        name="category"
                        validation="required"
                        :validation-messages="{ required: 'La categoría es obligatoria'}" 
                        :options="products.categoryOptions"
                        v-model.number="formData.category"
                    />

                    <FormKit 
                        type="number"
                        label="Precio"
                        name="price"
                        placeholder="Precio de Producto"
                        validation="required"
                        :validation-messages="{ required: 'El Precio es Obligatorio'}"
                        min="1"
                        v-model.number="formData.price"
                    />
                    
                    <FormKit 
                        type="number"
                        label="Disponibles"
                        name="availability"
                        placeholder="Cantidad disponible"
                        validation="required"
                        :validation-messages="{ required: 'La cantidad es obligatoria'}"
                        min="1"
                        v-model.number="formData.availability"
                    />

                </FormKit>
            </div>

        </div>
        

    </div>
</template>