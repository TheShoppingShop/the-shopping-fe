<script setup lang="ts">
import { useRouter } from 'vue-router'
import {Search, Menu, Heart} from 'lucide-vue-next'
import VButton from '@/components/ui/VButton.vue'
import Input from '@/components/ui/VInput.vue'
import {debounce} from "lodash";
import { defineModel } from 'vue'
// import VAvatar from '@/components/ui/VAvatar.vue'

interface Emits {
  (e: 'update-videos'): void
}

const emit = defineEmits<Emits>()

const router = useRouter()

const search = defineModel('search', {type: String, default: ''})

const handleProfileClick = () => {
  router.push('/profile')
}

const goHome = () => {
  router.push('/')
}

const startSearch = debounce(() => {
  emit('update-videos')
}, 400)
</script>

<template>
  <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo & Menu -->
      <div class="flex items-center space-x-4">
        <VButton variant="ghost" size="sm" class="md:hidden">
          <Menu class="h-5 w-5" />
        </VButton>
        <h1
          class="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent cursor-pointer"
          @click="goHome"
        >
          TheShopping
        </h1>
      </div>

      <!-- Search -->
      <div class="hidden md:flex flex-1 max-w-md mx-8">
        <div class="relative w-full">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trending products..."
            class="pl-10 border-muted-foreground/20 focus:border-primary rounded-full"
            style="border-radius: 9999px"
            v-model:value="search"
            @input="startSearch"
          />
        </div>
      </div>

      <!-- Icons & Avatar -->
      <div class="flex items-center space-x-2">
        <VButton variant="ghost" size="sm" class="md:hidden">
          <Search class="h-5 w-5" />
        </VButton>

<!--        <VAvatar-->
<!--          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"-->
<!--          class="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all duration-200"-->
<!--          @click="handleProfileClick"-->
<!--        />-->
        <Heart
          class="h-6 w-6 cursor-pointer text-gray-500"
          @click="handleProfileClick"
        />
      </div>
    </div>
  </header>
</template>
