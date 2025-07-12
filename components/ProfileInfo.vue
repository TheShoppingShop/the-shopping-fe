<template>
  <div class="space-y-6">
    <!-- Profile Header -->
    <VCard>
      <VCardHeader>
        <VCardTitle class="flex items-center justify-between">
          Profile Information
          <VButton variant="outline" size="sm">
            <Edit class="mr-2 h-4 w-4" />
            Edit
          </VButton>
        </VCardTitle>
      </VCardHeader>
      <VCardContent class="space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <VAvatar class="h-20 w-20">
            <VAvatarImage
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
              alt="User"
            />
            <VAvatarFallback class="bg-primary text-primary-foreground text-xl">
              JD
            </VAvatarFallback>
          </VAvatar>

          <div class="flex-1 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <VLabel for-label="firstName">First Name</VLabel>
                <VInput id="firstName" model-value="John" readonly />
              </div>
              <div class="space-y-2">
                <VLabel for="lastName">Last Name</VLabel>
                <VInput id="lastName" model-value="Doe" readonly />
              </div>
            </div>

            <div class="space-y-2">
              <VLabel for="email">Email</VLabel>
              <VInput id="email" type="email" model-value="john.doe@example.com" readonly />
            </div>
          </div>
        </div>
      </VCardContent>
    </VCard>

    <!-- Account Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <VCard>
        <VCardContent class="p-6 text-center">
          <div class="text-2xl font-bold text-primary">24</div>
          <div class="text-sm text-muted-foreground">Liked Videos</div>
        </VCardContent>
      </VCard>
      <VCard>
        <VCardContent class="p-6 text-center">
          <div class="text-2xl font-bold text-primary">12</div>
          <div class="text-sm text-muted-foreground">Shared Videos</div>
        </VCardContent>
      </VCard>
      <VCard>
        <VCardContent class="p-6 text-center">
          <div class="text-2xl font-bold text-primary">156</div>
          <div class="text-sm text-muted-foreground">Total Views</div>
        </VCardContent>
      </VCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit } from 'lucide-vue-next'

import VButton from '@/components/ui/VButton.vue'
import VInput from '@/components/ui/VInput.vue'
import VLabel from '@/components/ui/VLabel.vue'

import VCard from '@/components/ui/card/VCard.vue'
import VCardHeader from '@/components/ui/card/VCardHeader.vue'
import VCardTitle from '@/components/ui/card/VCardTitle.vue'
import VCardContent from '@/components/ui/card/VCardContent.vue'

import VAvatar from '@/components/ui/avatar/VAvatar.vue'
import VAvatarImage from '@/components/ui/avatar/VAvatarImage.vue'
import VAvatarFallback from '@/components/ui/avatar/VAvatarFallback.vue'
</script>
