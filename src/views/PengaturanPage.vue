<template>
  <ion-page>
    <ion-content>
      <!-- Header -->
      <ion-header>
        <ion-toolbar>
          <ion-title>Pengaturan</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Konten Pengaturan -->
      <ion-list>
        <!-- Kelola Akun -->
        <ion-item button @click="goToManageAccount">
          <ion-label>Kelola Akun</ion-label>
          <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>
        </ion-item>

        <!-- Profil Pengguna -->
        <ion-item button @click="goToEditProfile">
          <ion-label>Profil Pengguna</ion-label>
          <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>
        </ion-item>

        <!-- Pengaturan Notifikasi -->
        <ion-item button @click="goToEditProfile">
          <ion-label>Notifikasi</ion-label>
          <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>
        </ion-item>

        <!-- Tema Gelap/Terang -->
        <ion-item button @click="goToEditProfile">
          <ion-label>Tema</ion-label>
          <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>
        </ion-item>

        <!-- Tentang Aplikasi -->
        <ion-item button @click="goToAboutApp">
          <ion-label>Tentang Aplikasi</ion-label>
          <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { IonPage } from "@ionic/vue";

const isDarkMode = ref(false); // Mode Gelap
const isNotificationEnabled = ref(true); // Notifikasi

const router = useRouter();

// Fungsi untuk mengubah mode gelap
const toggleDarkMode = () => {
  if (isDarkMode.value) {
    document.body.setAttribute("color-theme", "dark");
  } else {
    document.body.removeAttribute("color-theme");
  }
};

// Fungsi untuk mengubah pengaturan notifikasi
const toggleNotification = () => {
  console.log("Notifikasi diubah:", isNotificationEnabled.value);
};

// Fungsi navigasi ke halaman Kelola Akun
const goToManageAccount = () => {
  router.push("/manage-account");
};

// Fungsi navigasi ke halaman Edit Profil
const goToEditProfile = () => {
  router.push("/edit-profile");
};

// Fungsi navigasi ke halaman Tentang Aplikasi
const goToAboutApp = () => {
  router.push("/about-app");
};

// Fungsi untuk logout
const logout = () => {
  // Implementasikan logika logout
  console.log("Logout berhasil");
  router.push("/login");
};
</script>

<style scoped>
ion-content {
  --padding-bottom: 60px;
}

ion-item {
  --inner-padding-start: 10px;
  --inner-padding-end: 10px;
}

ion-button {
  margin-top: 20px;
}
</style>
