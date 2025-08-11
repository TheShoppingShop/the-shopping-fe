<script setup lang="ts">
import {Search, X} from "lucide-vue-next";
import Input from "~/components/ui/VInput.vue";
import {ref} from "vue";
import {debounce} from "lodash/debounce";
import type {Video} from "~/types";
import {useVideoStore} from "~/store/useVideoStore";
import {useRoute, useRouter} from "#vue-router";

const useVideos = useVideoStore();
const router = useRouter()
const route = useRoute()

interface Emits {
  (e: 'close'): void
}

const emits = defineEmits<Emits>()

const search = ref('')
const suggestionsLoading = ref(false)
const suggestions = ref<Video[]>([])

const getSuggestions = async () => {
  suggestionsLoading.value = true
  try {
    const {data} = await useVideos.getSuggestVideos({search: search.value});
    suggestions.value = data
  } catch (err) {
    console.error("getVideos error:", err);
  } finally {
    suggestionsLoading.value = false
  }
}

onMounted(() => {
  if (route.query?.v) {
    search.value = route.query.v as string
  }
})

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

const clearSearch = () => {
  search.value = '';
  close();
}

const clearSuggestions = () => {
  suggestions.value = []
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 z-[10000]"
    @click="emits('close')"
  />

  <div class="fixed top-10 w-[90%] left-1/2 transform -translate-x-1/2 bg-background rounded-xl min-h-[80px] max-h-[500px] z-[100000]">
    <div
      class="w-[95%] absolute top-4 left-1/2 transform -translate-x-1/2 bg-white"
    >
      <form
        @submit.prevent="toResults"
        class="relative flex items-center"
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
        class="top-full p-1 w-full mt-2 bg-background border border-muted-foreground/20 rounded-md shadow-xl"
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
</template>

<style scoped>

</style>
