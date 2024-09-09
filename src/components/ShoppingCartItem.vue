<script setup>
    import { useCartStore } from "@/stores/cart"
    import { formatCurrency } from "@/helpers"

    defineProps({
        item: {
            type: Object,
        },
    })

    const cart = useCartStore()

</script>

<template>
    <li class="flex space-x-6 py-6">
        <img 
            class="h-24 w-24 flex-none rounded"
            :src="item.image" 
            :alt="'Imagen de ' + item.name"
        >
        <div class="flex-auto space-y-2">
            <h3 class="text-gray-900">{{ item.name }}</h3>
            <p>{{ formatCurrency(item.price) }}</p>
            <select
                class="w-32 text-left p-2 rounded-lg bg-white"
                @change="cart.updateQuantity(item.id, +$event.target.value)"
            >
                <option 
                    v-for="n in cart.checkProductAvailability(item)"
                    :value="n"
                >{{ n }}</option>
            </select>
        </div>
    </li>
</template>