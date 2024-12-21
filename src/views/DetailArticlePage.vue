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
          :src="artikelDetails?.imageLink"
          alt="artikelDetails?.title"
          class="news-image"
        ></ion-img>
        <div class="news-content">
          <h1 class="news-title">{{ artikelDetails?.title }}</h1>
          <p class="news-date">{{ artikelDetails?.tanggal }}</p>
          <div class="news-body">
            <p>
              {{ artikelDetails?.description }}
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

// Define an interface for the article details
interface ArtikelDetails {
  imageLink: string;
  title: string;
  tanggal: string;
  description: string;
}

// Mengambil parameter artikelId dari URL
const router = useRouter();
const route = useRoute();
const artikelId = route.params.artikelId;

const loading = ref(true);

// Initialize artikelDetails as an empty object
const artikelDetails = ref<ArtikelDetails>({
  imageLink: "",
  title: "",
  tanggal: "",
  description: "",
});

// Fetch article details from Firestore
const fetchArtikel = async () => {
  try {
    // Query for the article document by 'id'
    const artikelRef = collection(dataBase, "articles");
    const q = query(artikelRef, where("id", "==", artikelId));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        artikelDetails.value = doc.data() as ArtikelDetails;
        console.log("Article found:", artikelDetails.value);
      });
    } else {
      console.log("Article not found with the provided ID.");
    }
  } catch (error) {
    console.error("Error fetching article:", error);
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
</style>
