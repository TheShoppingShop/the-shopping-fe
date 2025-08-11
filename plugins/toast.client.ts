// import { defineNuxtPlugin } from '#app'
// import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
// import 'vue-toastification/dist/index.css'
//
// export default defineNuxtPlugin((nuxtApp) => {
//   const options: PluginOptions = {
//     position: POSITION.TOP_RIGHT,
//     timeout: 3000,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     showCloseButtonOnHover: false,
//     hideProgressBar: false,
//     icon: true,
//     transition: 'Vue-Toastification__fade',
//   }
//
//   nuxtApp.vueApp.use(Toast, options)
// })


import { defineNuxtPlugin } from '#app'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin(async (nuxtApp) => {
  const options: PluginOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
  }
  nuxtApp.vueApp.use(Toast, options)

  // only client: dinamik import -> useToast()
  const mod = await import('vue-toastification')
  const toast = mod.useToast()
  nuxtApp.provide('toast', toast)
})
