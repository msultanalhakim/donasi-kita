<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/manage-categories"></ion-back-button>
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
              <!-- Category Name Field -->
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
                  placeholder="Enter description"
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
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { toastController } from '@ionic/vue'; // Import toastController

// The form data model
const form = ref({
  name: '',
  description: '',
});

const router = useRouter();
const route = useRoute();
const isSubmitting = ref(false);

// Get the categoryId from the route parameters
const categoriesId = route.params.categoriesId;

// Fetch the category data when the component is mounted
onMounted(async () => {
  if (categoriesId) {
    await fetchCategoryData(categoriesId);
  }
});

// Function to fetch category data from Firestore
const fetchCategoryData = async (categoriesId) => {
  try {
    const categoryDocRef = doc(dataBase, "categories", categoriesId); // Assuming the collection is 'categories'
    const categoryDocSnap = await getDoc(categoryDocRef);

    if (categoryDocSnap.exists()) {
      const categoryData = categoryDocSnap.data();
      form.value = { ...categoryData }; // Assuming category data contains name and description
    } else {
      console.error("No such category found!");
    }
  } catch (error) {
    console.error('Error fetching category data:', error);
  }
};

// Function to submit the form and update category data in Firestore
const submitForm = async () => {
  isSubmitting.value = true;
  try {
    const categoryDocRef = doc(dataBase, "categories", categoriesId); // Assuming the collection is 'categories'

    // Update the document in Firestore
    await updateDoc(categoryDocRef, {
      name: form.value.name,
      description: form.value.description,
    });

    // Fetch the updated data to refresh the form
    await fetchCategoryData(categoriesId);

    // Show success toast notification
    const toast = await toastController.create({
      message: 'Category information updated successfully!',
      duration: 2000,
      color: 'secondary',
      position: 'top'
    });
    toast.present();

    // Emit event to notify ManageCategory to refresh
    router.push('/manage-category').then(() => {
      window.dispatchEvent(new CustomEvent('data-updated'));  // Emit event here
    });
  } catch (error) {
    console.error('Error updating category data:', error);

    // Show error toast notification
    const toast = await toastController.create({
      message: 'Failed to update category. Please try again.',
      duration: 2000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  } finally {
    isSubmitting.value = false;
  }
};

// Function to reset the form
const resetForm = () => {
  form.value = {
    name: '',
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
