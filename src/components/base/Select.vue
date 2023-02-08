<script lang="ts" setup>
import { Validation } from '@vuelidate/core';
import VueMultiSelect from 'vue-multiselect'

export interface option {
    [key: string]: any
    label: string | number
    value: string | number | boolean
}

// [TypeScript] => Defining Props
interface Props {
    allowEmpty?: boolean
    disabled?: boolean
    label?: string
    modelValue?: string | number
    multiple?: boolean
    name: string
    onRemove?: Function
    onSelect?: Function
    options: option[] | null
    placeholder?: string
    tooltip?: string
    validator: Validation,
    hideSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    multiple: false,
    allowEmpty: true,
})

// [TypeScript] => Defining Emits
interface Emits {
    (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

const checkInputValidity = computed<string | boolean>(() => {
    return props.validator[props.name].$errors.length ? 'border-danger' : false
})

const noOpt = ['Sin Opción']

const options_handle = computed(() => {
    if (props.options != null) {

        const mapped = props.options.sort((a, b) => {
            if (typeof (a.value) == 'number' && typeof (b.value) == 'number') {
                return a.value - b.value
            }
            else {
                return a.label.toString().localeCompare(b.label.toString())
            }
        }).map(item => item.value)
        return mapped
    }
    else {
        return noOpt
    }
})

const label_handle = (opt: string) => {
    if (props.options != null) {
        return props.options.find(x => x.value == opt).label
    }
    else {
        return 'Sin opción'
    }
}

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value as string)
    }
})

</script>

<template>
    <div class="BaseSelect">
        <!-- Label -->
        <template v-if="label">
            <label :for="name" class="form-label font-bold">
                {{ label }}
            </label>
        </template>
        <!-- Component -->
        <VueMultiSelect v-model="value" placeholder="Selecciona" class="box-border border rounded"
            :class="checkInputValidity" :options="options_handle" :close-on-select="true" :clear-on-select="false"
            :custom-label="(opt: string) => label_handle(opt)" :allowEmpty="allowEmpty" :disabled="disabled"
            :hideSelected="hideSelected" :multiple="multiple" openDirection="bottom" selectedLabel="" deselectLabel=""
            selectLabel="" @select="onSelect" @remove="onRemove">
            <template #noResult>
                No se encontraron elementos.
            </template>
            <template #noOptions>
                La lista esta vacia.
            </template>
            <!-- <template #caret="{ toggle }">
                <button type="button" class="absolute top-2.5 right-2" tabindex="-1" @click="toggle()">
                    <ChevronDownIcon class="text-dark" size="20" />
                </button>
            </template> -->
        </VueMultiSelect>
        <!-- Validator -->
        <div class="mt-2">
            <template v-if="validator[name].$error">
                <div v-for="(error, index) in validator[name].$errors" :key="index" class="text-xs text-danger">
                    {{ error.$message }}
                </div>
            </template>
            <template v-else-if="tooltip">
                <small class="text-gray-400">
                    {{ tooltip }}
                </small>
            </template>
        </div>
    </div>
</template>

<style>
.BaseSelect {}
</style>