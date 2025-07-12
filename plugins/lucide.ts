import { defineNuxtPlugin } from '#app'
import * as lucide from 'lucide-vue-next'

export default defineNuxtPlugin(nuxtApp => {
  Object.entries(lucide).forEach(([name, component]) => {
    nuxtApp.vueApp.component(name, component)
  })
})
