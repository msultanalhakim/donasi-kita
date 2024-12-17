<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- header -->
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="router.push('/berita')" fill="clear" color="dark">
              <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <!-- loading -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- News Detail Content -->
      <div class="news-detail-container">
        <ion-img
          :src="newsDetail.image"
          alt="newsDetail.title"
          class="news-image"
        ></ion-img>
        <div class="news-content">
          <h1 class="news-title">{{ newsDetail.title }}</h1>
          <p class="news-date">{{ newsDetail.date }}</p>
          <div class="news-body">
            <p v-for="paragraph in newsDetail.body" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { arrowBack } from "ionicons/icons";
import { ref, onMounted } from "vue";

const router = useRouter();

// Dummy data for a single news article
const newsDetail = ref({
  title: "Pentingnya Donasi dalam Membantu Sesama",
  date: "15 Desember 2024",
  image: "https://via.placeholder.com/600x400",
  body: [
    "Donasi adalah cara sederhana untuk membuat perubahan besar di masyarakat kita.",
    "Melalui donasi, kita dapat membantu mereka yang membutuhkan dan memberikan harapan baru.",
  ],
});
</script>

<style scoped>
.news-detail-container {
  padding: 20px;
}

.news-image {
  width: 100%;
  height: auto;
  border-radius: 15px;
  margin-bottom: 20px;
}

.news-content {
  text-align: left;
}

.news-title {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10px;
}

.news-date {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 20px;
}

.news-body p {
  font-size: 16px;
  color: #5b5b5b;
  line-height: 1.8;
  margin-bottom: 15px;
}
</style>
