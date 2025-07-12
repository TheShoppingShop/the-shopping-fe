<script setup lang="ts">
import Accordion from '@/components/ui/Accordion.vue'
import VButton from "~/components/ui/VButton.vue";
import { Check as IconCheck } from 'lucide-vue-next';
import VAvatar from "~/components/ui/VAvatar.vue";
import VInput from "~/components/ui/VInput.vue";
</script>

<template>
  <div>
    <button class="bg-red-500">salom</button>
    <Accordion
      :items="[
    { id: 'item-1', title: 'Accordion 1' },
    { id: 'item-2', title: 'Accordion 2' },
  ]"
    >
      <template #item-1>
        Content for accordion 1
      </template>
      <template #item-2>
        Content for accordion 2
      </template>
    </Accordion>
    <hr>
    <VButton>Default</VButton>
    <VButton variant="destructive">O'chirish</VButton>
    <VButton variant="ghost" size="sm">Yashirin tugma</VButton>
    <VButton size="icon"><IconCheck /></VButton>

    <hr>
    <VAvatar src="https://i.pravatar.cc/100" fallback="JS" />
    <VAvatar fallback="AB" />
    <VAvatar src="..." class="ring-2 ring-primary" />
    <hr>
    <VInput placeholder="Ismingizni kiriting" />
    <br>
    <VInput type="email" placeholder="Email manzil" class="bg-white" />
  </div>
</template>

<style scoped>

</style>
