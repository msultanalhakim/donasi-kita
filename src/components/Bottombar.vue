<!-- eslint-disable vue/multi-word-component-names -->
<!-- Bottombar.vue -->
<template>
  <ion-tabs>
    <ion-router-outlet></ion-router-outlet>

    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="Beranda" href="/beranda">
        <ion-icon :icon="home"></ion-icon>
        <ion-label>Beranda</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="Berita" href="/berita">
        <ion-icon :icon="newspaperOutline"></ion-icon>
        <ion-label>Berita</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="Pengaturan" href="/pengaturan">
        <ion-icon :icon="settings"></ion-icon>
        <ion-label>Pengaturan</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup>
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/vue";
import { home, newspaperOutline, settings } from "ionicons/icons";

// Ikon yang digunakan
// export { home, newspaperOutline, settings };
</script>

<style scoped>
ion-tab-bar {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px; /* Tinggi Bottombar */
  background-color: white; /* Warna latar tab */
  border-top: 1px solid #ccc; /* Opsional: garis atas */
  z-index: 10;
}
</style>
