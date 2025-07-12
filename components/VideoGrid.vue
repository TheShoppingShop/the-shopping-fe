<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import VideoCard from '@/components/VideoCard.vue'
import type {Video} from '@/types'

interface Props {
  videos: Video[]
  loading: boolean
  changeCategoryLoading: boolean
}

interface Emits {
  (e: 'next-page'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()


const loadMore = () => {
  if(!props.loading) {
    emits('next-page')
  }
}

const handleScroll = () => {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000
  if (nearBottom) {
    loadMore()
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
  <div class="w-full">
    <div v-if="changeCategoryLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <VideoCard
        v-for="(video, index) in videos"
        :key="`${video.id}-${index}`"
        :video="video"
      />
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  </div>
</template>
