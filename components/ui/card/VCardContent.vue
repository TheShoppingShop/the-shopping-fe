<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="['p-6', $props.class]">
    <slot />
  </div>
</template>
