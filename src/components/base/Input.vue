<script lang="ts" setup>
import { computed } from 'vue'

// [TypeScript] => Defining Props
interface Props {
    type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'search'
    | 'url'
    | 'tel'
    | 'date'
    | 'time'
    | 'range'
    | 'color'
    | 'hidden'
    | 'file'
    modelValue?: string | number | Object | boolean
    label?: string
    placeholder?: string
    min?: string | number
    max?: string | number
    disabled?: boolean
    tooltip?: string
    name: string
    validator: object
}

const props = withDefaults(defineProps<Props>(), {})

// [TypeScript] => Defining Emits
interface Emits {
    (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

// Detecting v-model changes.
const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value as string)
    }
})

const checkInputValidity = computed<string | boolean>(() => {
    return props.validator[props.name].$errors.length ? 'border-danger' : false
})
</script>

<template>
    <div class="BaseInput w-full relative">
        <!-- Label -->
        <template v-if="label">
            <label :for="name" class="form-label font-bold">{{ label }}</label>
        </template>
        <!-- If is Date -->
        <div v-if="type === 'date'"
            class="absolute right-0 box-border rounded-r w-10 h-[42px] pointer-events-none flex items-center justify-center bg-slate-100 border text-slate-500"
            :class="[checkInputValidity, label ? 'top-7' : 'top-0']">
            <CalendarIcon class="w-4 h-4" />
        </div>
        <!-- Component -->
        <input autocomplete="off" :name="name" :type="type" :min="min" :max="max" v-model="value"
            :placeholder="placeholder" :disabled="disabled"
            :onfocus="(type === 'time' || type === 'date') ? 'this.showPicker()' : ''"
            :class="['form-control py-[10px]', checkInputValidity]" />
        <!-- Validator -->
        <div class="mt-2">
            <template v-if="validator[name].$error">
                <template v-for="(error, index) in validator[name].$errors" :key="index">
                    <small class="block text-danger">{{ error.$message }}</small>
                </template>
            </template>
            <template v-else-if="tooltip">
                <small class="block text-gray-400">{{ tooltip }}</small>
            </template>
        </div>
    </div>
</template>

<style scoped>
.BaseInput {}
</style>
