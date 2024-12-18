<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="router.push('/home')" fill="clear" color="dark">
              <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>User Settings</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true" class="ion-padding">
        <div class="settings-container">
          <h2 class="settings-title">Edit Your Profile</h2>
  
          <!-- Display Email -->
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input :value="userData.email" readonly></ion-input>
          </ion-item>
  
          <!-- Edit Name -->
          <ion-item>
            <ion-label position="stacked">Name</ion-label>
            <ion-input
              v-model="userData.name"
              placeholder="Enter your name"
              required
            ></ion-input>
          </ion-item>
  
          <!-- Edit Phone -->
          <ion-item>
            <ion-label position="stacked">Phone</ion-label>
            <ion-input
              v-model="userData.phone"
              type="tel"
              placeholder="Enter your phone number"
            ></ion-input>
          </ion-item>
  
          <!-- Edit Address -->
          <ion-item>
            <ion-label position="stacked">Address</ion-label>
            <ion-textarea
              v-model="userData.address"
              placeholder="Enter your address"
            ></ion-textarea>
          </ion-item>
  
          <!-- Display and Edit Password -->
          <ion-item>
            <ion-label position="stacked">Password</ion-label>
            <ion-input
              :type="showPassword ? 'text' : 'password'"
              placeholder="**********" 
              readonly
            ></ion-input>
            <ion-button slot="end" fill="clear" @click="togglePasswordVisibility">
              <ion-icon :icon="showPassword ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
            </ion-button>
            <ion-button slot="end" fill="clear" @click="openEditPasswordModal">
              Edit
            </ion-button>
          </ion-item>
  
          <!-- Save Button -->
          <ion-button expand="block" class="save-button" @click="saveChanges">
            Save Changes
          </ion-button>
        </div>
  
        <!-- Modal for Editing Password -->
        <ion-modal :is-open="isEditPasswordModalOpen" @will-dismiss="closeEditPasswordModal">
          <ion-header>
            <ion-toolbar>
              <ion-title>Edit Password</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="closeEditPasswordModal">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <ion-item>
              <ion-label position="stacked">New Password</ion-label>
              <ion-input
                v-model="newPassword"
                type="password"
                placeholder="Enter new password"
              ></ion-input>
            </ion-item>
            <ion-button expand="block" @click="updatePassword">Update Password</ion-button>
          </ion-content>
        </ion-modal>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { arrowBack } from "ionicons/icons";
  import {
    getAuth,
    updatePassword as firebaseUpdatePassword,
  } from "firebase/auth";
  import { doc, updateDoc } from "firebase/firestore";
  import { dataBase } from "@/firebase";
  import { useAuthStore } from "@/authStore";
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const userData = ref({
    email: "",
    name: "",
    phone: "",
    address: "",
    // No password field here, as we handle password separately in modal
  });
  
  const loading = ref(false);
  const showPassword = ref(false);
  const isEditPasswordModalOpen = ref(false);
  const newPassword = ref("");
  
  onMounted(() => {
    const currentUser = authStore.currentUser;
    if (currentUser) {
      userData.value.email = currentUser.email;
      userData.value.name = currentUser.name || "";
      userData.value.phone = currentUser.phone || "";
      userData.value.address = currentUser.address || "";
    }
  });
  
  const saveChanges = async () => {
    if (!userData.value.name || !userData.value.phone || !userData.value.address) {
      alert("Please fill in all required fields.");
      return;
    }
  
    loading.value = true;
  
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        const userRef = doc(dataBase, "users", currentUser.uid);
        await updateDoc(userRef, {
          name: userData.value.name,
          phone: userData.value.phone,
          address: userData.value.address,
        });
      }
  
      alert("Profile updated successfully!");
      router.push("/home");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      loading.value = false;
    }
  };
  
  const openEditPasswordModal = () => {
    isEditPasswordModalOpen.value = true;
  };
  
  const closeEditPasswordModal = () => {
    isEditPasswordModal.value = false;
  };
  
  const updatePassword = async () => {
    if (!newPassword.value || newPassword.value.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
  
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        await firebaseUpdatePassword(currentUser, newPassword.value);
        alert("Password updated successfully!");
        closeEditPasswordModal();
      }
    } catch (error) {
      console.error("Failed to update password:", error);
      alert("Failed to update password. Please try again.");
    }
  };
  
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };
  </script>
  
  <style scoped>
  .settings-container {
    max-width: 500px;
    margin: auto;
  }
  
  .settings-title {
    text-align: center;
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 22px;
  }
  
  .save-button {
    margin-top: 20px;
    --background: #4caf50;
    --background-hover: #388e3c;
    --border-radius: 26px;
  }
  </style>
  