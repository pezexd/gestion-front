<script lang="ts" setup>
import { computed } from 'vue'

// [TypeScript] => Defining Props
interface Props {
    modelValue?: string | number
    label?: string
    placeholder?: string
    minlength?: string | number
    maxlength?: string | number
    disabled?: boolean
    tooltip?: string
    name: string
    rows?: string
    cols?: string
    validator: Object
}

const props = withDefaults(defineProps<Props>(), {})

// [TypeScript] => Defining Emits
interface Emits {
    (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

// Detecting v-model changes.
const onInput = (e) => {
    emit('update:modelValue', e.target.value)
}

const checkInputValidity = computed<string | boolean>(() => {
    return props.validator[props.name].$errors.length ? 'border-danger' : false
})
</script>

<template>
    <div class="BaseInput">
        <!-- Label -->
        <label v-if="label" :for="name" class="form-label font-bold">{{ label }}</label>
        <!-- Component -->
        <textarea
            :name="name"
            :minlength="minlength"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :rows="rows"
            :cols="cols"
            :disabled="disabled"
            :value="modelValue"
            :class="['form-control', checkInputValidity]"
            @input="onInput"
        ></textarea>
        <!-- Validator -->
        <div class="BaseInput-validation mt-2">
            <template v-if="validator[name].$errors.length">
                <div v-for="error of validator[name].$errors" :key="error.$uid">
                    <div class="text-danger">{{ error.$message }}</div>
                </div>
            </template>
            <template v-else-if="tooltip">
                <small class="block text-gray-400">{{ tooltip }}</small>
            </template>
        </div>
    </div>
</template>

<style scoped>
.BaseInput {
}
</style>
