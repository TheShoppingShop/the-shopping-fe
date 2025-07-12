<script setup lang="ts">
defineProps<{
  src?: string
  alt?: string
  class?: string
}>()
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :class="['aspect-square h-full w-full object-cover', $props.class]"
  />
</template>
