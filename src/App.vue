<template>
  <ion-app>
    <ion-router-outlet />
    <Bottombar v-if="showTabs" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import Bottombar from "@/components/Bottombar.vue";
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import { useAuthStore } from "./authStore";
import router from "./router";

const route = useRoute();

// Menentukan halaman mana yang harus menampilkan Bottombar
const showTabs = computed(() => {
  const visibleRoutes = ["Home", "Beranda", "Pengaturan", "Berita", "Profile"];
  return route.name && visibleRoutes.includes(route.name as string);
});

// Akses authStore
const authStore = useAuthStore();

// Pantau perubahan auth dan navigasi
onMounted(() => {
  authStore.loadUserFromLocalStorage(); // Ambil data dari localStorage

  // // Cek jika pengguna belum login, alihkan ke login
  // if (!authStore.isAuthenticated()) {
  //   if (["Login", "Register"].includes(route.name as string)) {
  //     return; // Biarkan pengguna tetap di halaman login/register
  //   }
  //   router.replace("/login"); // Arahkan ke login jika belum login
  // }
});

// watch(
//   () => authStore.currentUser,
//   (user) => {
//     if (user && ["Login", "Register"].includes(route.name as string)) {
//       router.replace("/home"); // Arahkan ke Home jika sudah login
//     }
//   }
// );
</script>
