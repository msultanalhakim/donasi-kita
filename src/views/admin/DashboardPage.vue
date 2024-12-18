<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="router.push('/profile')" fill="clear" color="dark">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Admin Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <!-- Dashboard Overview -->
      <div class="dashboard-overview">
        <h2>Welcome, Admin!</h2>
        <p>Here's an overview of the Data</p>

        <div class="stats-wrapper">
          <div class="stats">
            <div class="stat">
              <div class="icon-container">
                <!-- Ikon Users dalam bentuk SVG -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-users"
                  width="25"
                  height="25"
                >
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M12 14c4 0 8 2 8 6H4c0-4 4-6 8-6z"></path>
                </svg>
              </div>
              <h3>Users</h3>
              <p>{{ userCount }}</p>
            </div>
            <div class="stat">
              <div class="icon-container">
                <!-- Ikon Kotak Sumbangan dalam bentuk SVG -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="25"
                  height="25"
                >
                  <rect x="3" y="3" width="18" height="14" rx="2" ry="2"></rect>
                  <path d="M7 7h10M9 13h6"></path>
                </svg>
              </div>
              <h3>Donations</h3>
              <p>{{ donationCount }}</p>
            </div>
            <div class="stat">
              <div class="icon-container">
                <!-- Ikon Articles dalam bentuk SVG -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-file-text"
                  width="25"
                  height="25"
                >
                  <path
                    d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                  ></path>
                  <path d="M6 2v20"></path>
                  <path d="M6 10h12"></path>
                  <path d="M6 14h12"></path>
                </svg>
              </div>
              <h3>Articles</h3>
              <p>{{ articleCount }}</p>
            </div>
            <div class="stat">
              <div class="icon-container">
                <!-- Ikon Donations Target dalam bentuk SVG -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-target"
                  width="25"
                  height="25"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <h3>Donation Targets</h3>
              <p>{{ targetCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu Section -->
      <div class="menu-section">
        <ion-list>
          <ion-item button @click="navigateTo('/manage-user')">
            <ion-icon :icon="peopleOutline" slot="start"></ion-icon>
            <ion-label>Manage Users</ion-label>
          </ion-item>
          <ion-item button @click="navigateTo('/manage-donation')">
            <ion-icon :icon="cashOutline" slot="start"></ion-icon>
            <ion-label>Manage Donations</ion-label>
          </ion-item>
          <ion-item button @click="navigateTo('/manage-category')">
            <ion-icon :icon="pricetagsOutline" slot="start"></ion-icon>
            <ion-label>Manage Item Categories</ion-label>
          </ion-item>
          <ion-item button @click="navigateTo('/manage-target')">
            <ion-icon :icon="storefront" slot="start"></ion-icon>
            <ion-label>Manage Donation Targets</ion-label>
          </ion-item>
          <ion-item button @click="navigateTo('/manage-article')">
            <ion-icon :icon="newspaperOutline" slot="start"></ion-icon>
            <ion-label>Manage Articles</ion-label>
          </ion-item>
          <ion-item button @click="navigateTo('/setting')">
            <ion-icon :icon="settingsOutline" slot="start"></ion-icon>
            <ion-label>Settings</ion-label>
          </ion-item>
          <ion-item button @click="logout">
            <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
            <ion-label>Logout</ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { IonList, IonItem, IonIcon, IonLabel } from "@ionic/vue";
import {
  cashOutline,
  giftOutline,
  logOutOutline,
  newspaperOutline,
  peopleOutline,
  pricetagsOutline,
  settingsOutline,
  storefront,
  arrowBack,
} from "ionicons/icons";
import { dataBase } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ref, onMounted } from "vue";

// Define types
interface DonationTarget {
  id: string;
  name: string;
  description: string;
}

// Declare router and reactive variables
const router = useRouter();

const users = ref<any[]>([]);
const userCount = ref(0);

const donations = ref<any[]>([]);
const donationCount = ref(0);

const articles = ref<any[]>([]);
const articleCount = ref(0);

const targets = ref<DonationTarget[]>([]);
const targetCount = ref(0);

// Fetch users from Firestore
const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(dataBase, "users"));
  users.value = querySnapshot.docs.map((doc) => doc.data());
  userCount.value = users.value.length;
};

// Fetch donations from Firestore
const fetchDonations = async () => {
  const querySnapshot = await getDocs(collection(dataBase, "donations"));
  donations.value = querySnapshot.docs.map((doc) => doc.data());
  donationCount.value = donations.value.length;
};

// Fetch articles from Firestore
const fetchArticles = async () => {
  const querySnapshot = await getDocs(collection(dataBase, "articles"));
  articles.value = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "Untitled Article",
      author: data.author || "Unknown Author",
      description: data.description || "No Description",
      createdAt: data.createdAt || null,
      lastUpdated: data.lastUpdated || null,
    };
  });
  articleCount.value = articles.value.length;
};

// Fetch donation targets from Firestore
const fetchTargets = async () => {
  const querySnapshot = await getDocs(collection(dataBase, "donation-targets"));
  targets.value = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "Unnamed Target",
      description: data.description || "No Description",
    } as DonationTarget;
  });
  targetCount.value = targets.value.length; // Update target count
};

// Call all fetch functions on component mount
onMounted(() => {
  fetchUsers();
  fetchDonations();
  fetchArticles();
  fetchTargets();
});

// Navigate to different pages
const navigateTo = (path: string) => {
  router.push(path);
};

// Logout function
const logout = () => {
  console.log("Logout clicked");
  router.push("/login");
};
</script>

<style scoped>
ion-content {
  --background: #f4f4f7;
  font-family: "Roboto", sans-serif;
}

/* Dashboard Overview */
.dashboard-overview {
  text-align: center;
  padding: 15px;
  margin: 15px;
  background-color: #f9fafc;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.dashboard-overview h2 {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
}

.dashboard-overview p {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

.stats-wrapper {
  padding: 20px;
  background: linear-gradient(135deg, #f0f1f3, #e6e8eb);
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat {
  text-align: center;
  padding: 10px;
  background-color: #f4f6f8;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.icon-container {
  width: 50px;
  height: 50px;
  margin: 0 auto 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #c1c5c9, #a6abb0);
  border-radius: 50%;
}

.icon-container ion-icon {
  font-size: 24px;
  color: white;
}

.stat h3 {
  font-size: 14px;
  font-weight: bold;
  color: #2c3e50;
  margin: 8px 0 4px;
}

.stat p {
  font-size: 14px;
  color: #7f8c8d;
}

/* Menu Section */
.menu-section {
  padding: 10px;
  background-color: #f9fafc;
  border-radius: 12px;
  margin: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

ion-item {
  --background-hover: #dcdfe2;
  --ripple-color: #c7cbd1;
  --color: #2c3e50;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin: 5px 0;
}

ion-item:hover {
  background-color: #eceeef;
  color: #34495e;
}

ion-icon {
  color: #7f8c8d;
  font-size: 18px;
}

ion-label {
  font-size: 14px;
  color: #2c3e50;
}
.icon-container i {
  font-size: 30px; /* Pastikan ikon cukup besar */
  color: #2c3e50; /* Warna ikon */
}
</style>
