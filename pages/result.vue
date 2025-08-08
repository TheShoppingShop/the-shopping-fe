<script setup lang="ts">
import {useAsyncData, refreshNuxtData} from "#app";
import VButton from "~/components/ui/VButton.vue";
import {Play, Loader} from "lucide-vue-next";
import VCard from "~/components/ui/card/VCard.vue";
import VCardContent from "~/components/ui/card/VCardContent.vue";
import {useVideoStore} from "~/store/useVideoStore";
import {useRoute, useRouter} from "#vue-router";

const useVideos = useVideoStore()
const route = useRoute()
const router = useRouter()

const testLoading = ref(false)

const { data: searchedVideos, pending: loading } = await useAsyncData('resultVideos', () => useVideos.getSuggestVideos(route.query.v as string))


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
</script>

<template>
<div>
  <MainHeader />
  <div v-if="searchedVideos" class="space-y-6 container mx-auto mt-8">
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

          <!-- Price badge -->
          <!--          <div-->
          <!--            class="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold"-->
          <!--          >-->
          <!--            {{ video.price }}-->
          <!--          </div>-->
        </div>

        <!-- Card content -->
        <VCardContent class="p-3">
          <h3 class="font-semibold text-sm line-clamp-2 mb-2">
            {{ video.title }}
          </h3>
        </VCardContent>
      </VCard>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
