<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/manage-donation"></ion-back-button>
        </ion-buttons>
        <ion-title>Edit Donation</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div class="form-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Edit Donation</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <!-- User Email Selection -->
            <ion-item>
              <ion-label position="stacked">User Email</ion-label>
              <ion-select v-model="form.userEmail" placeholder="Select a user email" required>
                <ion-select-option v-for="user in users" :key="user.id" :value="user.email">
                  {{ user.email }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <!-- Donation Target Selection -->
            <ion-item>
              <ion-label position="stacked">Donation Target</ion-label>
              <ion-select v-model="form.donationTarget" placeholder="Select donation target" required>
                <ion-select-option v-for="target in donationTargets" :key="target.id" :value="target.name">
                  {{ target.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <!-- Item Name Input -->
            <ion-item>
              <ion-label position="stacked">Item Name</ion-label>
              <ion-input v-model="form.donationName" placeholder="Enter donation name" required></ion-input>
            </ion-item>

            <!-- Category Selection -->
            <ion-item>
              <ion-label position="stacked">Category Item</ion-label>
              <ion-select v-model="form.donationCategories" placeholder="Select category" required>
                <ion-select-option v-for="category in categories" :key="category.id" :value="category.name">
                  {{ category.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <!-- Quantity Input -->
            <ion-item>
              <ion-label position="stacked">Quantity</ion-label>
              <ion-input v-model="form.donationQuantity" placeholder="Enter donation quantity" type="number" required></ion-input>
            </ion-item>

            <!-- Delivery Type Selection -->
            <ion-item>
              <ion-label position="stacked">Delivery Type</ion-label>
              <ion-select v-model="form.deliveryType" placeholder="Select delivery type" required>
                <ion-select-option value="pickup">Pickup</ion-select-option>
                <ion-select-option value="delivery">Delivery</ion-select-option>
              </ion-select>
            </ion-item>

            <!-- Message Input -->
            <ion-item>
              <ion-label position="stacked">Message</ion-label>
              <ion-input v-model="form.donationMessage" placeholder="Enter a message (optional)"></ion-input>
            </ion-item>

            <div class="button-group">
              <ion-button expand="block" color="primary" @click="updateDonation">
                Save Changes
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { dataBase } from '@/firebase';
import { toastController } from '@ionic/vue';

// The form data model using ref
const form = ref({
  donationName: '',
  donationQuantity: 0,
  donationMessage: '',
  donationCategories: '',
  donationTarget: '',
  userEmail: '',
  deliveryType: '',
});

// Router and route
const router = useRouter();
const route = useRoute();

// Fetch donationId from route parameters
const donationId = route.params.donationId as string;

// Data for categories, donation targets, and users
const categories = ref<any[]>([]);
const donationTargets = ref<any[]>([]);
const users = ref<any[]>([]);

// Fetch existing donation data when component is mounted
onMounted(async () => {
  await fetchDonationData(donationId);
  // Fetch other necessary data like categories, donation targets, and users
  await fetchCategories();
  await fetchDonationTargets();
  await fetchUsers();
});

// Fetch existing donation data to populate the form
const fetchDonationData = async (id: string) => {
  try {
    const docRef = doc(dataBase, 'donations', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const donation = docSnap.data();
      form.value.donationName = donation.itemName;
      form.value.donationQuantity = donation.quantity;
      form.value.donationMessage = donation.message;
      form.value.donationCategories = donation.categoryItem;
      form.value.donationTarget = donation.targetDonasi;
      form.value.userEmail = donation.userEmail;
      form.value.deliveryType = donation.deliveryType;
    }
  } catch (error) {
    console.error('Error fetching donation:', error);
  }
};

  // Function to fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(dataBase, 'categories'));
      categories.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  // Function to fetch donation targets from Firestore
  const fetchDonationTargets = async () => {
    try {
      const querySnapshot = await getDocs(collection(dataBase, 'donation-targets'));
      donationTargets.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching donation targets:', error);
    }
  };
  
  // Function to fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(dataBase, 'users'));
      users.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

// Update donation in Firestore
const updateDonation = async () => {
  try {
    const docRef = doc(dataBase, 'donations', donationId);
    await updateDoc(docRef, {
      itemName: form.value.donationName,
      quantity: form.value.donationQuantity,
      message: form.value.donationMessage || 'No message provided',
      categoryItem: form.value.donationCategories,
      targetDonasi: form.value.donationTarget,
      userEmail: form.value.userEmail,
      deliveryType: form.value.deliveryType,
    });

    const toast = await toastController.create({
      message: 'Donation updated successfully!',
      duration: 2000,
      color: 'secondary',
      position: 'top',
    });
    toast.present();
    router.push('/manage-donation');
  } catch (error) {
    console.error('Error updating donation:', error);
    const toast = await toastController.create({
      message: 'Failed to update donation. Please try again.',
      duration: 2000,
      color: 'danger',
      position: 'top',
    });
    toast.present();
  }
};

// Cancel and go back
const goBack = () => {
  router.back();
};
</script>

<style scoped>
ion-content {
  --background: #f9fafc;
}

.form-container {
  padding: 20px;
}

.button-group ion-button {
  margin-top: 10px;
}
</style>
