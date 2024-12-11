<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="router.push('/home')" fill="clear" color="dark">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="title"> Menu Donasi </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content
      :fullscreen="true"
      scroll-assist="false"
      scroll-padding="false"
    >
      <div class="ion-padding donation-page">
        <div class="box-container">
          <div class="category-section">
            <div class="category-grid">
              <!-- Tipe Menu -->

              <div class="icon-box" @click="goToDonationForm('Pakaian')">
                <div class="icon-container">
                  <ion-icon :icon="shirt" class="category-icon"></ion-icon>
                </div>
                <span class="category-name">Clothing </span>
              </div>

              <div class="icon-box" @click="goToDonationForm('Elektronik')">
                <div class="icon-container">
                  <ion-icon
                    :icon="phonePortrait"
                    class="category-icon"
                  ></ion-icon>
                </div>
                <span class="category-name">Electronics </span>
              </div>

              <div class="icon-box" @click="goToDonationForm('Kendaraan')">
                <div class="icon-container">
                  <ion-icon :icon="bicycle" class="category-icon"></ion-icon>
                </div>
                <span class="category-name">Vehicles </span>
              </div>

              <div class="icon-box" @click="goToDonationForm('Buku')">
                <div class="icon-container">
                  <ion-icon :icon="book" class="category-icon"></ion-icon>
                </div>
                <span class="category-name">Books</span>
              </div>

              <div class="icon-box" @click="goToDonationForm('Mainan')">
                <div class="icon-container">
                  <ion-icon
                    :icon="gameController"
                    class="category-icon"
                  ></ion-icon>
                </div>
                <span class="category-name">Toy & Games</span>
              </div>

              <div class="icon-box" @click="goToDonationForm('Aksesoris')">
                <div class="icon-container">
                  <ion-icon :icon="bag" class="category-icon"></ion-icon>
                </div>
                <span class="category-name">Accessories</span>
              </div>

              <div class="icon-box">
                <div class="icon-container">
                  <ion-icon :icon="newspaper" class="category-icon"></ion-icon>
                </div>
                <span class="category-name">History</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import router from "@/router";
import {
  shirt,
  phonePortrait,
  bicycle,
  book,
  gameController,
  bag,
  newspaper,
  arrowBack,
} from "ionicons/icons";
import { ref } from "vue";

const goToDonationForm = (id: string) => {
  if (id === "Pakaian") {
    router.push({
      path: "/donation-form",
      query: {
        type: "Pakaian",
        icon: shirt,
      },
    });
  }
  if (id === "Elektronik") {
    router.push({
      path: "/donation-form",
      query: {
        type: "Elektronik",
        icon: phonePortrait,
      },
    });
  }
  if (id === "Kendaraan") {
    router.push({
      path: "/donation-form",
      query: {
        type: "Kendaraan",
        icon: bicycle,
      },
    });
  }

  if (id === "Buku") {
    router.push({
      path: "/donation-form",
      query: {
        type: "Buku",
        icon: book,
      },
    });
  }

  if (id === "Mainan") {
    router.push({
      path: "/donation-form",
      query: {
        type: "Mainan",
        icon: gameController,
      },
    });
  }

  if (id === "Aksesoris") {
    router.push({
      path: "/donation-form",
      query: {
        type: "Aksesoris",
        icon: bag,
      },
    });
  }
};
</script>

<style scoped>
ion-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* Gaya halaman dan elemen */
.donation-page {
  display: flex;
  justify-content: center;
  height: 100%;
  background-color: #f9faff;
}

.box-container {
  margin-top: 0px;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
}

.category-section {
  padding: 10px 20px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 kolom */
  gap: 20px; /* Jarak antar elemen */
}

.icon-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #85a98f, #5a6c57);
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 2rem;
  color: #ffffff;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: #636363;
  margin-top: 8px;
}
</style>
