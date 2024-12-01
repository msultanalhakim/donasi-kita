<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/manage-category"></ion-back-button>
          </ion-buttons>
          <ion-title>Edit Category</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div class="form-container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Edit Category Information</ion-card-title>
            </ion-card-header>
  
            <ion-card-content>
              <form @submit.prevent="submitForm">
                <!-- Name Field -->
                <ion-item class="input-item">
                  <ion-label position="stacked">Category Name</ion-label>
                  <ion-input
                    type="text"
                    v-model="form.name"
                    placeholder="Enter category name"
                    required
                  ></ion-input>
                </ion-item>
  
                <!-- Description Field -->
                <ion-item class="input-item">
                  <ion-label position="stacked">Description</ion-label>
                  <ion-input
                    type="text"
                    v-model="form.description"
                    placeholder="Enter category description"
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
  import { ref } from 'vue';
  
  const form = ref({
    name: '',
    description: '',
  });
  
  const isSubmitting = ref(false);
  
  // Simulate the initial data fetching for the edit form
  const loadCategoryData = async () => {
    // Simulate fetching data
    form.value = {
      name: 'Category A',
      description: 'This is an existing category description.',
    };
  };
  
  const submitForm = async () => {
    isSubmitting.value = true;
    try {
      // Simulate API call
      console.log('Category updated:', form.value);
      alert('Category successfully updated!');
      resetForm();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category. Please try again.');
    } finally {
      isSubmitting.value = false;
    }
  };
  
  const resetForm = () => {
    loadCategoryData();
  };
  
  loadCategoryData();
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
    --highlight-color-focused: #4caf50;
    --placeholder-color: #aaa;
    --placeholder-font-style: italic;
  }
  
  .submit-button {
    margin-top: 20px;
    --background: #4caf50;
    --background-hover: #45a049;
    --box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
    font-weight: bold;
  }
  
  .reset-button {
    margin-top: 10px;
    --background: #e0e0e0;
    --background-hover: #d6d6d6;
    --color: #555;
  }
  </style>
  