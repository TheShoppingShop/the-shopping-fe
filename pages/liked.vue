<script setup lang="ts">
import { ref } from 'vue'

import Header from '@/components/MainHeader.vue'
// import ProfileSidebar from '@/components/ProfileSidebar.vue'
import ProfileInfo from '@/components/ProfileInfo.vue'
import LikedVideos from '@/components/LikedVideos.vue'

type Section = 'profile' | 'liked'

/* faollik holati */
const activeSection = ref<Section>('liked')
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Top header -->
    <Header />

    <!-- Body -->
    <div class="container mx-auto px-4 py-6 flex-1">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
<!--        <div class="lg:col-span-1">-->
<!--          <ProfileSidebar-->
<!--            :active-section="activeSection"-->
<!--            @section-change="section => (activeSection = section)"-->
<!--          />-->
<!--        </div>-->

        <!-- Main content -->
<!--        class="lg:col-span-3"-->
        <div class="lg:col-span-4">
          <ProfileInfo v-if="activeSection === 'profile'" />
          <LikedVideos v-else />
        </div>
      </div>
    </div>
  </div>
</template>
