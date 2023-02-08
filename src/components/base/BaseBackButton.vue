<script setup lang="ts">
const route = useRoute()

const routeName = String(route.name).split('.')[0]
</script>

<template>
    <router-link :to="{ name: `${routeName}.index` }" class="flex items-center gap-2">
        <ArrowLeftIcon class="w-5 h-5" />
        <span class="text-xs">
            Volver
        </span>
    </router-link>
</template>