<script setup lang="ts">
import { inject, computed } from 'vue'

const props = defineProps<{
  value: string          /* tab id */
  class?: string
}>()

const ctx = inject<any>('tabsCtx')
if (!ctx) throw new Error('VTabsContent must be used inside VTabs')

const isActive = computed(() => ctx.active.value === props.value)
</script>

<template>
  <div
    v-show="isActive"
    :class="[
      'mt-2 ring-offset-background focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      $props.class
    ]"
  >
    <slot />
  </div>
</template>
