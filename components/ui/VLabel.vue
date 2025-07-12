<template>
  <label
    ref="labelRef"
    :for="forLabel"
    :class="[
      'text-sm font-medium leading-none',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      customClass
    ]"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  forLabel?: string
  class?: string
}>()

const customClass = props.class || ''
const labelRef = ref<HTMLLabelElement | null>(null)
</script>
