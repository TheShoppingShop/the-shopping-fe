<script setup lang="ts">
import { ref, provide } from 'vue'

/**
 * Props:
 *  - defaultValue : string   (boshlang‘ich tab id)
 *  - class        : string   (qo‘shimcha klasslar)
 */
const props = defineProps<{
  defaultValue?: string
  class?: string
}>()

/* aktiv tab holati */
const active = ref(props.defaultValue || '')

/* provide: key = 'tabsCtx' */
provide('tabsCtx', {
  active,
  setActive: (v: string) => (active.value = v)
})
</script>

<template>
  <div :class="props.class">
    <slot />
  </div>
</template>
