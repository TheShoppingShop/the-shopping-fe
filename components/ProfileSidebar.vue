<script setup lang="ts">
import { User, Heart, LogOut } from 'lucide-vue-next'

import VButton from '@/components/ui/VButton.vue'
import Card from '@/components/ui/card/VCard.vue'
import CardContent from '@/components/ui/card/VCardContent.vue'
import Separator from '@/components/ui/VSeparator.vue'

type Section = 'profile' | 'liked'

/* --- Props & Emits --- */
const props = defineProps<{
  activeSection: Section
}>()

const emit = defineEmits<{
  (e: 'section-change', section: Section): void
}>()

/* --- Handlers --- */
const changeSection = (section: Section) => emit('section-change', section)

const handleLogout = () => {
  // TODO: replace with real logout logic
  console.log('Logging out...')
}
</script>

<template>
  <Card class="h-fit">
    <CardContent class="p-6 space-y-4">
      <!-- Section buttons -->
      <div class="space-y-2">
        <VButton
          :variant="props.activeSection === 'profile' ? 'default' : 'ghost'"
          class="w-full justify-start"
          @click="changeSection('profile')"
        >
          <User class="mr-2 h-4 w-4" />
          Profile Info
        </VButton>

        <VButton
          :variant="props.activeSection === 'liked' ? 'default' : 'ghost'"
          class="w-full justify-start"
          @click="changeSection('liked')"
        >
          <Heart class="mr-2 h-4 w-4" />
          Liked Videos
        </VButton>
      </div>

      <Separator />

      <!-- Logout -->
      <VButton
        variant="ghost"
        class="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        @click="handleLogout"
      >
        <LogOut class="mr-2 h-4 w-4" />
        Logout
      </VButton>
    </CardContent>
  </Card>
</template>
