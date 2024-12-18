<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Add New Category</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div class="form-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Add New Category</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Category Name</ion-label>
              <ion-input
                v-model="categoryName"
                placeholder="Enter category name"
                required
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Description</ion-label>
              <ion-input
                v-model="categoryDescription"
                placeholder="Enter category description"
              ></ion-input>
            </ion-item>

            <div class="button-group">
              <ion-button expand="block" color="primary" @click="addCategory">
                Add Category
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
import { toastController } from '@ionic/vue';  // Import toastController

// Router
const router = useRouter();

// Form Data
const categoryName = ref('');
const categoryDescription = ref('');

// Function to show toast notifications
const showToast = async (message: string, color: string) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color : "success",
    position: 'top',
  });
  toast.present();
};

// Function to Add Category
const addCategory = async () => {
  if (!categoryName.value.trim()) {
    showToast('Category name is required!', 'danger');
    return;
  }

  try {
    await addDoc(collection(dataBase, 'categories'), {
      name: categoryName.value,
      description: categoryDescription.value || 'No description provided',
    });

    showToast('Category added successfully!', 'success');

    // Emit event to notify ManageCategory to refresh
    router.push('/manage-category').then(() => {
      window.dispatchEvent(new CustomEvent('data-updated'));  // Emit event here
    });
  } catch (error) {
    console.error('Error adding category:', error);
    showToast('Failed to add category. Please try again.', 'danger');
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
