<template>
    <div class="text-center">
        <div 
            class="spinner-border" 
            :style="{
                height: `${size}px`,
                width: `${size}px`
            }" 
            role="status"
        >
            <span class="visually-hidden">Loading...</span>
        </div>
        <p v-if="label">
            <strong :style="{ fontSize: `${labelSize}px` }">{{ label }}</strong>
        </p>
    </div>
</template>
<script setup lang="ts">
interface IProps{
    label?: string;
    size?: number;
    labelSize?: number;
}
withDefaults(defineProps<IProps>(),{
    size: 32,
    labelSize: 16
})
</script>