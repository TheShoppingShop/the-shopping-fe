<script setup lang="ts">
import { ref } from 'vue'
import { Play, X, Heart } from 'lucide-vue-next'
import VCard from "~/components/ui/card/VCard.vue";
import VCardContent from "~/components/ui/card/VCardContent.vue";
import VButton from "~/components/ui/VButton.vue";

/* ---- mock maʼlumot ---- */
interface Video {
  id: string
  thumbnail: string
  title: string
  price: string
}
const likedVideos: Video[] = [
  { id: '1', thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop', title: 'Amazing Kitchen Gadget Review', price: '$29.99' },
  { id: '2', thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop', title: 'Fashion Haul 2024', price: '$89.99' },
  { id: '3', thumbnail: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=400&fit=crop', title: 'Tech Review: Best Headphones', price: '$199.99' },
  { id: '4', thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=400&fit=crop', title: 'Beauty Products Unboxing', price: '$45.99' },
  { id: '5', thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=400&fit=crop', title: 'Home Decor Ideas', price: '$79.99' },
  { id: '6', thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop', title: 'Sneaker Collection Review', price: '$129.99' }
]

/* ---- reaktiv holat ---- */
const videos = ref<Video[]>([...likedVideos])

/* ---- handlerlar ---- */
const removeVideo = (id: string) => {
  videos.value = videos.value.filter(v => v.id !== id)
}
const playVideo = (id: string) => {
  console.log('Playing video:', id)
  // TODO: navigate or open player
}
</script>

<template>
  <!-- Agar ro‘yxat bo‘sh bo‘lsa -->
  <VCard v-if="videos.length === 0">
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
        {{ videos.length }} video{{ videos.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <VCard
        v-for="video in videos"
        :key="video.id"
        class="group overflow-hidden"
      >
        <!-- Thumbnail -->
        <div class="relative aspect-[13/16] overflow-hidden">
          <img
            :src="video.thumbnail"
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
                @click="playVideo(video.id)"
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
          <div
            class="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold"
          >
            {{ video.price }}
          </div>
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
