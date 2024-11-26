<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
  <Bottombar v-if="showTabs" />
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import Bottombar from "@/components/Bottombar.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const showTabs = computed(() => {
  // Nama halaman yang menampilkan Bottombar
  const visibleRoutes = ["Beranda", "Pengaturan", "Berita"];
  return visibleRoutes.includes(route.name);
});
</script>
