<template>
  <ion-page>
    <ion-content fullscreen>
      <!-- Profile Section -->
      <div class="profile-overview">
        <!-- Profile Picture -->
        <div class="profile-image-container">
          <img
            src="/assets/images/login-illustration.png"
            alt="Profile Picture"
            class="profile-image"
          />
        </div>
        <!-- Name and Membership -->
        <h2 class="username">Muhammad Sultan Alhakim</h2>
        <p class="membership">Premium Member <ion-icon :icon="starOutline"></ion-icon></p>
      </div>

      <!-- About Section -->
      <div class="about-section">
        <h3>About Me</h3>
        <p>
          I am an active donor passionate about making a difference. Together,
          we can create a better future for those in need.
        </p>
      </div>

      <!-- Family Members -->
      <div class="family-section">
        <h3>Family Members</h3>
        <div class="family-list">
          <div class="family-member">
            <img src="/assets/images/login-illustration.png" alt="Chloe K." />
            <p>Chloe K.</p>
          </div>
          <div class="family-member">
            <img src="/assets/images/login-illustration.png" alt="Carter E." />
            <p>Carter E.</p>
          </div>
          <div class="family-member">
            <img src="/assets/images/login-illustration.png" alt="Waylen A." />
            <p>Waylen A.</p>
          </div>
          <div class="family-member add-new">
            <ion-icon :icon="addCircleOutline"></ion-icon>
            <p>Add New</p>
          </div>
        </div>
      </div>

      <!-- Menu Section -->
      <div class="menu-section">
        <ion-list>
          <ion-item button @click="() => router.push('/dashboard')">
            <ion-icon :icon="optionsOutline" slot="start"></ion-icon>
            <ion-label>Dashboard</ion-label>
          </ion-item>
          <ion-item button>
            <ion-icon :icon="timeOutline" slot="start"></ion-icon>
            <ion-label>Donation History</ion-label>
          </ion-item>
          <ion-item button>
            <ion-icon :icon="settingsOutline" slot="start"></ion-icon>
            <ion-label>Settings</ion-label>
          </ion-item>
          <ion-item button>
            <ion-icon :icon="helpCircleOutline" slot="start"></ion-icon>
            <ion-label>Help & Support</ion-label>
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
import { helpCircleOutline, logOutOutline, optionsOutline, settingsOutline, timeOutline, addCircleOutline, starOutline } from "ionicons/icons";

const router = useRouter();

const logout = () => {
  console.log('Logout clicked');
  // Tambahkan logika logout, seperti menghapus token atau sesi
  router.push('/login'); // Arahkan ke halaman login setelah logout
};
</script>

<style scoped>
/* Global Styles */
ion-content {
  --background: #f9fafc;
  font-family: 'Arial', sans-serif;
}

/* Profile Overview */
.profile-overview {
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  margin: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-image-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.membership {
  font-size: 14px;
  color: #ff6f61;
  display: flex;
  align-items: center;
  justify-content: center;
}

.membership ion-icon {
  margin-left: 5px;
}

/* About Section */
.about-section {
  padding: 20px;
  margin: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.about-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.about-section p {
  font-size: 14px;
  color: #666;
}

/* Family Section */
.family-section {
  padding: 20px;
  margin: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.family-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.family-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.family-member {
  text-align: center;
}

.family-member img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.family-member p {
  font-size: 12px;
  color: #333;
  margin-top: 5px;
}

.family-member.add-new {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.family-member.add-new ion-icon {
  font-size: 40px;
  color: #666;
}

/* Menu Section */
.menu-section {
  padding: 20px;
  background-color: #fff;
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
