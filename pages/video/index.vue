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
  Play
} from 'lucide-vue-next'

import VButton from '@/components/ui/VButton.vue'
import { useAsyncData } from '#app'
import { useVideoStore } from '@/store/useVideoStore'
import type {ResponsePagination, Video} from "~/types";
import {useLikedVideos} from "~/composables/useLikedVideo"; // adjust path as needed

const useVideos = useVideoStore()
const videoLike = useLikedVideos()

const router = useRouter()
const route = useRoute()

const videoRef = ref<HTMLVideoElement | null>(null)
const hls = ref<Hls | null>(null)
const currentIndex = ref(0)
const isPlaying = ref(true)
const isMuted = ref(true)

const { data: videosBySlug, pending: loading } = await useAsyncData('videosWithSlug', () => useVideos.getVideosWithSlug(route.query.slug as string))
const videos = computed(() => (videosBySlug.value as ResponsePagination<Video>)?.data)
const totalPages = computed(() => (videosBySlug.value as ResponsePagination<Video>)?.totalPages)
const page = ref(1)

const currentVideo = computed(() => videos.value?.[currentIndex.value])

const siteUrl = 'https://theshopping.shop'
const defaultOg = `${siteUrl}/og-image.jpg`

useSeoMeta({
  // Title
  title: computed(() =>
    currentVideo.value?.metaTitle
      ? currentVideo.value.metaTitle
      : currentVideo.value?.title
        ? `${currentVideo.value.title} – TheShopping`
        : 'TheShopping – Watch, Discover & Shop Trending Amazon Products'
  ),
  ogTitle: computed(() =>
    currentVideo.value?.metaTitle
      ? currentVideo.value.metaTitle
      : currentVideo.value?.title
        ? `${currentVideo.value.title} – TheShopping`
        : 'TheShopping – Watch, Discover & Shop Trending Amazon Products'
  ),

  // Description
  description: computed(() => {
    const d = currentVideo.value?.metaDescription
      ?? currentVideo.value?.description
      ?? 'Discover trending Amazon products through engaging short videos.'
    return d.length > 160 ? d.slice(0,157) + '…' : d
  }),
  ogDescription: computed(() => {
    const d = currentVideo.value?.metaDescription
      ?? currentVideo.value?.description
      ?? 'Discover trending Amazon products through engaging short videos.'
    return d.length > 200 ? d.slice(0,197) + '…' : d
  }),

  // Keywords
  keywords: computed(() =>
    currentVideo.value?.metaKeywords?.length
      ? currentVideo.value.tags.join(', ')
      : 'amazon trending products, video reviews, online shopping USA, amazon finds'
  ),

  // Canonical / URL / Images
  ogUrl: computed(() =>
    currentVideo.value?.slug
      ? `${siteUrl}/video?slug=${currentVideo.value.slug}`
      : siteUrl
  ),
  ogImage: computed(() => currentVideo.value?.thumbnailUrl || defaultOg),
  twitterCard: 'summary_large_image',
  twitterImage: computed(() => currentVideo.value?.thumbnailUrl || defaultOg),

  // Region/locale (sahifa-level)
  ogLocale: 'en_US'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: computed(() =>
        currentVideo.value?.slug
          ? `${siteUrl}/video?slug=${currentVideo.value.slug}`
          : siteUrl
      )
    }
  ],
})

const initPlayer = (url: string) => {
  const video = videoRef.value
  if (!video) return

  if (hls.value) hls.value.destroy()

  if (Hls.isSupported()) {
    hls.value = new Hls({ enableWorker: false })
    hls.value.loadSource(url)
    hls.value.attachMedia(video)
    hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
      video.muted = isMuted.value
      video.play().catch(console.error)
      isPlaying.value = true
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url
    video.muted = isMuted.value
    video.play().catch(console.error)
    isPlaying.value = true
  } else {
    video.src = url
    video.muted = isMuted.value
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

const getVideos = async (page: number) => {
  try {
    videosBySlug.value = await useVideos.getVideosWithSlug(route.query.slug as string, {page})
  } catch (err) {
    console.error("getVideos error:", err);
  }
}

const nextVideo = () => {
  if (videos.value && currentIndex.value < videos.value.length - 1) {
    currentIndex.value++
    // router.replace({ path: `/video/${videos.value[currentIndex.value].slug}` })
    router.replace({ query: {slug: videos.value[currentIndex.value].slug}})
  }
  if(videos.value.length - 3 > currentIndex.value && page.value < totalPages.value) {
    getVideos(page.value+1)
  }
}

const prevVideo = () => {
  if (videos.value && currentIndex.value > 0) {
    currentIndex.value--
    // router.replace({ path: `/video/${videos.value[currentIndex.value].slug}` })
    router.replace({ query: {slug: videos.value[currentIndex.value].slug}})
  }
}

const openAmazonLink = (link: string) => {
  if(!link) return
  window.open(link, '_blank')
}

const shareVideo = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Check out this video!',
        text: 'Here’s a great video I found.',
        url: window.location.href
      })
      console.log('Video shared successfully')
    } catch (err) {
      console.error('Sharing failed:', err)
    }
  } else {
    alert('Sharing is not supported on this device.')
  }
}

