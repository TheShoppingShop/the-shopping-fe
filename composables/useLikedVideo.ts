import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'


const STORAGE_KEY = 'liked_video_ids'

const likedIds = ref<number[] | null>(null)

export function useLikedVideos() {
  const toast = useToast()

  // LocalStorage'dan boshlang‘ich qiymatni yuklash
  const loadFromStorage = () => {
    if (typeof localStorage === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    try {
      likedIds.value = stored ? JSON.parse(stored) : []
    } catch (err) {
      console.error(err);
      likedIds.value = []
    }
  }

  const saveToStorage = () => {
    if (likedIds.value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likedIds.value))
    }
  }

  const isLiked = (id: number): boolean => {
    if (!likedIds.value) return false
    return likedIds.value.includes(id)
  }

  const toggleLike = (id: number) => {
    if (!likedIds.value) return
    if (!localStorage.getItem('liked_video_warning_shown')) {
      toast.warning(
        'Your likes are temporarily stored in your browser and will be lost when you close it. Please log in to save them permanently.',
        {timeout: 5000}
      )
      localStorage.setItem('liked_video_warning_shown', 'true')
    }
    const index = likedIds.value.indexOf(id)
    if (index > -1) {
      likedIds.value = likedIds.value.filter((v) => v !== id)
    } else {
      likedIds.value = [...likedIds.value, id]
    }
    saveToStorage()
  }

  // LocalStorage dan faqat clientda yuklash
  onMounted(() => {
    if (likedIds.value === null) loadFromStorage()
  })

  return {
    likedIds,
    isLiked,
    toggleLike,
  }
}
