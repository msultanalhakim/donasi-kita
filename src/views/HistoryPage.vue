<template>
  <ion-page>
    <!-- loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="router.push('/home')" fill="clear" color="dark">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="title">Riwayat Donasi</ion-title>
      </ion-toolbar>

      <ion-toolbar>
        <ion-segment v-model="selectedTab" :value="selectedTab" @ionChange="onTabChange">
          <ion-segment-button value="inProgress">
            <ion-label>Pending</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed">
            <ion-label>Selesai</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <!-- main -->
    <ion-content :fullscreen="true" scroll-assist="false" scroll-padding="false">
      <div class="tab-content">
        <!-- Dalam Proses Tab -->
        <div v-if="selectedTab === 'inProgress'">
          <ion-card
            v-for="donasi in filteredDonations"
            :key="donasi.id"
            @click="router.push(`/detail-donasi/${donasi.id}`)"
            class="donation-card"
          >
            <ion-card-header>
              <ion-card-title>{{ donasi.penerima }}</ion-card-title>
              <ion-card-subtitle>{{ donasi.tanggalTeks }}, {{ donasi.waktuTeks }}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <p>{{ donasi.barang }}</p>
              <ion-badge color="warning">Pending</ion-badge>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Selesai Tab -->
        <div v-if="selectedTab === 'completed'">
          <ion-card
            v-for="donasi in filteredDonations"
            :key="donasi.id"
            @click="router.push(`/detail-donasi/${donasi.id}`)"
            class="donation-card"
          >
            <ion-card-header>
              <ion-card-title>{{ donasi.penerima }}</ion-card-title>
              <ion-card-subtitle>{{ donasi.tanggalTeks }}, {{ donasi.waktuTeks }}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <p>{{ donasi.barang }}</p>
              <ion-badge color="success">Selesai</ion-badge>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/authStore";
import { dataBase } from "@/firebase";
import router from "@/router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { computed, onMounted, ref } from "vue";
import { arrowBack } from "ionicons/icons";

interface Donation {
  id: string;
  penerima: string;
  tanggalTeks: string;
  barang: string;
  status: boolean;
  timestamp: number; // Add this line
  [key: string]: any; // Additional properties for Firestore data
}


const selectedTab = ref("inProgress"); // Tab aktif, default "inProgress"
const loading = ref(true); // Status loading
const authStore = useAuthStore();
const user = ref<{ email: string } | null>(null); // Menyimpan data user
const donations = ref<Donation[]>([]); // Array untuk menampung data dari Firestore

// Mengelola tab aktif
const onTabChange = (event: any) => {
  selectedTab.value = event.detail.value;
};

// Filter donasi berdasarkan tab aktif
const filteredDonations = computed(() => {
  return donations.value.filter((donasi) => {
    if (selectedTab.value === "inProgress") return !donasi.status;
    if (selectedTab.value === "completed") return donasi.status;
    return false;
  });
});

const fetchDonations = async () => {
  try {
    console.log("Fetching donations for email:", user.value?.email);

    // Query Firestore
    const donationsQuery = query(
      collection(dataBase, "donations"),
      where("email", "==", user.value?.email || "")
    );

    const querySnapshot = await getDocs(donationsQuery);

    donations.value = querySnapshot.docs
  .map((doc) => {
    const data = doc.data();

    if (!data.timestamp) {
      console.error("Missing timestamp for donation ID:", doc.id);
      return null; // Biarkan null sementara
    }

    const timestamp = data.timestamp.toDate();
    const formattedData = convertIdToFormattedData(timestamp);

    return {
      id: doc.id,
      penerima: data.penerima || "",
      tanggalTeks: formattedData.tanggalTeks,
      barang: data.barang || "",
      status: data.status ?? false,
      timestamp: timestamp.getTime(),
      ...data,
    };
  })
  .filter((item): item is NonNullable<typeof item> => item !== null) // Filter dengan tipe yang eksplisit
  .sort((a, b) => b.timestamp - a.timestamp);


    console.log("Sorted donations:", donations.value);
  } catch (error) {
    console.error("Error fetching donations:", error);
  }
};

const convertIdToFormattedData = (id: string) => {
  const date = new Date(id); // Membuat objek Date dari id

  if (isNaN(date.getTime())) {
    console.error('Invalid date:', id);
    return { tanggalTeks: "Tanggal tidak valid", waktuTeks: "Waktu tidak valid" }; // Mengembalikan nilai default jika ID tidak valid
  }

  // Format tanggal
  const tanggalTeks = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Format waktu (waktu dalam zona waktu lokal)
  const waktuTeks = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    tanggalTeks,
    waktuTeks, // Waktu yang diformat sesuai zona waktu lokal
  };
};

// Proses saat komponen dimuat
onMounted(async () => {
  await authStore.loadUserFromLocalStorage();
  user.value = authStore.currentUser;
  await fetchDonations();
  loading.value = false;
});
</script>

<style scoped>
ion-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.donation-page {
  display: flex;
  justify-content: center;
  height: 100%;
  background-color: #f9faff;
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
