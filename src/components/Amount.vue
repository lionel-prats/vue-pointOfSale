<template>
    <div class="flex justify-between p-1">
        
        <!-- dt -> description term (elemento HTML) (v351) -->
        <dt class="font-bold">
            <slot name="label" />
        </dt>
        
        <!-- dl -> description details (elemento HTML) (v351) -->
        <dd class="text-gray-900">
            <slot></slot>
        </dd>
    </div>
</template>