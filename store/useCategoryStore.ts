import { defineStore } from 'pinia'
import type {Category} from "@/types";

export const useCategoryStore = defineStore('category', () => {
  const { $apiFetch } = useNuxtApp();
  const categories = ref<Category[]>([])

  const getCategories = async (): Promise<Category[]> => {
    if (categories.value.length) return categories.value
    try {
      const data = await $apiFetch<Category[]>("/categories", {
        method: "get",
      });
      categories.value = data;
      return data
    } catch (err: unknown) {
      console.error("getNews error:", err);
      return categories.value;
    }
  };

  return {
    categories,
    getCategories
  }
})
