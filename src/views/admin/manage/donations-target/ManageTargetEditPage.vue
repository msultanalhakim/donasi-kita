<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/manage-target"></ion-back-button>
        </ion-buttons>
        <ion-title>Edit Donation Target</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="form-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Edit Donation Target Information</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="submitForm">
              <!-- Target Name Field -->
              <ion-item class="input-item">
                <ion-label position="stacked">Target Name</ion-label>
                <ion-input
                  type="text"
                  v-model="form.name"
                  placeholder="Enter target name"
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

// Get the targetId from the route parameters
const targetId = route.params.targetId;

// Fetch the donation target data when the component is mounted
onMounted(async () => {
  if (targetId) {
    await fetchDonationTargetData(targetId);
  }
});

// Function to fetch donation target data from Firestore
const fetchDonationTargetData = async (targetId) => {
  try {
    const targetDocRef = doc(dataBase, "donation-targets", targetId); // Assuming the collection is 'donation-targets'
    const targetDocSnap = await getDoc(targetDocRef);

    if (targetDocSnap.exists()) {
      const targetData = targetDocSnap.data();
      form.value = { ...targetData }; // Assuming target data contains name and description
    } else {
      console.error("No such target found!");
    }
  } catch (error) {
    console.error('Error fetching donation target data:', error);
  }
};

// Function to submit the form and update donation target data in Firestore
const submitForm = async () => {
  isSubmitting.value = true;
  try {
    const targetDocRef = doc(dataBase, "donation-targets", targetId); // Assuming the collection is 'donation-targets'

    // Update the document in Firestore
    await updateDoc(targetDocRef, {
      name: form.value.name,
      description: form.value.description,
    });

    // Fetch the updated data to refresh the form
    await fetchDonationTargetData(targetId);

    // Show success toast notification
    const toast = await toastController.create({
      message: 'Donation target updated successfully!',
      duration: 2000,
      color: 'secondary',
      position: 'top'
    });
    toast.present();

    // Emit event to notify ManageTarget to refresh
    router.push('/manage-target').then(() => {
      window.dispatchEvent(new CustomEvent('data-updated'));  // Emit event here
    });
  } catch (error) {
    console.error('Error updating donation target data:', error);

    // Show error toast notification
    const toast = await toastController.create({
      message: 'Failed to update donation target. Please try again.',
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
