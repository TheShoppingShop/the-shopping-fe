<script setup lang="ts">
import {useAsyncData, refreshNuxtData} from "#app";
import VButton from "~/components/ui/VButton.vue";
import {Play, Loader} from "lucide-vue-next";
import VCard from "~/components/ui/card/VCard.vue";
import VCardContent from "~/components/ui/card/VCardContent.vue";
import {useVideoStore} from "~/store/useVideoStore";
import {useRoute, useRouter} from "#vue-router";
import {onMounted, onUnmounted, ref} from "vue";
import type {VideosParams} from "~/types";

const useVideos = useVideoStore()
const route = useRoute()
const router = useRouter()

const testLoading = ref(false)
const nextPageLoading = ref(false)
const params = ref<VideosParams>({
  page: 1,
  limit: 10
})

const { data: searchedVideos, pending: loading } = await useAsyncData('resultVideos', () => useVideos.getSuggestVideos({...params.value, search: route.query.v as string}))

watch(
  () => route.query.v,
  async () => {
    await refreshNuxtData('videosWithSlug')
  }
)

const playVideo = (slug: string) => {
  router.push({
    path: `/video`,
    query: {slug}
  })
}

const getVideos = async (nextPage?: boolean) => {
  if(!searchedVideos.value?.data) return
  if(!nextPage) nextPageLoading.value = true
  try {
    const data = await useVideos.getSuggestVideos(params.value);
    if(nextPage) searchedVideos.value.data = [...searchedVideos.value.data, ...data.data]
    else searchedVideos.value.data = data.data
  } catch (err) {
    console.error("getVideos error:", err);
  } finally {
    nextPageLoading.value = false
  }
}

const nextVideo = async () => {
  if(!searchedVideos.value?.data || !params.value?.page || params.value.page >= searchedVideos.value.totalPages) return
  params.value.page++
  nextPageLoading.value = true
  await getVideos(true)
  setTimeout(() => {
    nextPageLoading.value = false
  }, 2000)
}



const handleScroll = () => {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000
  if (nearBottom && !nextPageLoading.value) {
    nextVideo()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
<div>
  <MainHeader />
  <div v-if="searchedVideos?.data" class="space-y-6 container mx-auto mt-8 pb-10">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Results</h2>
      <div class="text-sm text-muted-foreground">
        {{ searchedVideos?.data?.length }} video{{ searchedVideos.data.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <div
      v-if="searchedVideos?.data?.length"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 relative"
    >
      <div v-if="loading || testLoading" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Loader />
      </div>
      <VCard
        v-for="video in searchedVideos.data"
        :key="video.id"
        class="group overflow-hidden cursor-pointer"
        @click="playVideo(video.slug)"
      >
        <!-- Thumbnail -->
        <div class="relative aspect-[13/16] overflow-hidden">
          <img
            :src="video?.thumbnailUrl"
            :alt="video.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <!-- Hover overlay -->
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <div class="flex gap-2">
              <VButton
                size="sm"
                class="bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                <Play class="h-4 w-4" />
              </VButton>
            </div>
          </div>
        </div>

        <!-- Card content -->
        <VCardContent class="p-3">
          <h3 class="font-semibold text-sm line-clamp-2 mb-2">
            {{ video.title }}
          </h3>
        </VCardContent>
      </VCard>
      <div v-if="nextPageLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
