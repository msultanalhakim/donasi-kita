<template>
  <ion-page>
    <!-- Overlay loading screen -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- Header -->
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
            <ion-label>Dalam Proses</ion-label>
          </ion-segment-button>
          <ion-segment-button value="completed">
            <ion-label>Selesai</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content :fullscreen="true" scroll-assist="false" scroll-padding="false">
      <div class="tab-content">
        <!-- Dalam Proses Tab -->
        <div v-if="selectedTab === 'inProgress'">
          <ion-card
            v-for="donation in inProgressDonations"
            :key="donation.id"
            @click="router.push(`/detail-donasi/${donation.id}`)"
            class="donation-card"
          >
            <ion-card-header>
              <ion-card-title>{{ donation.recipient }}</ion-card-title>
              <ion-card-subtitle>{{ donation.date }}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <p>{{ donation.description }}</p>
              <ion-badge color="warning">Dalam Proses</ion-badge>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Selesai Tab -->
        <div v-if="selectedTab === 'completed'">
          <ion-card
            v-for="donation in completedDonations"
            :key="donation.id"
            @click="router.push(`/detail-donasi/${donation.id}`)"
            class="donation-card"
          >
            <ion-card-header>
              <ion-card-title>{{ donation.recipient }}</ion-card-title>
              <ion-card-subtitle>{{ donation.date }}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <p>{{ donation.description }}</p>
              <ion-badge color="success">Selesai</ion-badge>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { arrowBack } from "ionicons/icons";

const router = useRouter();
const loading = ref(false); // Simulate loading state
const selectedTab = ref("inProgress");

// Dummy data for demonstration
const inProgressDonations = ref([
  {
    id: 1,
    recipient: "Penerima A",
    date: "15 Desember 2024",
    description: "Donasi berupa buku untuk sekolah.",
  },
  {
    id: 2,
    recipient: "Penerima B",
    date: "12 Desember 2024",
    description: "Donasi pakaian bekas layak pakai.",
  },
]);

const completedDonations = ref([
  {
    id: 3,
    recipient: "Penerima C",
    date: "10 November 2024",
    description: "Donasi makanan kering untuk panti asuhan.",
  },
  {
    id: 4,
    recipient: "Penerima D",
    date: "01 Oktober 2024",
    description: "Donasi peralatan belajar untuk anak-anak.",
  },
]);

const onTabChange = (event) => {
  selectedTab.value = event.detail.value;
};
</script>

<style scoped>
/* Header Styling */
ion-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* Loading Spinner */
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

/* Card Styling */
.donation-card {
  margin: 10px;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.donation-card:hover {
  transform: scale(1.02);
}

ion-card-header {
  background-color: #f9faff;
  border-bottom: 1px solid #eee;
}

ion-card-title {
  font-size: 18px;
  font-weight: bold;
}

ion-card-subtitle {
  font-size: 14px;
  color: #6c757d;
}

ion-card-content {
  font-size: 14px;
  color: #333;
}

ion-badge {
  margin-top: 10px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}
</style>
