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
        <ion-title class="title"> Riwayat Donasi </ion-title>
      </ion-toolbar>

      <ion-toolbar>
        <ion-segment v-model="selectedTab" :value="selectedTab" @ionChange="onTabChange">
          <ion-segment-button value="inProgress">
            <ion-label>Dalam Proses</ion-label>
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
              <ion-card-subtitle>{{ donasi.tanggalTeks }}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <p>{{ donasi.barang }}</p>
              <ion-badge color="warning">Dalam Proses</ion-badge>
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
              <ion-card-subtitle>{{ donasi.tanggalTeks }}</ion-card-subtitle>
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

const selectedTab = ref("inProgress"); // Tab aktif, default "inProgress"
const loading = ref(true); // Status loading
const authStore = useAuthStore();
const user = ref(""); // Menyimpan data user

// Mengelola tab aktif
const onTabChange = (event: any) => {
  selectedTab.value = event.detail.value;
};

// const donations = ref([
//   { id: 1, penerima: "Penerima A", tanggal: "2024-12-15", barang: "Buku", status: false },
//   {
//     id: 2,
//     penerima: "Penerima B",
//     tanggal: "2024-12-12",
//     barang: "Pakaian",
//     status: false,
//   },
//   {
//     id: 3,
//     penerima: "Penerima C",
//     tanggal: "2024-11-10",
//     barang: "Makanan",
//     status: true,
//   },
//   {
//     id: 4,
//     penerima: "Penerima D",
//     tanggal: "2024-10-01",
//     barang: "Peralatan Belajar",
//     status: true,
//   },
// ]);
const donations = ref([]); // Array untuk menampung data dari Firestore

// Filter donasi berdasarkan tab aktif
const filteredDonations = computed(() => {
  if (selectedTab.value === "inProgress") {
    return donations.value.filter((donasi) => donasi.status == false);
  } else if (selectedTab.value === "completed") {
    return donations.value.filter((donasi) => donasi.status == true);
  }
  return [];
});

// Ambil data dari Firestore
const fetchDonations = async () => {
  try {
    const donationsQuery = query(
      collection(dataBase, "donations"),
      where("email", "==", user.value.email)
    );

    if (donationsQuery) {
      const querySnapshot = await getDocs(donationsQuery);

      donations.value = querySnapshot.docs
        .map((doc) => {
          const formattedData = convertIdToFormattedData(doc.data().id); // Panggil fungsi

          return {
            ...doc.data(),
            tanggalTeks: formattedData.tanggalTeks, // Gunakan tanggalTeks yang telah diformat
            timestamp: new Date(doc.data().id).getTime(),
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp); // Mengurutkan berdasarkan timestamp terbaru terlebih dahulu
    } else {
      alert("Anda Belum Pernah Melakukan Donasi");
    }
  } catch (error) {
    console.error("Error fetching donation targets:", error);
  }
};

// ubah tanggal jadi huruf
// const formatFirestoreDate = (dateString) => {
//   const date = new Date(dateString);
//   const options = { day: "numeric", month: "long", year: "numeric" };
//   return new Intl.DateTimeFormat("id-ID", options).format(date);
// };

const convertIdToFormattedData = (id) => {
  const date = new Date(id); // Mengonversi string ID ke objek Date

  // Format tanggal angka: 18-12-2024
  const tanggalAngka = date
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-"); // Ganti separator "/" dengan "-"

  // Format jam: 11.35
  const jam = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format tanggal teks: 18 Desember 2024
  const tanggalTeks = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return { tanggalAngka, jam, tanggalTeks };
};

// Menangani proses saat komponen dimuat
onMounted(async () => {
  await authStore.loadUserFromLocalStorage();
  user.value = authStore.currentUser;
  await fetchDonations();

  loading.value = false;
  console.log(filteredDonations.value);
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
