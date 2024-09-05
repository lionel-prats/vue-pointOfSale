<script setup>
    import { reactive } from "vue"

    import Link from "@/components/Link.vue"
    import useImage from "@/composables/useImage"
    import { useProductsStore } from "@/stores/products" // store de Pinia (v329)

    const { url, isImgeUploaded, onFileChange } = useImage()
    const products = useProductsStore() // store de Pinia (v329)

    const formData = reactive({
        name: "",
        category: "",
        price: "",
        availability: "",
        image: "",
    })

    const submitHandler = data => {
        console.log(data);
    }

</script>

<template>
    <div>
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
                    <!-- con el atributo multiple="true" habilitamos a cargar multiples imagenes en el input file (v317) -->

                    <!-- preview imagen -->
                    <div v-if="isImgeUploaded">
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