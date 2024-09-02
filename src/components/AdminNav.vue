<script setup>
    import { RouterLink } from "vue-router"
    import Link from '@/components/Link.vue';
    import Logo from '@/components/Logo.vue';
</script>

<template>
    <header class="px-10 py-5 bg-gray-700 flex justify-between absolute top-0 w-full z-10">
        <div>
            <Logo />
        </div>
        <nav>
            
            <RouterLink
                class="rounded text-white p-2"
                :to="{ name: 'products'}"
            >
                Productos
            </RouterLink>

            <RouterLink
                class="rounded text-white p-2"
                :to="{ name: 'sales'}"
            >
                Ventas
            </RouterLink>

            <Link to="shop">
                Ir a Tienda
            </Link>
        </nav>
    </header>
</template>