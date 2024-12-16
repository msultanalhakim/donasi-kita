<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="router.push('/riwayat-donasi')" fill="clear" color="dark">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- main -->
    <ion-content :fullscreen="true" scroll-assist="false" scroll-padding="false">
      <div class="ion-padding donation-page">
        <div class="form-container">
          <!-- Icon Gerak -->
          <div class="waiting-icon-container">
            <ion-icon
              v-if="donationDetails.status == false"
              :icon="hourglass"
              class="waiting-icon"
            ></ion-icon>
            <ion-icon
              v-if="donationDetails.status == true"
              :icon="checkmarkCircle"
              class="success-icon"
            ></ion-icon>
          </div>

          <h1 v-if="donationDetails.status == false" class="title">
            Donasi Masih Dalam Proses Penyortiran
          </h1>
          <h1 v-else class="title">Donasi Sudah Diterima</h1>
          <p class="subtitle">Berikut adalah rincian donasi Anda</p>

          <!-- Penerima Donasi -->
          <ion-item class="form-input">
            <ion-label position="stacked">Penerima Donasi</ion-label>
            <ion-text>{{ donationDetails.penerima }}</ion-text>
          </ion-item>

          <!-- Barang yang didonasikan -->
          <ion-item class="form-input">
            <ion-label position="stacked">Barang Donasi</ion-label>
            <ion-text>{{ donationDetails.barang }}</ion-text>
          </ion-item>

          <!-- Jumlah Barang -->
          <ion-item class="form-input">
            <ion-label position="stacked">Jumlah Barang</ion-label>
            <ion-text>{{ donationDetails.jumlah }}</ion-text>
          </ion-item>

          <!-- Metode Pengriman -->

          <ion-item class="form-input">
            <ion-label position="stacked">Metode Pengiriman</ion-label>
            <ion-text>{{ donationDetails.metodePengiriman }}</ion-text>
          </ion-item>

          <!-- Pesan Opsional -->
          <ion-item class="form-input">
            <ion-label position="stacked">Pesan (Opsional)</ion-label>
            <ion-text>{{ donationDetails.pesan || "Tidak ada pesan." }}</ion-text>
          </ion-item>

          <!-- Tanggal dan Waktu -->
          <ion-item class="form-input">
            <ion-label position="stacked">Tanggal & Waktu</ion-label>
            <ion-text>{{ donationDetails.tanggal }} {{ donationDetails.jam }}</ion-text>
          </ion-item>

          <!-- Tombol Kembali
          <ion-button expand="block" class="submit-button" @click="goBack">
            Kembali
          </ion-button> -->
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { dataBase } from "@/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { arrowBack, hourglass, checkmarkCircle } from "ionicons/icons";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// Mengambil parameter donasiId dari URL
const router = useRouter();
const route = useRoute();
const donasiId = route.params.donasiId;

const loading = ref(true);
// Data dummy untuk detail donasi
const donationDetails = ref({});
// penerima: "Penerima A",
// barang: "Buku",
// jumlah: 5,
// pesan: "Semoga bermanfaat!",
// tanggal: new Date().toISOString().split("T")[0],
// jam: new Date().toISOString().split("T")[1].slice(0, 5),

const fetchDonation = async () => {
  try {
    // Query untuk mencari dokumen dengan field tertentu (misalnya 'id' bukan ID Firestore)
    const donationsRef = collection(dataBase, "donations");
    const q = query(donationsRef, where("id", "==", donasiId)); // Misalnya 'id' adalah field dalam dokumen

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        donationDetails.value = doc.data();
        console.log("Donasi ditemukan:", donationDetails.value);
      });
    } else {
      console.log("Donasi tidak ditemukan dengan ID yang diberikan.");
    }
  } catch (error) {
    console.error("Error fetching donation:", error);
  }
};

onMounted(async () => {
  await fetchDonation();

  // dah selese loading
  loading.value = false;
});
</script>

<style scoped>
.donation-page {
  display: flex;
  justify-content: center;
  height: 100%;
  background-color: #f9faff;
}

.form-container {
  margin-top: 0px;
  width: 100%;

  max-width: 400px;
  padding: 20px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  margin-bottom: 20px;
}

.form-input {
  margin-bottom: 15px;
}

.submit-button {
  --background: #85a98f;
  --background-hover: #5a6c57;
  --background-activated: #525b44;
  --border-radius: 26px;
  transition: background-color 0.5s ease-in-out;
}

ion-item {
  --background: transparent;
}

ion-text {
  font-size: 16px;
  color: #333;
}

.waiting-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.waiting-icon {
  font-size: 50px;
  color: #f5970a; /* Warna kuning */
  animation: rotate-hourglass 6s linear infinite;
}

.waiting-icon-container p {
  margin-top: 10px;
  font-size: 16px;
  color: #333;
}

/* Animasi untuk membuat ikon hourglass berputar 180 derajat lalu kembali */
@keyframes rotate-hourglass {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(0deg);
  }
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
