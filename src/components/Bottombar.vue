<!-- Bottombar.vue -->
<template>
  <ion-tabs>
    <ion-router-outlet></ion-router-outlet>

    <!-- Tab Bar at the Bottom -->
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="Home" href="/home">
        <ion-icon :icon="home" class="tab-icon"></ion-icon>
        <ion-label class="tab-label">Home</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="Discover" href="/beranda">
        <ion-icon :icon="compass" class="tab-icon"></ion-icon>
        <ion-label class="tab-label">Beranda</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="Donasi" href="/donation-menu">
        <ion-icon :icon="giftSharp" class="tab-icon"></ion-icon>
        <ion-label class="tab-label">Donasi</ion-label>
      </ion-tab-button>

      <!-- <ion-tab-button tab="Wishlist" href="/wishlist">
        <ion-icon :icon="heart" class="tab-icon"></ion-icon>
        <ion-label class="tab-label">Wishlist</ion-label>
      </ion-tab-button> -->

      <ion-tab-button tab="Chat" href="/chat">
        <ion-icon :icon="chatbubbles" class="tab-icon"></ion-icon>
        <ion-label class="tab-label">Chat</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="Profile" href="/profile">
        <ion-icon :icon="person" class="tab-icon"></ion-icon>
        <ion-label class="tab-label">Profile</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup>
import {
  IonHeader,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/vue";
import {
  home,
  compass,
  heart,
  chatbubbles,
  person,
  giftSharp,
} from "ionicons/icons";
</script>

<style scoped>
/* Styling for the bottom tab bar */
ion-tab-bar {
  width: 100%;
  height: 70px;
  border-radius: 30px 30px 0 0; /* Rounded top corners for bottom bar */
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

/* Styling for each tab button */
ion-tab-button {
  --color-selected: #85a98f; /* Green for selected tab */
  --color: #6b7280; /* Gray for unselected tab */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Styling for icons */
.tab-icon {
  font-size: 24px; /* Medium icon size */
  margin-bottom: 5px;
  transition: transform 0.3s ease-in-out; /* Smooth effect for icon scaling */
}

/* Styling for labels */
.tab-label {
  font-size: 12px;
  font-weight: 500;
  color: #525b44;
  opacity: 0.8;
  transition: opacity 0.3s ease-in-out; /* Smooth transition for opacity */
}

/* When tab is selected, enhance the icon and label */
ion-tab-button[tab-selected] .tab-icon {
  transform: scale(1.2); /* Slightly enlarge icon when selected */
}

ion-tab-button[tab-selected] .tab-label {
  opacity: 1; /* Full opacity for selected label */
  color: #85a98f;
}

/* Optional: Add hover effect for desktop */
@media (hover: hover) {
  ion-tab-button:hover {
    background-color: rgba(0, 0, 0, 0.05); /* Light background on hover */
  }
}
</style>
