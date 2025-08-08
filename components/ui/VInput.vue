<script setup lang="ts">
import {defineModel} from 'vue'
defineProps<{
  type?: string
  customClass?: string
}>()
const value = defineModel('value', {type: String})
</script>

<template>
  <input
    :type="type || 'text'"
    :class="[
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
      'placeholder:text-muted-foreground',
      'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      customClass
    ]"
    v-model="value"
    v-bind="$attrs"
  >
</template>
