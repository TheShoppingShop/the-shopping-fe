<script setup>
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

// onMounted(() => {
//   toast.success('Xush kelibsiz!')
// })
</script>

<template>
  <div>
    <Toaster position="top-right" rich-colors theme="light" close-button />
    <NuxtPage />
  </div>
</template>
