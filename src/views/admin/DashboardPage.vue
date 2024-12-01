<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Admin Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <!-- Dashboard Overview -->
      <div class="dashboard-overview">
        <h2>Welcome, Admin!</h2>
        <p>Here's an overview of the platform:</p>

        <div class="stats">
          <div class="stat">
            <ion-icon name="people-outline"></ion-icon>
            <h3>Users</h3>
            <p>120</p>
          </div>
          <div class="stat">
            <ion-icon name="cash-outline"></ion-icon>
            <h3>Donations</h3>
            <p>$25,000</p>
          </div>
          <div class="stat">
            <ion-icon name="gift-outline"></ion-icon>
            <h3>Campaigns</h3>
            <p>15</p>
          </div>
        </div>
      </div>

      <!-- Menu Section -->
      <div class="menu-section">
        <ion-list>
          <ion-item button @click="() => router.push('/manage-user')">
            <ion-icon :icon="peopleOutline" slot="start"></ion-icon>
            <ion-label>Manage Users</ion-label>
          </ion-item>
          <ion-item button @click="() => router.push('/manage-user')">
            <ion-icon :icon="cashOutline" slot="start"></ion-icon>
            <ion-label>Manage Donations</ion-label>
          </ion-item>
          <ion-item button @click="() => router.push('/manage-article')">
            <ion-icon :icon="newspaperOutline" slot="start"></ion-icon>
            <ion-label>Manage Articles</ion-label>
          </ion-item>
          <ion-item button @click="() => router.push('/manage-category')">
            <ion-icon :icon="pricetagsOutline" slot="start"></ion-icon>
            <ion-label>Manage Categories</ion-label>
          </ion-item>
          <ion-item button @click="() => router.push('/manage-campaign')">
            <ion-icon :icon="giftOutline" slot="start"></ion-icon>
            <ion-label>Manage Campaigns</ion-label>
          </ion-item>
          <ion-item button>
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
import { useRouter } from 'vue-router';
import { IonList, IonItem, IonIcon, IonLabel } from "@ionic/vue";
import { cashOutline, giftOutline, logOutOutline, newspaperOutline, peopleOutline, pricetagsOutline, settingsOutline } from "ionicons/icons";

const router = useRouter();

const logout = () => {
  console.log('Logout clicked');
  // Tambahkan logika logout, seperti menghapus token atau sesi
  router.push('/login'); // Arahkan ke halaman login setelah logout
};
</script>

<style scoped>
ion-content {
  --background: #f9fafc;
  font-family: 'Arial', sans-serif;
}

/* Dashboard Overview */
.dashboard-overview {
  text-align: center;
  padding: 20px;
  margin: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.dashboard-overview h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.dashboard-overview p {
  font-size: 14px;
  color: #666;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.stat {
  text-align: center;
}

.stat ion-icon {
  font-size: 40px;
  color: #666;
}

.stat h3 {
  font-size: 16px;
  color: #333;
  margin: 10px 0;
}

.stat p {
  font-size: 14px;
  color: #ff6f61;
  font-weight: bold;
}

/* Menu Section */
.menu-section {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  margin: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

ion-item {
  --background-hover: #f5f5f5;
}

ion-icon {
  color: #666;
}

ion-label {
  font-size: 16px;
  color: #333;
}
</style>
