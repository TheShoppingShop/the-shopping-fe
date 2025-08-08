<script setup lang="ts">
import { ref } from 'vue'
import { Play, X, Heart } from 'lucide-vue-next'
import VCard from "~/components/ui/card/VCard.vue";
import VCardContent from "~/components/ui/card/VCardContent.vue";
import VButton from "~/components/ui/VButton.vue";
import type {Video} from "~/types";
import {useVideoStore} from "~/store/useVideoStore";
import {STORAGE_KEY} from "~/composables/useLikedVideo";
import {useRouter} from "#vue-router";

const videoStore = useVideoStore();
const router = useRouter()

const likedVideos = ref<Video[]>([])

const getLikedVideos = async () => {
  const storedLikedVideos = localStorage.getItem(STORAGE_KEY)
  if (storedLikedVideos) {
    const ids = JSON.parse(storedLikedVideos) as number[]
    likedVideos.value = await videoStore.getLikedVideos(ids)
  }
}

getLikedVideos();


const removeVideo = (id: number) => {
  likedVideos.value = likedVideos.value.filter(v => v.id !== id)
  const storedLikedVideos = localStorage.getItem(STORAGE_KEY)
  if (storedLikedVideos) {
    const ids = JSON.parse(storedLikedVideos) as number[]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.filter(v => v !== id)))
  }
}
const playVideo = (slug: string) => {
  router.push({
    path: `/video`,
    query: {slug}
  })
}
</script>

<template>
  <VCard v-if="!likedVideos.length">
    <VCardContent class="p-12 text-center">
      <Heart class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">No liked videos yet</h3>
      <p class="text-muted-foreground">Start exploring and like videos to see them here!</p>
    </VCardContent>
  </VCard>

  <!-- Ro‘yxat to‘liq bo‘lsa -->
  <div v-else class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Liked Videos</h2>
      <div class="text-sm text-muted-foreground">
        {{ likedVideos.length }} video{{ likedVideos.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <VCard
        v-for="video in likedVideos"
        :key="video.id"
        class="group overflow-hidden"
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
                @click="playVideo(video.slug)"
              >
                <Play class="h-4 w-4" />
              </VButton>
              <VButton
                size="sm"
                variant="destructive"
                class="bg-red-500/80 hover:bg-red-500"
                @click="removeVideo(video.id)"
              >
                <X class="h-4 w-4" />
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
          <div
            class="flex items-center justify-between text-xs text-muted-foreground"
          >
            <span>Liked video</span>
            <Heart class="h-5 w-5 fill-red-500 text-red-500" />
          </div>
        </VCardContent>
      </VCard>
    </div>
  </div>
</template>
