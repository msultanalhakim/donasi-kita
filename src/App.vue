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
interface User {
  role: string;
  // properti lainnya
}
const user = ref<User | null>(null); // user bisa null atau objek dengan role
const routeName = route.name as string | undefined;

// Menentukan halaman mana yang harus menampilkan Bottombar
const showTabs = computed(() => {
  const visibleRoutes = ["Home", "Beranda", "Pengaturan", "Artikel", "Profile", "Target"];
  return route.name && visibleRoutes.includes(route.name as string);
});

// Akses authStore
const authStore = useAuthStore();

//rute
const guestRoute = ["Login", "Register"];
const adminRoute = [
  "Dashboard",
  "ManageUser",
  "ManageUserAdd",
  "ManageUserEdit",
  "ManageTarget",
  "ManageTargetAdd",
  "ManageCategory",
  "ManageCategoryAdd",
  "ManageCategoryEdit",
  "ManageArticle",
  "ManageArticleAdd",
  "ManageArticleEdit",
  "ManageDonation",
  "ManageDonationAdd",
  "ManageDonationEdit",
];

// Pantau perubahan auth dan navigasi
onMounted(async () => {
  await authStore.loadUserFromLocalStorage();
  user.value = authStore.currentUser;

  if (!authStore.isAuthenticated() && !guestRoute.includes(route.name as string)) {
    alert("Anda tidak memiliki izin untuk mengakses halaman ini.");
    await router.replace("/login");
    window.location.reload();
  }
  // Jika user mencoba mengakses halaman admin tetapi tidak memiliki izin
  if (
    routeName && // Pastikan route.name tidak null atau undefined
    adminRoute.includes(routeName) &&
    (!user.value || !(user.value.role === "Administrator" || user.value.role === "Admin"))
  ) {
    alert("Anda tidak memiliki izin untuk mengakses halaman ini.");
    await router.replace("/home"); // Navigasi ke halaman home
    return; // Hentikan eksekusi lebih lanjut
  }
});

watch([() => user.value, () => route.name], async ([currentUser, currentRoute]) => {
  if (currentUser && guestRoute.includes(currentRoute as string)) {
    await router.replace("/home");
    alert("Anda Sudah Melakukan Login");
    window.location.reload();
  }

  if (
    adminRoute.includes(currentRoute as string) &&
    (!currentUser ||
      !(currentUser.role === "Administrator" || currentUser.role === "Admin"))
  ) {
    await router.replace("/home");
    alert("Anda tidak memiliki izin untuk mengakses halaman ini.");
    window.location.reload();
  }
});
</script>
