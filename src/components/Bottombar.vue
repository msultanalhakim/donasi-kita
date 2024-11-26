<!-- eslint-disable vue/multi-word-component-names -->
<!-- Bottombar.vue -->
<template>
  <ion-tabs>
    <ion-router-outlet></ion-router-outlet>

    <ion-tab-bar slot="bottom" class="custom-tab-bar">
      <ion-tab-button tab="Home" href="/beranda">
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
ion-tabs {
  padding: 10px 10px;
  background-color: white;
}
ion-tab-bar {
  margin-block: 10px;
  border-radius: 500px;
  width: 100%;
  height: 60px; /* Tinggi Bottombar */
  --background: #295c9e;
}

ion-tab-button {
  --color-selected: rgb(255, 255, 255);
  --color: rgb(0, 0, 0);
}
</style>
