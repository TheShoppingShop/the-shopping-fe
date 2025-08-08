<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Play, Heart } from 'lucide-vue-next'
import type {Video} from '@/types'
import {formatViews} from "~/utils/helpers-functions";
import {useLikedVideos} from "~/composables/useLikedVideo";
import {useVideoStore} from "~/store/useVideoStore";

const likedVideos = useLikedVideos()
const videoStore = useVideoStore()
const router = useRouter()

interface Props {
  video: Video
}

interface Emits {
  (e: 'update-like-count', {id, liked}: {id: number, liked?: boolean}): void
}
const props = defineProps<Props>()

const emits = defineEmits<Emits>()
const isHovered = ref(false)

const handleClick = () => {
  router.push({
    path: `/video`,
    query: {slug: props.video.slug}
  })
}

const toggleLike = async () => {
  const id = props.video.id
  if(!id) return
  try {
    if(!likedVideos.isLiked(id)) {
      await videoStore.likeVideo(id)
      emits('update-like-count', {id, liked: true})
    } else {
      await videoStore.unlikeVideo(id)
      emits('update-like-count', {id, liked: false})
    }
    likedVideos.toggleLike(id)
  } catch (err) {
    console.error("toggleLike error:", err);
  }
}
</script>

<template>
  <div
    class="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleClick"
  >
    <!-- Thumbnail -->
    <div class="absolute inset-0">
      <img
        :src="video.thumbnailUrl"
        :alt="video.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <!-- Play Button -->
      <div
        class="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        :class="{ 'opacity-100': isHovered, 'opacity-0': !isHovered }"
      >
        <div
          class="bg-white/20 backdrop-blur-sm rounded-full p-4 transform transition-transform duration-300 hover:scale-110"
        >
          <Play class="w-8 h-8 text-white fill-white" />
        </div>
      </div>
    </div>

    <!-- Text content -->
    <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
      <h3 class="font-semibold text-sm mb-2 line-clamp-2">{{ video.title }}</h3>
      <div class="flex items-center justify-between text-xs opacity-90">
        <div>
          <span v-if="video?.views || video?.views === 0">{{ formatViews(video.views) }} views</span>
        </div>
        <client-only>
          <button
            @click.stop="toggleLike"
            class="flex items-center space-x-1 hover:scale-110 transition-transform"
          >
            <Heart class="w-4 h-4" :class="{ 'fill-red-500 text-red-500': likedVideos.isLiked(video.id) }" />
            <span>{{ formatViews(video.likes) }}</span>
          </button>
        </client-only>
      </div>
    </div>

    <!-- Price Badge -->
<!--    <div class="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">-->
<!--      $348.00-->
<!--    </div>-->
  </div>
</template>
