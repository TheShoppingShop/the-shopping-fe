<script setup lang="ts">
/**
 * A minimalist Tailwind-styled separator.
 * Props:
 *  - orientation: "horizontal" | "vertical"  (default: "horizontal")
 *  - decorative : boolean (accessibility, default: true)
 *  - class      : extra classes
 */
const props = defineProps<{
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  class?: string
}>()

const orientation = props.orientation ?? 'horizontal'
const decorative = props.decorative ?? true
</script>

<template>
  <div
    role="separator"
    :aria-orientation="orientation"
    :aria-hidden="decorative"
    :class="[
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      props.class
    ]"
  />
</template>
