<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>Add New Article</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content fullscreen>
        <div class="form-container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Add New Article</ion-card-title>
            </ion-card-header>
  
            <ion-card-content>
              <!-- Title -->
              <ion-item>
                <ion-label position="stacked">Title</ion-label>
                <ion-input
                  v-model="title"
                  placeholder="Enter article title"
                  required
                ></ion-input>
              </ion-item>
  
              <!-- Author -->
              <ion-item>
                <ion-label position="stacked">Author</ion-label>
                <ion-input
                  v-model="author"
                  placeholder="Enter author name"
                  required
                ></ion-input>
              </ion-item>
  
              <!-- Description -->
              <ion-item>
                <ion-label position="stacked">Description</ion-label>
                <ion-textarea
                  v-model="description"
                  placeholder="Enter article description"
                  auto-grow
                ></ion-textarea>
              </ion-item>
  
              <!-- Actions -->
              <div class="button-group">
                <ion-button expand="block" color="primary" @click="addArticle">
                  Add Article
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
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import { dataBase } from '@/firebase';
  import { toastController } from '@ionic/vue'; // Import toastController
  
  // Router
  const router = useRouter();
  
  // Form Data
  const title = ref('');
  const author = ref('');
  const description = ref('');
  
  // Function to Add Article
  const addArticle = async () => {
    if (!title.value.trim() || !author.value.trim()) {
      alert('Title and Author are required!');
      return;
    }
  
    try {
      await addDoc(collection(dataBase, 'articles'), {
        title: title.value,
        author: author.value,
        description: description.value || 'No description provided',
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });
  
      // Show success toast notification
      const toast = await toastController.create({
        message: 'Article added successfully!',
        duration: 2000,
        color: 'success', // Green color for success
        position: 'top',
      });
      toast.present();
  
      // Emit event to notify ManageArticle to refresh
      router.push('/manage-article').then(() => {
        window.dispatchEvent(new CustomEvent('data-updated')); // Emit event here
      });
    } catch (error) {
      console.error('Error adding article:', error);
  
      // Show error toast notification
      const toast = await toastController.create({
        message: 'Failed to add article. Please try again.',
        duration: 2000,
        color: 'danger', // Red color for danger
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
  