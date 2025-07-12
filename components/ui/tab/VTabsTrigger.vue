<script setup lang="ts">
import { inject, computed } from 'vue'

const props = defineProps<{
  value: string          /* tab id */
  disabled?: boolean
  class?: string
}>()

/* kontekst */
const ctx = inject<any>('tabsCtx')
if (!ctx) throw new Error('VTabsTrigger must be used inside VTabs')

/* active flag */
const isActive = computed(() => ctx.active.value === props.value)

/* click handler */
const handleClick = () => {
  if (!props.disabled) ctx.setActive(props.value)
}
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    @click="handleClick"
    :class="[
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium',
      'ring-offset-background transition-all focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      isActive
        ? 'bg-background text-foreground shadow-sm'
        : 'text-muted-foreground',
      $props.class
    ]"
  >
    <slot />
  </button>
</template>
