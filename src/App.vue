<template>
  <ion-app>
    <ion-router-outlet />
    <Bottombar v-if="showTabs" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import Bottombar from "@/components/Bottombar.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useAuthStore } from "./authStore";
import router from "./router";
import ManageUserPage from "./views/admin/manage/users/ManageUserPage.vue";

const route = useRoute();
const user = ref("");

// Menentukan halaman mana yang harus menampilkan Bottombar
const showTabs = computed(() => {
  const visibleRoutes = ["Home", "Beranda", "Pengaturan", "Artikel", "Profile"];
  return route.name && visibleRoutes.includes(route.name as string);
});

// Akses authStore
const authStore = useAuthStore();

//rute
const guestRoute = ["Login", "Register"];
const adminRoute = ["ManageUser", "ManageTarget", "ManageCategory"];

// Pantau perubahan auth dan navigasi
onMounted(async () => {
  await authStore.loadUserFromLocalStorage(); // Ambil data dari localStorage
  user.value = authStore.currentUser;
  console.log("Info user", user.value);

  // // Cek jika pengguna belum login, alihkan ke login
  // if (!authStore.isAuthenticated()) {
  //   if (["Login", "Register"].includes(route.name as string)) {
  //     return; // Biarkan pengguna tetap di halaman login/register
  //   }
  //   alert("Anda melakukan hal ilegal");
  //   router.replace("/login"); // Arahkan ke login jika belum login
  // }
});

watch([() => authStore.currentUser, () => route.name], ([x, y]) => {
  if (x && guestRoute.includes(y as string)) {
    router.replace("/home"); // Arahkan ke Home jika sudah login
  }
  // Jika pengguna bukan admin dan mencoba akses halaman admin
  if (
    adminRoute.includes(y as string) &&
    (!x || (x.role !== "Administrator" && x.role !== "Admin"))
  ) {
    router.replace("/home");
    alert("Anda tidak memiliki izin untuk mengakses halaman ini.");
  }
});
</script>
