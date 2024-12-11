<template>
  <ion-app>
    <ion-router-outlet />
    <Bottombar v-if="showTabs" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import Bottombar from "@/components/Bottombar.vue";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useAuthStore } from "./authStore";

const route = useRoute();

// Menentukan halaman mana yang harus menampilkan Bottombar
const showTabs = computed(() => {
  const visibleRoutes = ["Home", "Beranda", "Pengaturan", "Berita", "Profile"];
  return route.name && visibleRoutes.includes(route.name as string);
});

// Akses authStore
const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();

  // Memantau perubahan status login di console
  authStore.$subscribe(() => {
    if (authStore.isAuthenticated()) {
      console.log("User logged in:", authStore.currentUser);
    } else {
      console.log("User logged out");
    }
  });
});
</script>
