<script setup>
    import { storeToRefs } from "pinia"
    import { useProductsStore } from "@/stores/products"
    import MainNav from '@/components/MainNav.vue';
    import ProductCard from '@/components/ProductCard.vue';
    import ShoppingCart from '@/components/ShoppingCart.vue';

    const products = useProductsStore()
    // con el composable storeToRefs() de Pinia puedo aplicar destructuring al store todo lo que sea reactivo (states y computed properties) y asi no hace falta, por llamar a un getter como products.filteredProducts (v342)
    const { filteredProducts, noResults } = storeToRefs(products) 

</script>
<template>
    <div>
        <MainNav />
        <main class="p-10 lg:flex lg:h-screen lg:overflow-y-hidden">
            <div 
                class="lg:w-2/3 lg:h-screen lg:overflow-y-scroll py-40 lg:py-24 px-10"
            >
                <p v-if="noResults" class="text-center text-4xl">No hay Productos</p>
                <div
                    v-else
                    class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5"
                >
                    <ProductCard 
                        v-for="product in filteredProducts"
                        :key="product.id"
                        :product="product"
                    />

                </div>
            </div>
            <aside 
                class="lg:w-1/3 lg:h-screen lg:overflow-y-scroll py-40 lg:py-24 px-10"
            >
                <ShoppingCart />
            </aside>
        </main>
    </div>
</template>
