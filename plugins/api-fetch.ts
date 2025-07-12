export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  nuxtApp.provide('apiFetch', async <T>(url: string, options: any = {}) => {
    return await $fetch<T>(url, {
      baseURL: config.public.apiBase,
      ...options,
    });
  });
});
