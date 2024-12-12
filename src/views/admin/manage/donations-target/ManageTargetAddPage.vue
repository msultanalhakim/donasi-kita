<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Add Donation Target</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div class="form-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Add New Target</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <!-- Target Name Input -->
            <ion-item>
              <ion-label position="stacked">Target Name</ion-label>
              <ion-input
                v-model="targetName"
                placeholder="Enter target name"
                required
              ></ion-input>
            </ion-item>

            <!-- Description Input -->
            <ion-item>
              <ion-label position="stacked">Description</ion-label>
              <ion-textarea
                v-model="description"
                placeholder="Enter description"
              ></ion-textarea>
            </ion-item>

            <!-- Image URL Input -->
            <ion-item>
              <ion-label position="stacked">Image URL (Optional)</ion-label>
              <ion-input
                v-model="imageLink"
                placeholder="Enter image URL"
              ></ion-input>
            </ion-item>

            <!-- Buttons -->
            <div class="button-group">
              <ion-button expand="block" color="primary" @click="addTarget">
                Add Target
              </ion-button>
              <ion-button expand="block" color="medium" @click="goBack">
                Cancel
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { dataBase } from '@/firebase';
import { toastController } from '@ionic/vue'; // Import toastController

// Router
const router = useRouter();

// Form Data
const targetName = ref('');
const description = ref('');
const imageLink = ref(''); // New field for image URL

// Function to Add Target
const addTarget = async () => {
  if (!targetName.value.trim()) {
    alert('Target name is required!');
    return;
  }

  try {
    await addDoc(collection(dataBase, 'donation-targets'), {
      name: targetName.value,
      description: description.value || 'No description provided',
      imageLink: imageLink.value || '', // Save the image link if provided
    });

    // Show success toast notification
    const toast = await toastController.create({
      message: 'Donation target added successfully!',
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    toast.present();

    // Emit event to notify ManageTarget to refresh
    router.push('/manage-target').then(() => {
      window.dispatchEvent(new CustomEvent('data-updated'));  // Emit event here
    });
  } catch (error) {
    console.error('Error adding donation target:', error);

    // Show error toast notification
    const toast = await toastController.create({
      message: 'Failed to add donation target. Please try again.',
      duration: 2000,
      color: 'danger',
      position: 'top',
    });
    toast.present();
  }
};

// Cancel and Go Back
const goBack = () => {
  router.back();
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

.button-group ion-button {
  margin-top: 10px;
}
</style>
