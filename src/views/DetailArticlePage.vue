<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- header -->
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="router.push('/artikel')" fill="clear" color="dark">
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
          :src="artikelDetails.imageLink"
          alt="newsDetail.title"
          class="news-image"
        ></ion-img>
        <div class="news-content">
          <h1 class="news-title">{{ artikelDetails.title }}</h1>
          <p class="news-date">{{ artikelDetails.tanggal }}</p>
          <div class="news-body">
            <p>
              {{ artikelDetails.description }}
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
import { collection, getDocs, query, where } from "firebase/firestore";
import { dataBase } from "@/firebase";

// Mengambil parameter donasiId dari URL
const router = useRouter();
const route = useRoute();
const artikelId = route.params.artikelId;

const loading = ref(true);
const artikelDetails = ref({});

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

const fetchArtikel = async () => {
  try {
    // Query untuk mencari dokumen dengan field tertentu (misalnya 'id' bukan ID Firestore)
    const artikelRef = collection(dataBase, "articles");
    const q = query(artikelRef, where("id", "==", artikelId)); // Misalnya 'id' adalah field dalam dokumen

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        artikelDetails.value = doc.data();
        console.log("Donasi ditemukan:", artikelDetails.value);
      });
    } else {
      console.log("Donasi tidak ditemukan dengan ID yang diberikan.");
    }
  } catch (error) {
    console.error("Error fetching donation:", error);
  }
};

onMounted(async () => {
  await fetchArtikel();
  console.log(artikelDetails.value);
  loading.value = false;
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

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #85a98f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-icon {
  font-size: 50px;
  color: #28a745; /* Hijau sukses */
  animation: pulse-success 1.5s infinite;
}

@keyframes pulse-success {
  0%,
  100% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.7);
  }
}
</style>
