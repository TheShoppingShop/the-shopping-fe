<script setup lang="ts">
/* UI kit importlari (V-prefiks bilan) */
import VTabs         from '@/components/ui/tab/VTabs.vue'
import VTabsList     from '@/components/ui/tab/VTabsList.vue'
import VTabsTrigger  from '@/components/ui/tab/VTabsTrigger.vue'
import VTabsContent  from '@/components/ui/tab/VTabsContent.vue'

import VCard         from '@/components/ui/card/VCard.vue'
import VCardHeader   from '@/components/ui/card/VCardHeader.vue'
import VCardContent  from '@/components/ui/card/VCardContent.vue'

import LoginForm     from '@/components/LoginForm.vue'
import SignUpForm    from '@/components/SignUpForm.vue'
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <!-- Bitta ildiz VTabs -->
    <VTabs default-value="login" class="w-full max-w-md">
      <VCard class="shadow-lg">
        <!-- Header + tab list -->
        <VCardHeader class="space-y-6 pb-4">
          <div class="text-center">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              TheShopping
            </h1>
            <p class="text-sm text-muted-foreground mt-2">
              Discover trending products through videos
            </p>
          </div>

          <VTabsList class="grid w-full grid-cols-2">
            <VTabsTrigger value="login"  class="transition-all duration-200">Log In</VTabsTrigger>
            <VTabsTrigger value="signup" class="transition-all duration-200">Sign Up</VTabsTrigger>
          </VTabsList>
        </VCardHeader>

        <!-- Body (tab contents) -->
        <VCardContent class="space-y-6">
          <VTabsContent value="login"  class="mt-0"><LoginForm  /></VTabsContent>
          <VTabsContent value="signup" class="mt-0"><SignUpForm /></VTabsContent>
        </VCardContent>
      </VCard>
    </VTabs>
  </div>
</template>
