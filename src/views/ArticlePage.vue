<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- header -->
      <ion-header>
        <ion-toolbar>
          <ion-title class="title"> Berita </ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- loading -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- News Cards Section -->
      <div class="news-container">
        <div v-for="news in articles" :key="news.id" class="news-card">
          <ion-card>
            <ion-img :src="news.imageLink" alt="news.title"></ion-img>
            <ion-card-header>
              <ion-card-title>{{ news.title }}</ion-card-title>
              <ion-card-subtitle>{{ news.tanggalTeks }}</ion-card-subtitle>
            </ion-card-header>

            <ion-button
              class="berita-button"
              expand="block"
              @click="router.push(`/detail-artikel/${news.id}`)"
            >
              Baca Selengkapnya
            </ion-button>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { dataBase } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { arrowBack } from "ionicons/icons";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

// Define the Article interface
interface Article {
  id: string;
  imageLink: string;
  title: string;
  tanggalTeks: string;
}

const loading = ref(true);
const router = useRouter();
const articles = ref<Article[]>([]); // Initialize as an array of Article type

// Function to format Firestore date to string
const formatFirestoreDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric", // Ensure year is 'numeric' or '2-digit'
  };
  return new Intl.DateTimeFormat("id-ID", options).format(date);
};

// Function to fetch articles from Firestore
const fetchArticles = async () => {
  try {
    const querySnapshot = await getDocs(collection(dataBase, "articles"));
    articles.value = querySnapshot.docs.map((doc) => ({
      id: doc.data().id,
      imageLink: doc.data().imageLink,
      title: doc.data().title,
      tanggalTeks: formatFirestoreDate(doc.data().tanggal),
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
};

onMounted(async () => {
  await fetchArticles();
  loading.value = false;
});
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

/* Loading overlay */
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

/* Spinner for loading */
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
</style>
