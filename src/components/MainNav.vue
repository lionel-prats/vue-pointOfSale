<script setup>
    import { useProductsStore } from "@/stores/products"
    import Link from '@/components/Link.vue';
    import Logo from '@/components/Logo.vue';

    const products = useProductsStore()
</script>

<template>
    <header class="px-10 py-5 bg-gray-700 flex flex-col lg:flex-row gap-5 lg:justify-between lg:items-center absolute top-0 w-full z-10">
        <div>
            <Logo />
            <div class="flex gap-5 text-white">
                <h2 class="text-lg font-extrabold">Filtros:</h2>
                <div 
                    class="flex items-center gap-2"
                    v-for="category in products.categories"
                    :key="category.id"
                >
                    <input 
                        type="radio"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        name="category"
                        :value="category.id"    
                        :checked="products.selectedCategory === category.id"
                        @change="products.selectedCategory = +$event.target.value"
                    >
                    <label class="text-gray-100">{{ category.name }}</label>
                </div>
            </div>
        </div>
        <nav>
            <Link to="admin">
                Administrar
            </Link>
        </nav>
    </header>
</template>