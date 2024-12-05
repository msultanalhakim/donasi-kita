<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/manage-target"></ion-back-button>
          </ion-buttons>
          <ion-title>Add Donation Target</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div class="form-container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Create New Donation Target</ion-card-title>
            </ion-card-header>
  
            <ion-card-content>
              <form @submit.prevent="submitForm">
                <!-- Name Field -->
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
                    v-model="form.description"
                    placeholder="Enter description"
                    class="multi-line-input"
                    required
                  ></ion-input>
                </ion-item>
  
                <!-- Image Field
                <ion-item class="input-item">
                  <ion-label position="stacked">Image</ion-label>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                    required
                  />
                </ion-item> -->
  
                <!-- Collected Donations Field -->
                <ion-item class="input-item">
                  <ion-label position="stacked">Collected Donations</ion-label>
                  <ion-input
                    type="number"
                    v-model.number="form.collectedDonations"
                    placeholder="Enter collected donations"
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
                  Submit
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
  import { getFirestore, addDoc, collection } from 'firebase/firestore';
  import { useRouter } from 'vue-router';
  
  // Inisialisasi Firestore
  const db = getFirestore();
  const router = useRouter();
  
  const form = ref({
    name: '',
    description: '',
    collectedDonations: 0,
  });
  
  const isSubmitting = ref(false);
  
  const submitForm = async () => {
    isSubmitting.value = true;
    console.log('Form submission started');
    
    try {
      // Debugging: Cek data yang akan dikirim ke Firestore
      console.log('Form data:', form.value);
  
      // Menambahkan data target donasi ke Firestore
      const docRef = await addDoc(collection(db, 'donation-targets'), {
        name: form.value.name,
        description: form.value.description,
        collectedDonations: form.value.collectedDonations,
        createdAt: new Date(),
      });
      console.log('Document added with ID:', docRef.id); // Cek ID dokumen yang ditambahkan
  
      alert('Donation target successfully added!');
      resetForm();
      router.push('/manage-target'); // Redirect ke halaman daftar target donasi
    } catch (error) {
      // Debugging: Menampilkan kesalahan lengkap
      console.error('Error submitting form:', error);
      
      if (error.code) {
        console.log('Error code:', error.code);
      }
      
      alert('Failed to add donation target. Please try again.');
    } finally {
      isSubmitting.value = false;
      console.log('Form submission ended');
    }
  };
  
  const resetForm = () => {
    form.value = {
      name: '',
      description: '',
      collectedDonations: 0,
    };
    console.log('Form has been reset');
  };
  </script>
  

  
  <style scoped>
  ion-content {
    --background: #f2f5f9;
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
  .multi-line-input {
  height: 100px; /* Set the height of the input field */
  padding-top: 10px;
  padding-bottom: 10px;
}
  </style>
  