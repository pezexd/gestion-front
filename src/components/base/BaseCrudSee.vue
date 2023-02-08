<script setup lang="ts">
import SlideOver from '../SlideOver.vue';
import ImageWrapper from '../see/ImageWrapper.vue';
import DocWrapper from '../see/DocWrapper.vue';

interface Item {
    [key: string]: any
}

withDefaults(defineProps<{
    item: {
        [key: string]: any,
        consecutive: string
    },
    full_view?: boolean
}>(), {
    full_view: false
})
</script>

<template>
    <SlideOver :full_view="full_view">
        <template #button="scope">
            <button @click="scope.open(true)" class="btn btn-secondary flex gap-1 items-center">
                <EyeIcon class="w-5 h-5" />
                <span class="text-sm">
                    Ver
                </span>
            </button>
        </template>
        <template #header="scope">
            <div class="flex flex-row items-center justify-between">
                <h2 class="p-1.5 text-lg font-medium text-gray-900">
                    {{ item.consecutive }}
                </h2>
                <button @click="scope.close(false)"
                    class="flex sm:hidden bg-secondary hover:bg-secondary/70 p-2.5 rounded-full transition">
                    <XIcon />
                </button>
            </div>
        </template>
        <template #body>
            <div class="grid grid-cols-1 gap-6 divide-dashed divide-y-2 divide-slate-200">
                <template v-for="section in item.sections">
                    <section class="flex flex-col gap-2 justify-evenly py-3 divide-dashed divide-y-2 divide-slate-200">
                        <h3 class="font-bold uppercase text-center">
                            {{ section.title }}
                        </h3>
                        <div class="flex flex-col gap-4 pt-4">
                            <template v-for="key in Object.keys(section.fields)">
                                <template v-if="section.fields[key] == '' || section.fields[key] == null" />
                                <template v-else>
                                    <template v-if="key.includes('IMAGEN')">
                                        <div
                                            class="flex flex-col gap-1 justify-start col-span-1 sm:col-span-2 md:col-span-3">
                                            <h3 class="text-xs opacity-80">
                                                {{ key }}
                                            </h3>
                                            <ImageWrapper :path="section.fields[key]" />
                                        </div>
                                    </template>
                                    <template v-else-if="key.includes('ARCHIVO')">
                                        <div
                                            class="flex flex-col gap-1 justify-start col-span-1 sm:col-span-2 md:col-span-3">
                                            <h3 class="text-xs opacity-80">
                                                {{ key }}
                                            </h3>
                                            <template
                                                v-if="section.fields[key].includes('pdf') || section.fields[key].includes('doc') || section.fields[key].includes('docx')">
                                                <DocWrapper :path="section.fields[key]" />
                                            </template>
                                            <template v-else>
                                                <ImageWrapper :path="section.fields[key]" />
                                            </template>
                                        </div>
                                    </template>
                                    <template v-else-if="key.includes('DOCUMENTO')">
                                        <div
                                            class="flex flex-col gap-1 justify-start col-span-1 sm:col-span-2 md:col-span-3">
                                            <h3 class="text-xs opacity-80">
                                                {{ key }}
                                            </h3>
                                            <DocWrapper :path="section.fields[key]" />
                                        </div>
                                    </template>
                                    <template
                                        v-else-if="typeof section.fields[key] == 'object' && section.fields[key].length">
                                        <div
                                            class="flex flex-col gap-1 justify-start col-span-1 sm:col-span-2 md:col-span-3">
                                            <h3 class="text-xs opacity-80">
                                                {{ key }}
                                            </h3>
                                            <div class="overflow-x-auto">
                                                <table class="border-collapse border border-secondary">
                                                    <thead class="border-b border-secondary">
                                                        <th class="px-2 py-1 font-normal text-xs opacity-80 text-center even:bg-white odd:bg-slate-50"
                                                            v-for="header_key in Object.keys(section.fields[key][0])">
                                                            {{ header_key }}
                                                        </th>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="border-b border-secondary"
                                                            v-for="assistant in section.fields[key]">
                                                            <td class="px-2 py-1 font-semibold text-sm text-left whitespace-nowrap even:bg-white odd:bg-slate-50"
                                                                v-for="body_key in Object.keys(section.fields[key][0])">
                                                                {{ assistant[body_key] }}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div id="Otros">
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else-if="key.includes('RANGO')">
                                        <div
                                            class="flex flex-col gap-1 justify-start col-span-1 sm:col-span-2 md:col-span-3">
                                            <h3 class="text-xs opacity-80">
                                                {{ key }}
                                            </h3>
                                            <div class="relative w-full">
                                                <div class="w-full bg-slate-200 rounded h-4">
                                                    <div class="bg-primary h-full rounded text-xs text-white flex justify-center items-center"
                                                        :style="`width:${(section.fields[key].value + 10) / 5}%`"
                                                        role="progressbar" aria-valuenow="0" aria-valuemin="0"
                                                        aria-valuemax="5">
                                                        {{ section.fields[key].value }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <!-- <div :class="`flex flex-col gap-1 justify-between ${section.fields[key].length>14?'col-span-1 sm:col-span-2 md:col-span-3':''}`"> -->
                                        <div class="flex flex-col gap-1 justify-start">
                                            <h3 class="text-xs opacity-80">
                                                {{ key }}
                                            </h3>
                                            <p class="font-semibold text-sm text-left break-words">
                                                {{ section.fields[key] }}
                                            </p>
                                        </div>
                                    </template>
                                </template>
                            </template>
                        </div>
                    </section>
                </template>
            </div>
        </template>
    </SlideOver>
</template>

<style scoped>
#range::-webkit-progress-bar {
    @apply bg-secondary rounded-full w-full;
}

#range::-webkit-progress-value {
    @apply bg-primary rounded-full w-full;
}
</style>