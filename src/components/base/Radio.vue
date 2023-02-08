<script lang="ts" setup>
// TypeScript => Defining Props
interface Props {
    name: string
    label?: string
    tooltip?: string
    options: Array<any>
    validator: object
    modelValue?: string | number | boolean
}

const props = withDefaults(defineProps<Props>(), {})

// [TypeScript] => Defining Emits
interface Emits {
    (e: 'update:modelValue', value: string | number | boolean): void
}

const emit = defineEmits<Emits>()

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

// // Detecting v-model changes.
// const onInput = (e) => {
//     emit('update:modelValue', e.target.value)
// }
</script>

<template>
    <div class="BaseRadio">
        <!-- Label -->
        <label v-if="label" class="form-label font-bold w-full text-left">{{ label }}</label>
        <!-- Component -->
        <div class="form-check my-3">
            <div v-for="(option, index) in options" class="mr-3" key="index">
                <input
                    type="radio"
                    class="form-check-input w-5 h-5"
                    :name="name"
                    :id="name + index"
                    :value="option.value"
                    v-model="value"
                />
                <label class="form-check-label" :for="name + index">{{ option.text || option.label }}</label>
            </div>
        </div>
        <!-- Validator -->
        <div class="mt-2">
            <template v-if="validator[name].$errors.length">
                <template v-for="error of validator[name].$errors" :key="error.$uid">
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
.BaseRadio {
}
</style>
