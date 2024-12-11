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

// Cek apakah pengguna terautentikasi
const isAuthenticated = computed(() => authStore.isAuthenticated());

// Ambil user data dari store
const currentUser = computed(() => authStore.currentUser);

onMounted(() => {
  // Memantau perubahan status login di console
  authStore.$subscribe(() => {
    if (authStore.isAuthenticated()) {
      console.log("Current User:", authStore.currentUser);
    } else {
      console.log("User logged out", authStore.currentUser);
    }
  });
});
</script>
