<script setup lang="ts">
defineProps<{
  src?: string
  alt?: string
  fallback?: string
  classs?: string
}>()
</script>

<template>
  <div :class="['relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted', classs]">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="aspect-square h-full w-full object-cover"
    />
    <div v-else class="flex items-center justify-center h-full w-full text-sm text-muted-foreground">
      {{ fallback }}
    </div>
  </div>
</template>
