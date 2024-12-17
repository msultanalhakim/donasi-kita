<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- header -->
      <ion-header>
        <ion-toolbar>
          <!-- <ion-buttons slot="start">
            <ion-button @click="router.push('/home')" fill="clear" color="dark">
              <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
            </ion-button>
          </ion-buttons> -->
          <ion-title class="title"> Berita </ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- News Cards Section -->
      <div class="news-container">
        <div v-for="news in newsList" :key="news.id" class="news-card">
          <ion-card>
            <ion-img :src="news.image" alt="news.title"></ion-img>
            <ion-card-header>
              <ion-card-title>{{ news.title }}</ion-card-title>
              <ion-card-subtitle>{{ news.date }}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <p>{{ news.summary }}</p>
            </ion-card-content>
            <ion-button class="berita-button" expand="block" @click="viewNews(news.id)">
              Baca Selengkapnya
            </ion-button>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { arrowBack } from "ionicons/icons";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Dummy data for news
const newsList = ref([
  {
    id: 1,
    title: "Pentingnya Donasi dalam Membantu Sesama",
    date: "15 Desember 2024",
    image: "https://via.placeholder.com/300x200",
    summary:
      "Donasi adalah cara sederhana untuk membuat perubahan besar di masyarakat kita.",
  },
  {
    id: 2,
    title: "Kisah Inspiratif dari Para Penerima Donasi",
    date: "14 Desember 2024",
    image: "https://via.placeholder.com/300x200",
    summary: "Cerita dari mereka yang telah terbantu melalui donasi Anda.",
  },
  {
    id: 3,
    title: "Bagaimana Anda Bisa Membantu di Tahun Baru",
    date: "13 Desember 2024",
    image: "https://via.placeholder.com/300x200",
    summary: "Ide-ide donasi untuk membawa semangat baru di tahun mendatang.",
  },
]);

const viewNews = (id: number) => {
  router.push(`/news/${id}`); // Replace with your detailed news route
};
</script>

<style scoped>
ion-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.news-container {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.news-card ion-card {
  --background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}

.news-card ion-img {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

ion-card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
}

ion-card-subtitle {
  font-size: 14px;
  color: #6c757d;
}

ion-card-content p {
  font-size: 14px;
  color: #5b5b5b;
  line-height: 1.6;
}

.berita-button {
  --background: #85a98f;
  --background-hover: #5a6c57;
  --background-activated: #525b44;
  --border-radius: 26px;
  transition: background-color 0.5s ease-in-out;
}
</style>
