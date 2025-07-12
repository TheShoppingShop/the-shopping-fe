<!-- components/ui/Accordion.vue -->
<template>
  <div class="border-b" v-for="(item, i) in items" :key="item.id">
    <button
      class="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline"
      @click="toggle(i)"
    >
      {{ item.title }}
      <ChevronDown class="h-4 w-4 transition-transform duration-200" />
    </button>
    <div
      v-show="activeIndex === i"
      class="overflow-hidden text-sm animate-accordion-down"
    >
      <div class="pb-4 pt-0">
        <slot :name="item.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

defineProps<{
  items: { id: string; title: string }[]
}>()

const activeIndex = ref<number | null>(null)
const toggle = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<style scoped>
@keyframes accordion-down {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: auto;
    opacity: 1;
  }
}
.animate-accordion-down {
  animation: accordion-down 0.2s ease-out;
}
</style>
