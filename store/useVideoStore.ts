import { defineStore } from 'pinia'
import type {Video, VideosParams} from "@/types/videos.types";
import type {ResponsePagination} from "@/types/global.types";

export const useVideoStore = defineStore('video', () => {
  const { $apiFetch } = useNuxtApp();
  const videos = ref<ResponsePagination<Video>>({
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const getVideos = async (params?: VideosParams, filter?: boolean): Promise<ResponsePagination<Video>> => {
    if (videos.value.data.length && !filter) return videos.value
    try {
      const data = await $apiFetch<ResponsePagination<Video>>("/videos", {
        method: "get",
        params
      });
      videos.value = data;
      return data
    } catch (err: unknown) {
      console.error("getNews error:", err);
      return videos.value;
    }
  };

  const getSuggestVideos = async (search?: string): Promise<ResponsePagination<Video>> => {
    try {
      return await $apiFetch<Video[]>("/videos/suggest", {
        method: "get",
        params: {
          q: search
        }
      });
    } catch (err: unknown) {
      console.error("getNews error:", err);
      return []
    }
  };

  const getLikedVideos = async (ids: number[]): Promise<Video[] | []> => {
    try {
      return await $apiFetch<ResponsePagination<Video>>("/videos/liked", {
        method: "get",
        params: {
          ids
        }
      });
    } catch (err: unknown) {
      console.error("getNews error:", err);
      return []
    }
  };

  const getVideosWithSlug = async (slug: string, params?: VideosParams): Promise<ResponsePagination<Video> | []> => {
    try {
      return await $apiFetch<ResponsePagination<Video>>(`videos/related/${slug}`, {
        method: "get",
        params
      });
    } catch (err: unknown) {
      console.error("getNews error:", err);
      return []
    }
  };

  const getVideo = async (slug: string): Promise<Video> => {
    try {
      return await $apiFetch<Video>(`/videos/${slug}`, {
        method: "get"
      });
    } catch (err: unknown) {
      console.error("getNews error:", err);
      return videos.value.data[0]
    }
  };

  const likeVideo = async (videoId: number) => {
    try {
      await $apiFetch(`/videos/${videoId}/like`, {
        method: "post"
      });
    } catch (err: unknown) {
      console.error("getNews error:", err);
    }
  };

  const unlikeVideo = async (videoId: number) => {
    try {
      await $apiFetch(`/videos/${videoId}/unlike`, {
        method: "post"
      });
    } catch (err: unknown) {
      console.error("getNews error:", err);
    }
  };

  return {
    videos,
    getVideos,
    getVideo,
    getVideosWithSlug,
    likeVideo,
    unlikeVideo,
    getLikedVideos,
    getSuggestVideos
  }
})