watch(() => route.query.slug, () => {
  if (videos.value && videos.value.length && videos.value[currentIndex.value]?.videoUrl) {
    const index = videos.value.findIndex((v: Video) => v.slug === route.query.slug)
    currentIndex.value = index >= 0 ? index : 0
    initPlayer(videos.value[currentIndex.value].videoUrl)
    // isMuted.value = true
  }
})

onMounted(() => {
  if (videos.value && videos.value.length && videos.value[currentIndex.value]?.videoUrl) {
    const index = videos.value.findIndex((v: Video) => v.slug === route.query.slug)
    currentIndex.value = index >= 0 ? index : 0
    initPlayer(videos.value[currentIndex.value].videoUrl)
    isMuted.value = true
  }
})

onUnmounted(() => {
  if (hls.value) hls.value.destroy()
})

const toggleLike = async (id: number) => {
  if(videoLike.isLiked(id)) {
    await useVideos.unlikeVideo(id)
    if(videos.value[currentIndex.value]) videos.value[currentIndex.value].likes--
  } else {
    await useVideos.likeVideo(id)
    if(videos.value[currentIndex.value]) videos.value[currentIndex.value].likes++
  }
  videoLike.toggleLike(id)
}
</script>

<template>
  <div>
    <div v-if="loading" class="min-h-screen bg-background flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p class="text-muted-foreground">Loading videos...</p>
      </div>
    </div>
    <div v-else-if="videos && videos.length" class="min-h-screen bg-background flex flex-col lg:flex-row">
      <div class="lg:w-1/2 xl:w-3/5 bg-black p-3 relative flex items-center justify-center">
        <VButton
          variant="ghost"
          size="sm"
          class="absolute top-4 font-bold left-4 z-10 text-white bg-white/20"
          @click="router.push('/')"
        >
          <ArrowLeft class="w-5 h-5" />
        </VButton>
        <div class="relative max-w-sm w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref="videoRef"
            class="w-full h-full object-cover cursor-pointer"
            playsinline
            muted
            autoplay
            :poster="videos[currentIndex].thumbnailUrl"
            preload="metadata"
            @click="togglePlay"
          />
          <div v-if="!isPlaying" class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="bg-black/50 rounded-full p-4">
              <Play class="w-12 h-12 text-white fill-white" />
            </div>
          </div>
          <VButton
            variant="ghost"
            size="sm"
            class="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full p-2"
            @click="toggleMute"
          >
            <component :is="isMuted ? VolumeX : Volume2" class="w-5 h-5" />
          </VButton>
          <div class="absolute bottom-4 left-4 right-4 text-white">
            <h2 class="font-bold text-lg mb-2">{{ videos[currentIndex].title }}</h2>
            <div class="flex items-center justify-between text-sm opacity-90">
              <span>{{ videos[currentIndex].views }} views</span>
              <div class="flex items-center space-x-4">
                <button
                  class="flex items-center space-x-1 hover:scale-110 transition-transform"
                  @click="toggleLike(videos[currentIndex].id)"
                >
                  <Heart :class="['w-5 h-5', videoLike.isLiked(videos[currentIndex].id) ? 'fill-red-500 text-red-500' : '']" />
                  <span>{{ videos[currentIndex].likes }}</span>
                </button>
                <button
                  class="hover:scale-110 transition-transform"
                  @click="shareVideo"
                >
                  <Share2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
          <VButton
            variant="ghost"
            size="sm"
            class="text-white bg-white/20 rounded-full p-2"
            :disabled="currentIndex === 0"
            @click="prevVideo"
          >
            <ArrowUp class="w-6 h-6" />
          </VButton>
          <VButton
            variant="ghost"
            size="sm"
            class="text-white bg-white/20 rounded-full p-2"
            :disabled="currentIndex === videos.length - 1"
            @click="nextVideo"
          >
            <ArrowDown class="w-6 h-6 font-bold" />
          </VButton>
        </div>
      </div>
      <div class="lg:w-1/2 xl:w-2/5 bg-card p-6 lg:p-8 max-h-screen overflow-y-auto">
        <div class="max-w-lg mx-auto space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-foreground mb-3">
              {{ videos[currentIndex]?.title }}
            </h1>
            <div
              v-if="videos[currentIndex]?.description"
              v-html="videos[currentIndex]?.description"
            />
          </div>
          <div class="space-y-3 pt-4">
            <VButton
              class="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105"
              @click="openAmazonLink(videos[currentIndex].amazonLink)"
            >
              <ShoppingCart class="w-5 h-5 mr-2" />
              Buy It Now
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
