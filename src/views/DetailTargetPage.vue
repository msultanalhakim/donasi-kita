<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- header -->
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="router.push('/target')" fill="clear" color="dark">
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
      <div v-if="targetDetails" class="news-detail-container">
        <ion-img
          :src="targetDetails.imageLink"
          alt="targetDetails.name"
          class="news-image"
        ></ion-img>
        <div class="news-content">
          <h1 class="news-title">{{ targetDetails.name }}</h1>
          <div class="news-body">
            <p>{{ targetDetails.description }}</p>
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
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { dataBase } from "@/firebase";

// Definisi tipe data untuk targetDetails
interface TargetDetails {
  imageLink: string;
  name: string;
  description: string;
}

// Router dan Route
const router = useRouter();
const route = useRoute();
const targetId = route.params.targetId as string; // pastikan ini string

// Reactive state
const loading = ref(true);
const targetDetails = ref<TargetDetails | null>(null);

// Fungsi untuk mengambil artikel
const fetchArtikel = async () => {
  try {
    const artikelRef = doc(dataBase, "donation-targets", targetId); // Use doc() to reference a specific document

    const docSnapshot = await getDoc(artikelRef);
    if (docSnapshot.exists()) {
      targetDetails.value = docSnapshot.data() as TargetDetails;
      console.log("Donasi ditemukan:", targetDetails.value);
    } else {
      console.log("Donasi tidak ditemukan dengan ID yang diberikan.");
    }
  } catch (error) {
    console.error("Error fetching donation:", error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle hook
onMounted(fetchArtikel);
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

.news-body p {
  text-align: justify;
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
