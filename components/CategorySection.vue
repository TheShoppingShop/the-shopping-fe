<script setup lang="ts">
import { ref } from 'vue'
import type {Category} from "~/types/index.js";
const activeCategory = ref<number>()

interface Props {
  categories: Category[]
}

interface Emits {
  (e: 'change-category', id?: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const gradients = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-rose-500 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-yellow-500",
  "from-green-500 to-emerald-500",
  "from-teal-500 to-green-500",
  "from-indigo-500 to-purple-500",
  "from-red-500 to-yellow-500",
  "from-lime-500 to-green-500",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function getGradientByCategory(category: Category): string {
  const input = `${category.id}-${category.name}`;
  const hash = hashString(input);
  const index = hash % gradients.length;
  return gradients[index];
}

const categoriesWithGradient = computed(() =>
  props.categories.map(category => ({
    ...category,
    gradient: getGradientByCategory(category)
  }))
)

const selectCategory = (id?: number) => {
  activeCategory.value = id
  emit('change-category', id)
}
</script>

<template>
  <div class="w-full mb-8">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-foreground mb-2">Explore Categories</h2>
      <p class="text-muted-foreground">Discover trending products by category</p>
    </div>

    <div class="flex flex-wrap gap-4">
      <div
        @click="selectCategory(undefined)"
        class="w-32 h-40 rounded-2xl overflow-hidden cursor-pointer group relative transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 flex items-center justify-center bg-white text-foreground border border-muted shadow"
        :class="activeCategory === undefined
    ? 'ring-2 ring-primary ring-offset-2 shadow-lg'
    : ''"
      >
        <span class="text-base font-semibold text-center">All</span>

        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      </div>
      <div
        v-for="(category, i) in categoriesWithGradient"
        :key="`category-${i}`"
        @click="selectCategory(category.id)"
        class="w-32 h-40 rounded-2xl overflow-hidden cursor-pointer group relative transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2"
        :class="activeCategory === category.id
          ? 'ring-3 ring-primary ring-offset-2 ring-offset-background shadow-2xl'
          : 'shadow'"
      >
        <div
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url(${category.imgUrl})` }"
        />
        <div class="absolute inset-0 opacity-80" :class="`bg-gradient-to-t ${category.gradient}`" />
        <div class="relative h-full flex flex-col items-center justify-end p-4 text-white">
          <div class="text-sm font-bold text-center mb-1 drop-shadow-lg">
            {{ category.name }}
          </div>
<!--          <div class="text-xs text-center opacity-90 drop-shadow-md">-->
<!--            {{ category.name }}-->
<!--          </div>-->
        </div>
        <div
          v-if="activeCategory === category.id"
          class="absolute inset-0 bg-white/20 backdrop-blur-[1px]"
        >
          <div class="absolute top-3 right-3 w-3 h-3 bg-white rounded-full animate-pulse shadow-lg" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      </div>
    </div>
  </div>
</template>
