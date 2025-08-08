<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import CategorySection from '@/components/CategorySection.vue'
import VideoGrid from '@/components/VideoGrid.vue'
import {useCategoryStore} from "@/store/useCategoryStore";
import {useVideoStore} from "~/store/useVideoStore";
import type {Category, ResponsePagination, Video, VideosParams} from '@/types'
import {ref} from "vue";


const useCategory = useCategoryStore();
const useVideos = useVideoStore();

const params = ref<VideosParams>({
  page: 1,
  limit: 10
})
const selectedCategoryId = ref<number>()
const filterLoading = ref(false)
const videoLoading = ref(false)
const getVideosByCategoryLoading = ref(false)

const { data: categories } = await useAsyncData<Category[]>("categories", () => useCategory.getCategories());
const { data: videos } = await useAsyncData<ResponsePagination<Video>>("videos", () => useVideos.getVideos(params.value, true));

const goToCategory = async (categoryId?: number) => {
  if(categoryId) {
    params.value.categoryId = categoryId
    selectedCategoryId.value = categoryId
  } else {
    delete params.value.categoryId
    selectedCategoryId.value = undefined
  }
  getVideosByCategoryLoading.value = true
  try {
    setTimeout(async () => {
      videos.value = await useVideos.getVideos(params.value, true);
    } ,2000)
  } catch (err: unknown) {
    console.error("goToCategory error:", err);
  } finally {
    setTimeout(() => {
      getVideosByCategoryLoading.value = false
    }, 2000)
  }
}

const getVideos = async (nextPage?: boolean) => {
  if(!videos.value) return
  if(!nextPage) videoLoading.value = true
  try {
    const data = await useVideos.getVideos(params.value, true);
    if(nextPage) videos.value.data = [...videos.value.data, ...data.data]
    else videos.value.data = data.data
  } catch (err) {
    console.error("getVideos error:", err);
  } finally {
    videoLoading.value = false
  }
}

const nextVideo = async () => {
  if(!videos.value || !params.value?.page || params.value.page >= videos.value.totalPages) return
  params.value.page++
  filterLoading.value = true
  await getVideos()
  setTimeout(() => {
    filterLoading.value = false
  }, 2000)
}

const updateVideoLikeCount = ({ id, liked }: { id: number; liked?: boolean }) => {
  const video = videos.value?.data?.find(v => v.id === id)
  if (video) {
    if (liked) video.likes++
    else video.likes--
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <MainHeader />
    <main class="container mx-auto px-4 py-6">
      <CategorySection
        v-if="categories"
        :categories="categories"
        @change-category="goToCategory"
      />
      <VideoGrid
        v-if="videos"
        :videos="videos.data"
        :loading="filterLoading"
        :change-category-loading="getVideosByCategoryLoading || videoLoading"
        @next-page="nextVideo"
        @update-like-count="updateVideoLikeCount($event)"
      />
    </main>
  </div>
</template>
