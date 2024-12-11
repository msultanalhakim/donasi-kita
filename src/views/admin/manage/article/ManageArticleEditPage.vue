<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/manage-articles"></ion-back-button>
          </ion-buttons>
          <ion-title>Edit Article</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div class="form-container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Edit Article Information</ion-card-title>
            </ion-card-header>
  
            <ion-card-content>
              <form @submit.prevent="submitForm">
                <!-- Title Field -->
                <ion-item class="input-item">
                  <ion-label position="stacked">Article Title</ion-label>
                  <ion-input
                    type="text"
                    v-model="form.title"
                    placeholder="Enter article title"
                    required
                  ></ion-input>
                </ion-item>
  
                <!-- Content Field -->
                <ion-item class="input-item">
                  <ion-label position="stacked">Content</ion-label>
                  <ion-input
                    v-model="form.description"
                    placeholder="Enter article content"
                    required
                  ></ion-input>
                </ion-item>
  
                <!-- Submit Button -->
                <ion-button
                  expand="block"
                  type="submit"
                  color="primary"
                  :disabled="isSubmitting"
                  class="submit-button"
                >
                  <ion-spinner slot="start" v-if="isSubmitting"></ion-spinner>
                  Save Changes
                </ion-button>
  
                <!-- Reset Button -->
                <ion-button
                  expand="block"
                  type="button"
                  color="medium"
                  @click="resetForm"
                  class="reset-button"
                >
                  Reset
                </ion-button>
              </form>
            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { dataBase } from '@/firebase';
  import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'; // Tambahkan serverTimestamp
  import { toastController } from '@ionic/vue'; // Import toastController
  
  // The form data model
  const form = ref({
    title: '',
    description: '',
  });
  
  const router = useRouter();
  const route = useRoute();
  const isSubmitting = ref(false);
  
  // Get the articleId from the route parameters
  const articleId = route.params.articleId;
  
  // Fetch the article data when the component is mounted
  onMounted(async () => {
    if (articleId) {
      await fetchArticleData(articleId);
    }
  });
  
  // Function to fetch article data from Firestore
  const fetchArticleData = async (articleId) => {
    try {
      const articleDocRef = doc(dataBase, "articles", articleId); // Assuming the collection is 'articles'
      const articleDocSnap = await getDoc(articleDocRef);
  
      if (articleDocSnap.exists()) {
        const articleData = articleDocSnap.data();
        form.value = { ...articleData }; // Assuming article data contains title and content
      } else {
        console.error("No such article found!");
      }
    } catch (error) {
      console.error('Error fetching article data:', error);
    }
  };
  
  // Function to submit the form and update article data in Firestore
  const submitForm = async () => {
    isSubmitting.value = true;
    try {
      const articleDocRef = doc(dataBase, "articles", articleId); // Assuming the collection is 'articles'
  
      // Update the document in Firestore
      await updateDoc(articleDocRef, {
        title: form.value.title,
        description: form.value.description,
        updatedAt: serverTimestamp(), // Tambahkan properti updatedAt
      });
  
      // Show success toast notification
      const toast = await toastController.create({
        message: 'Article updated successfully!',
        duration: 2000,
        color: 'secondary ', // Green color for success
        position: 'top',
      });
      toast.present();
  
      // Fetch the updated data to refresh the form
      await fetchArticleData(articleId);
  
      // Redirect to Manage Articles
      router.push('/manage-article').then(() => {
        window.dispatchEvent(new CustomEvent('data-updated')); // Emit event here
      });
    } catch (error) {
      console.error('Error updating article data:', error);
      alert('Failed to update article. Please try again.');
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // Function to reset the form
  const resetForm = () => {
    form.value = {
      title: '',
      description: '',
    };
  };
  </script>
  
  <style scoped>
  ion-content {
    --background: #f7f9fc;
  }
  
  .form-container {
    padding: 20px;
  }
  
  ion-card {
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
  }
  
  ion-card-title {
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    color: #333;
  }
  
  .input-item {
    margin-top: 15px;
    --highlight-color-focused: #2196f3;
    --placeholder-color: #aaa;
    --placeholder-font-style: italic;
  }
  
  .submit-button {
    margin-top: 20px;
    --background: #2196f3;
    --background-hover: #1e88e5;
    --box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
    font-weight: bold;
  }
  
  .reset-button {
    margin-top: 10px;
    --background: #e0e0e0;
    --background-hover: #d6d6d6;
    --color: #555;
  }
  </style>
  