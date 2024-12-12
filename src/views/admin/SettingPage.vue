<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/home"></ion-back-button>
          </ion-buttons>
          <ion-title>Account Settings</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div class="form-container">
          <!-- User Info Section -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>Admin Information</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-item>
                <ion-label position="stacked">Name</ion-label>
                <ion-input
                  v-model="userInfo.name" 
                  placeholder="Your name"
                  disabled
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Email</ion-label>
                <ion-input
                  v-model="userInfo.email"
                  placeholder="Your email"
                  disabled
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Password</ion-label>
                <ion-input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="userInfo.password"
                  placeholder="Your password"
                  disabled
                ></ion-input>
                <ion-button
                  slot="end"
                  @click="toggleShowPassword"
                  fill="clear"
                  class="eye-button"
                >
                  <!-- SVG Eye Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path 
                      v-if="showPassword" 
                      d="M12 4.5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zM12 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"
                      fill="currentColor"
                    />
                    <path 
                      v-else 
                      d="M12 4.5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zM12 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"
                      fill="none" stroke="currentColor" stroke-width="2"
                    />
                  </svg>
                </ion-button>
                <ion-button
                  slot="end"
                  @click="openEditPasswordModal"
                  fill="clear"
                  class="edit-button"
                >
                  <!-- SVG Edit Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path 
                      d="M14 2L12 4l5 5 2-2-5-5zm-1 9h-1v1h1v-1zm0 3h-1v1h1v-1z"
                      fill="currentColor"
                    />
                  </svg>
                </ion-button>
              </ion-item>
            </ion-card-content>
          </ion-card>
  
          <!-- Modal for Edit Password -->
          <ion-modal :is-open="isModalOpen">
            <ion-header>
              <ion-toolbar>
                <ion-title>Edit Password</ion-title>
                <ion-buttons slot="end">
                  <ion-button @click="closeEditPasswordModal">Close</ion-button>
                </ion-buttons>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <ion-item>
                <ion-label position="stacked">New Password</ion-label>
                <ion-input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="newPassword"
                  placeholder="Enter new password"
                  required
                ></ion-input>
                <ion-button
                  slot="end"
                  @click="toggleShowPassword"
                  fill="clear"
                  class="eye-button"
                >
                  <!-- SVG Eye Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path 
                      v-if="showPassword" 
                      d="M12 4.5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zM12 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"
                      fill="currentColor"
                    />
                    <path 
                      v-else 
                      d="M12 4.5c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zM12 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"
                      fill="none" stroke="currentColor" stroke-width="2"
                    />
                  </svg>
                </ion-button>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Confirm New Password</ion-label>
                <ion-input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="confirmPassword"
                  placeholder="Confirm your new password"
                  required
                ></ion-input>
              </ion-item>
  
              <ion-button
                expand="block"
                color="primary"
                @click="updatePassword"
                :disabled="isSubmitting"
              >
                <ion-spinner slot="start" v-if="isSubmitting"></ion-spinner>
                Update Password
              </ion-button>
            </ion-content>
          </ion-modal>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getAuth, updatePassword as firebaseUpdatePassword, signOut } from 'firebase/auth';
  import { toastController, modalController } from '@ionic/vue';
  
  const userInfo = ref({
    name: '',
    email: '',
    password: ''
  });
  const newPassword = ref('');
  const confirmPassword = ref('');
  const isSubmitting = ref(false);
  const showPassword = ref(false);  // State to toggle password visibility
  const isModalOpen = ref(false); // Modal state
  
  const router = useRouter();
  const auth = getAuth();
  
  onMounted(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      userInfo.value.name = currentUser.displayName || 'No Name';  // Populate name with displayName
      userInfo.value.email = currentUser.email || 'No Email';
      userInfo.value.password = currentUser.password || 'not connect in db';  // Placeholder for password
    } else {
      console.error("User is not logged in.");
      router.push('/login');
    }
  });
  
  // Function to update password
  const updatePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
      const toast = await toastController.create({
        message: 'Passwords do not match!',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      toast.present();
      return;
    }
  
    if (newPassword.value.length < 6) {
      const toast = await toastController.create({
        message: 'Password must be at least 6 characters long!',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      toast.present();
      return;
    }
  
    isSubmitting.value = true;
  
    try {
      const user = auth.currentUser;
      if (user) {
        await firebaseUpdatePassword(user, newPassword.value);
        const toast = await toastController.create({
          message: 'Password updated successfully!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        toast.present();
        closeEditPasswordModal(); // Close modal after successful update
      }
    } catch (error) {
      console.error('Error updating password:', error);
      const toast = await toastController.create({
        message: 'Error updating password. Please try again.',
        duration: 2000,
        color: 'danger',
        position: 'top'
      });
      toast.present();
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // Toggle show password visibility
  const toggleShowPassword = () => {
    showPassword.value = !showPassword.value;
  };
  
  // Open Edit Password Modal
  const openEditPasswordModal = () => {
    isModalOpen.value = true;
  };
  
  // Close Edit Password Modal
  const closeEditPasswordModal = () => {
    isModalOpen.value = false;
  };
  </script>
  
  <style scoped>
  ion-content {
    --background: #f9fafc;
    font-family: 'Arial', sans-serif;
  }
  
  .form-container {
    padding: 20px;
  }
  
  ion-card {
    margin-bottom: 20px;
  }
  
  ion-card-title {
    font-size: 20px;
    font-weight: bold;
  }
  
  ion-button {
    margin-top: 15px;
  }
  
  .eye-button {
    background-color: #f0f8ff; /* Light background for the eye button */
    border-radius: 50%;
    padding: 6px;
  }
  
  .edit-button {
    background-color: #f8f0ff; /* Light background for the edit button */
    border-radius: 50%;
    padding: 6px;
  }
  
  ion-modal {
    --background: #ffffff;
  }
  
  ion-item {
    margin-bottom: 10px;
  }
  </style>
  