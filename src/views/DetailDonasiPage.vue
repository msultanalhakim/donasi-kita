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
              v-if="!donationDetails.status"
              :icon="hourglass"
              class="waiting-icon"
            ></ion-icon>
            <ion-icon
              v-else
              :icon="checkmarkCircle"
              class="success-icon"
            ></ion-icon>
          </div>

          <h1 v-if="!donationDetails.status" class="title">
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

          <!-- Pesan Opsional -->
          <ion-item class="form-input">
            <ion-label position="stacked">Pesan (Opsional)</ion-label>
            <ion-text>{{ donationDetails.pesan || "Tidak ada pesan." }}</ion-text>
          </ion-item>

          <!-- Tanggal dan Waktu -->
          <ion-item class="form-input">
            <ion-label position="stacked">Tanggal & Waktu</ion-label>
            <ion-text>{{ formattedDateTime }}</ion-text>
          </ion-item>

          <ion-item class="form-input">
            <ion-label position="stacked">Jam</ion-label>
            <ion-text>{{ formattedTime }}</ion-text>
          </ion-item>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { dataBase } from "@/firebase";
import { DocumentData, Timestamp, collection, getDocs, query, where } from "firebase/firestore";
import { arrowBack, hourglass, checkmarkCircle } from "ionicons/icons";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

// Interface untuk data donasi
interface DonationDetails {
  status: boolean;
  penerima: string;
  barang: string;
  jumlah: number;
  pesan: string;
  timestamp: string | Timestamp; // timestamp bisa berupa string atau Timestamp dari Firestore
}

// Mengambil parameter donasiId dari URL
const router = useRouter();
const route = useRoute();
const donasiId = route.params.donasiId;

const loading = ref(true);
// Initialize donation details with the correct type
const donationDetails = ref<DonationDetails>({
  status: false,
  penerima: "",
  barang: "",
  jumlah: 0,
  pesan: "",
  timestamp: "", // Timestamp yang diterima dari Firestore
});


// Fungsi untuk mengambil data donasi
const fetchDonation = async () => {
  try {
    const donationsRef = collection(dataBase, "donations");
    const q = query(donationsRef, where("id", "==", donasiId)); // Query berdasarkan field 'id'
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        // Ambil data dokumen Firestore
        const docData = doc.data() as DocumentData;

        // Cek apakah timestamp adalah objek Timestamp atau string
        let timestamp = docData.timestamp;
        if (timestamp instanceof Timestamp) {
          timestamp = timestamp.toDate().toISOString(); // Ubah menjadi string ISO
        }

        // Mengonversi data Firestore menjadi DonationDetails
        donationDetails.value = {
          status: docData.status,
          penerima: docData.penerima,
          barang: docData.barang,
          jumlah: docData.jumlah,
          pesan: docData.pesan,
          timestamp: timestamp, // Menyimpan timestamp yang sudah diformat
        };

        console.log("Donasi ditemukan:", donationDetails.value);
      });
    } else {
      console.log("Donasi tidak ditemukan dengan ID yang diberikan.");
    }
  } catch (error) {
    console.error("Error fetching donation:", error);
  }
};

// Runtime type guard
const isDonationDetails = (data: any): data is DonationDetails => {
  return (
    typeof data.status === "boolean" &&
    typeof data.penerima === "string" &&
    typeof data.barang === "string" &&
    typeof data.jumlah === "number" &&
    typeof data.pesan === "string"
  );
};


onMounted(async () => {
  await fetchDonation();
  // dah selese loading
  loading.value = false;
});

// Computed property to format date and time
const formattedDateTime = computed(() => {
  if (donationDetails.value.timestamp) {
    let date: Date;

    // Cek apakah timestamp adalah instance dari Timestamp
    if (donationDetails.value.timestamp instanceof Timestamp) {
      date = donationDetails.value.timestamp.toDate(); // Ubah Timestamp menjadi Date
    } else if (typeof donationDetails.value.timestamp === "string") {
      date = new Date(donationDetails.value.timestamp); // Ubah string ISO menjadi Date
    } else {
      return 'Tanggal tidak valid'; // Jika bukan Timestamp atau string, kembalikan pesan kesalahan
    }

    if (isNaN(date.getTime())) {
      return 'Tanggal tidak valid'; // Jika hasil konversi bukan Date yang valid
    }

    return date.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return 'Tanggal tidak tersedia'; // Jika timestamp tidak ada
});

// Computed property to format time
const formattedTime = computed(() => {
  if (donationDetails.value.timestamp) {
    let date: Date;

    // Cek apakah timestamp adalah instance dari Timestamp
    if (donationDetails.value.timestamp instanceof Timestamp) {
      date = donationDetails.value.timestamp.toDate(); // Ubah Timestamp menjadi Date
    } else if (typeof donationDetails.value.timestamp === "string") {
      date = new Date(donationDetails.value.timestamp); // Ubah string ISO menjadi Date
    } else {
      return 'Jam tidak valid'; // Jika bukan Timestamp atau string, kembalikan pesan kesalahan
    }

    if (isNaN(date.getTime())) {
      return 'Jam tidak valid'; // Jika hasil konversi bukan Date yang valid
    }

    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }
  return 'Jam tidak tersedia'; // Jika timestamp tidak ada
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
