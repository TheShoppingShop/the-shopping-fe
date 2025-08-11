<script setup lang="ts">
import { useRouter } from 'vue-router'
import {Search, Heart, X} from 'lucide-vue-next'
import VButton from '@/components/ui/VButton.vue'
import Input from '@/components/ui/VInput.vue'
import {debounce} from "lodash/debounce";
import {ref} from 'vue'
import type {Video} from "~/types";
import {useVideoStore} from "~/store/useVideoStore";
import {useRoute} from "#vue-router";
// import VAvatar from '@/components/ui/VAvatar.vue'

const useVideos = useVideoStore();
const route = useRoute()
const router = useRouter()

const search = ref('')

const suggestionsLoading = ref(false)
const suggestions = ref<Video[]>([])
const openMobileSearch = ref(false)


onMounted(() => {
  if (route.query?.v) {
    search.value = route.query.v as string
  }
})

const handleProfileClick = () => {
  router.push('/profile')
}

const goHome = () => {
  router.push('/')
}

const clearSearch = () => {
  search.value = '';
  suggestions.value = []
}

const clearSuggestions = () => {
  suggestions.value = []
}

const getSuggestions = async () => {
  suggestionsLoading.value = true
  try {
    const {data} = await useVideos.getSuggestVideos(search.value);
    suggestions.value = data
  } catch (err) {
    console.error("getVideos error:", err);
  } finally {
    suggestionsLoading.value = false
  }
}

const startSearch = debounce(() => {
  getSuggestions()
}, 400)

const startSearchOnFocus = debounce(() => {
  if(!search.value) return
  getSuggestions()
}, 400)

const toResults = () => {
  router.push({name: 'result', query: {v: search.value}})
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo & Menu -->
      <div class="flex items-center space-x-4">
<!--        <VButton variant="ghost" size="sm" class="md:hidden">-->
<!--          <Menu class="h-5 w-5" />-->
<!--        </VButton>-->
        <h1
          class="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer"
          @click="goHome"
        >
          TheShopping
        </h1>
      </div>

      <!-- Search -->
      <div class="hidden md:flex flex-1 max-w-md mx-8">
        <div class="relative w-full">
          <form
            class="flex items-center"
            @submit.prevent="toResults"
          >
            <Input
              placeholder="Search trending products..."
              class="pl-5 rounded-tl-full rounded-bl-full"
              v-model:value="search"
              @input="startSearch"
              @focus="startSearchOnFocus"
            />
            <X
              v-if="search"
              class="absolute right-[60px] top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
              @click="clearSearch"
            />
            <button
              class="rounded-tr-full h-10 w-14 flex items-center justify-center rounded-br-full border border-l-0 hover:bg-gray-50"
              type="submit"
            >
              <Search class="transform h-4 w-4 text-muted-foreground mr-1" />
            </button>
          </form>
          <div
            v-if="suggestions?.length"
            v-click-outside="clearSuggestions"
            class="absolute top-full p-1 left-0 w-full mt-2 bg-background border border-muted-foreground/20 rounded-md shadow-xl"
          >
            <ul>
              <li
                v-for="(item, i) in suggestions"
                :key="`suggestion-${item.id}`"
                class="text-sm p-2 hover:bg-gray-50 cursor-pointer overflow-hidden flex items-center gap-2"
                :class="{'border-b': i !== suggestions.length - 1}"
                @click="router.push({name: 'video', query: {slug: item.slug}})"
              >
                <img
                  :src="item.thumbnailUrl"
                  :alt="item.title"
                  class="w-10 h-10 border border-muted-foreground/20 rounded-md"
                >
                {{ item.title?.length ? 100 > item.title.length ? item.title : item.title.slice(0, 100) + '...' : '' }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Icons & Avatar -->
      <div class="flex items-center space-x-2">
        <VButton
          variant="ghost"
          size="sm"
          class="md:hidden"
          @click="openMobileSearch = !openMobileSearch"
        >
          <Search class="h-5 w-5" />
        </VButton>

<!--        <VAvatar-->
<!--          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"-->
<!--          class="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all duration-200"-->
<!--          @click="handleProfileClick"-->
<!--        />-->
        <Heart
          class="h-6 w-6 cursor-pointer text-gray-500 hover:scale-110 transition-all duration-200"
          @click="handleProfileClick"
        />
      </div>
    </div>
  </header>
  <HeaderSearch v-if="openMobileSearch" @close="openMobileSearch = false" />
</template>
