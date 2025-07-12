<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Hls from 'hls.js'
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Heart,
  Share2,
  ShoppingCart,
  Volume2,
  VolumeX,
  Pause
} from 'lucide-vue-next'

import VButton from '@/components/ui/VButton.vue'
import Badge from '@/components/ui/VBadge.vue'
import { useAsyncData } from '#app'
import { useVideoStore } from '@/store/useVideoStore'
import type {Video} from "~/types"; // adjust path as needed

const useVideos = useVideoStore()

const router = useRouter()
const route = useRoute()
const videoRef = ref<HTMLVideoElement | null>(null)
const hls = ref<Hls | null>(null)
const currentIndex = ref(0)
const liked = ref(false)
const isPlaying = ref(true)
const isMuted = ref(true)

const { data: videosBySlug, pending: loading } = await useAsyncData('videosWithSlug', () => useVideos.getVideosWithSlug(route.query.slug as string))
const videos = computed(() => videosBySlug.value?.data)
const totalPages = computed(() => videosBySlug.value?.totalPages)
const page = ref(1)

const initPlayer = (url: string) => {
  const video = videoRef.value
  if (!video) return

  if (hls.value) hls.value.destroy()

  if (Hls.isSupported()) {
    hls.value = new Hls({ enableWorker: false })
    hls.value.loadSource(url)
    hls.value.attachMedia(video)
    hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
      video.muted = true
      video.play().catch(console.error)
      isPlaying.value = true
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url
    video.muted = true
    video.play().catch(console.error)
    isPlaying.value = true
  } else {
    video.src = url
    video.muted = true
    video.play().catch(console.error)
    isPlaying.value = true
  }
}

const togglePlay = () => {
  const video = videoRef.value
  if (!video) return

  if (video.paused) {
    video.play()
    isPlaying.value = true
  } else {
    video.pause()
    isPlaying.value = false
  }
}

const toggleMute = () => {
  const video = videoRef.value
  if (!video) return

  video.muted = !video.muted
  isMuted.value = video.muted
}

const nextVideo = () => {
  if (videos.value && currentIndex.value < videos.value.length - 1) {
    currentIndex.value++
    // router.replace({ path: `/video/${videos.value[currentIndex.value].slug}` })
    router.replace({ query: {slug: videos.value[currentIndex.value].slug}})
  }
}

const prevVideo = () => {
  if (videos.value && currentIndex.value > 0) {
    currentIndex.value--
    // router.replace({ path: `/video/${videos.value[currentIndex.value].slug}` })
    router.replace({ query: {slug: videos.value[currentIndex.value].slug}})
  }
}

watch(() => route.query.slug, () => {
  if (videos.value && videos.value.length) {
    const index = videos.value.findIndex((v: Video) => v.id === route.query.slug)
    currentIndex.value = index >= 0 ? index : 0
    initPlayer(videos.value[currentIndex.value].videoUrl)
    // isMuted.value = true
  }
})

onMounted(() => {
  if (videos.value && videos.value.length) {
    const index = videos.value.findIndex((v: Video) => v.id === route.query.slug)
    currentIndex.value = index >= 0 ? index : 0
    initPlayer(videos.value[currentIndex.value].videoUrl)
    isMuted.value = true
  }
})

onUnmounted(() => {
  if (hls.value) hls.value.destroy()
})
</script>

<template>
  <div>
    {{ currentIndex }}
    <div v-if="loading" class="min-h-screen bg-background flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p class="text-muted-foreground">Loading videos...</p>
      </div>
    </div>
    <div v-else-if="videos && videos.length" class="min-h-screen bg-background flex flex-col lg:flex-row">
      <div class="lg:w-1/2 xl:w-3/5 bg-black relative flex items-center justify-center">
        <VButton variant="ghost" size="sm" class="absolute top-4 left-4 z-10 text-white hover:bg-white/20" @click="router.push('/')">
          <ArrowLeft class="w-5 h-5" />
        </VButton>
        <div class="relative max-w-sm w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
          <video ref="videoRef" class="w-full h-full object-cover cursor-pointer" @click="togglePlay" playsinline muted autoplay :poster="videos[currentIndex].thumbnailUrl" preload="metadata" />
          <div v-if="!isPlaying" class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="bg-black/50 rounded-full p-4">
              <Pause class="w-12 h-12 text-white fill-white" />
            </div>
          </div>
          <VButton variant="ghost" size="sm" @click="toggleMute" class="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full p-2">
            <component :is="isMuted ? VolumeX : Volume2" class="w-5 h-5" />
          </VButton>
          <div class="absolute bottom-4 left-4 right-4 text-white">
            <h2 class="font-bold text-lg mb-2">{{ videos[currentIndex].title }}</h2>
            <div class="flex items-center justify-between text-sm opacity-90">
              <span>{{ videos[currentIndex].views }} views</span>
              <div class="flex items-center space-x-4">
                <button @click="liked = !liked" class="flex items-center space-x-1 hover:scale-110 transition-transform">
                  <Heart :class="['w-5 h-5', liked ? 'fill-red-500 text-red-500' : '']" />
                  <span>{{ videos[currentIndex].likes }}</span>
                </button>
                <button class="hover:scale-110 transition-transform">
                  <Share2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
          <VButton variant="ghost" size="sm" class="text-white hover:bg-white/20 rounded-full p-3" @click="prevVideo" :disabled="currentIndex === 0">
            <ArrowUp class="w-6 h-6" />
          </VButton>
          <VButton variant="ghost" size="sm" class="text-white hover:bg-white/20 rounded-full p-3" @click="nextVideo" :disabled="currentIndex === videos.length - 1">
            <ArrowDown class="w-6 h-6" />
          </VButton>
        </div>
      </div>
      <div class="lg:w-1/2 xl:w-2/5 bg-card p-6 lg:p-8 overflow-y-auto">
        <div class="max-w-lg mx-auto space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-foreground mb-3">
              {{ videos[currentIndex]?.title }}
            </h1>
            <p class="text-muted-foreground leading-relaxed">
              {{ videos[currentIndex]?.description }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
          <span class="text-3xl font-bold text-primary">
            {{ videos[currentIndex]?.price }}
          </span>
            <span class="text-lg text-muted-foreground line-through">
            {{ videos[currentIndex]?.originalPrice }}
          </span>
            <Badge variant="destructive">
              Save {{ Math.round((1 - parseFloat(videos[currentIndex]?.price?.replace('$', '')) / parseFloat(videos[currentIndex]?.originalPrice?.replace('$', ''))) * 100) }}%
            </Badge>
          </div>
          <div>
            <h3 class="font-semibold text-lg mb-3">Key Features</h3>
            <ul class="space-y-2">
              <li v-for="(feat, idx) in videos[currentIndex]?.features" :key="idx" class="flex items-start space-x-2">
                <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span class="text-muted-foreground">{{ feat }}</span>
              </li>
            </ul>
          </div>
          <div class="space-y-3 pt-4">
            <VButton class="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105" @click="window.open(videos[currentIndex].product.affiliateLink, '_blank')">
              <ShoppingCart class="w-5 h-5 mr-2" />
              Buy Now on Amazon
            </VButton>
            <p class="text-xs text-muted-foreground text-center">
              * This is an affiliate link. We may earn a commission at no extra cost to you.
            </p>
          </div>
          <div class="bg-muted/30 rounded-2xl p-4 space-y-2">
            <h4 class="font-semibold">Why we recommend this product:</h4>
            <p class="text-sm text-muted-foreground">
              This product has been carefully selected based on customer reviews, quality standards,
              and value for money. Our team tests and reviews products to ensure we only recommend the best.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
