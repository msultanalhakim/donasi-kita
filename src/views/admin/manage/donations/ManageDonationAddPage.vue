<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>Add New Donation</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content fullscreen>
        <div class="form-container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Add New Donation</ion-card-title>
            </ion-card-header>
            
            <ion-card-content>

                <!-- User Email Selection -->
              <ion-item>
                <ion-label position="stacked">User Email</ion-label>
                <ion-select v-model="userEmail" placeholder="Select a user email" required>
                  <ion-select-option
                    v-for="user in users"
                    :key="user.id"
                    :value="user.email"
                  >
                    {{ user.email }}
                  </ion-select-option>
                </ion-select>
              </ion-item>

              <!-- Donation Target Selection -->
              <ion-item>
                <ion-label position="stacked">Donation Target</ion-label>
                <ion-select v-model="donationTarget" placeholder="Select donation target" required>
                  <ion-select-option
                    v-for="target in donationTargets"
                    :key="target.id"
                    :value="target.name"
                  >
                    {{ target.name }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
  
              <ion-item>
                <ion-label position="stacked">Item Name</ion-label>
                <ion-input
                  v-model="donationName"
                  placeholder="Enter donation name"
                  required
                ></ion-input>
              </ion-item>
  
              <!-- Category Selection -->
              <ion-item>
                <ion-label position="stacked">Category Item</ion-label>
                <ion-select v-model="donationCategories" placeholder="Select category" required>
                  <ion-select-option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.name"
                  >
                    {{ category.name }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
  
              <ion-item>
                <ion-label position="stacked">Quantity</ion-label>
                <ion-input
                  v-model="donationQuantity"
                  placeholder="Enter donation quantity"
                  type="number"
                  required
                ></ion-input>
              </ion-item>
  
              <ion-item>
                <ion-label position="stacked">Message</ion-label>
                <ion-input
                  v-model="donationMessage"
                  placeholder="Enter a message (optional)"
                ></ion-input>
              </ion-item>
  
              <div class="button-group">
                <ion-button expand="block" color="primary" @click="addDonation">
                  Add Donation
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
  import { ref, onMounted } from 'vue';
  import { collection, addDoc, getDocs } from 'firebase/firestore';
  import { dataBase } from '@/firebase';
  import { toastController } from '@ionic/vue';
  
  // Router
  const router = useRouter();
  
  // Form Data
  const donationName = ref('');
  const donationQuantity = ref(0);
  const donationMessage = ref('');
  const donationCategories = ref('');
  const donationTarget = ref('');
  const userEmail = ref('');
  
  // Categories Data & Donation Targets Data
  const categories = ref<any[]>([]);
  const donationTargets = ref<any[]>([]);
  const users = ref<any[]>([]);
  
  // Function to show toast notifications
  const showToast = async (message: string, color: string) => {
    const toast = await toastController.create({
      message,
      duration: 2000,
      color: color,
      position: 'top',
    });
    toast.present();
  };
  
  // Function to fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(dataBase, 'categories'));
      categories.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to fetch categories. Please try again.', 'danger');
    }
  };
  
  // Function to fetch donation targets from Firestore
  const fetchDonationTargets = async () => {
    try {
      const querySnapshot = await getDocs(collection(dataBase, 'donation-targets'));
      donationTargets.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching donation targets:', error);
      showToast('Failed to fetch donation targets. Please try again.', 'danger');
    }
  };
  
  // Function to fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(dataBase, 'users'));
      users.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to fetch users. Please try again.', 'danger');
    }
  };
  
  // Fetch categories, donation targets, and users when component is mounted
  onMounted(() => {
    fetchCategories();
    fetchDonationTargets();
    fetchUsers(); // Fetch users
  });
  
  // Function to Add Donation
  const addDonation = async () => {
    if (!donationName.value.trim()) {
      showToast('Donation name is required!', 'danger');
      return;
    }
    if (donationQuantity.value <= 0) {
      showToast('Donation quantity must be greater than zero!', 'danger');
      return;
    }
    if (!donationCategories.value) {
      showToast('Category is required!', 'danger');
      return;
    }
    if (!donationTarget.value) {
      showToast('Donation target is required!', 'danger');
      return;
    }
    if (!userEmail.value) {
      showToast('User email is required!', 'danger');
      return;
    }
  
    try {
      const now = new Date();
    now.setHours(now.getHours() + 7); // Menambahkan 7 jam untuk zona waktu WIB
    
      await addDoc(collection(dataBase, 'donations'), {
        id: now.toISOString(),
        barang: donationName.value,
        jumlah: donationQuantity.value,
        pesan: donationMessage.value || 'No message provided',
        kategori: donationCategories.value, // Store selected category ID
        pemberi: userEmail.value,
        penerima: donationTarget.value, // Store selected target ID
        email: userEmail.value, // Store selected user email
        status: false,
        tanggal: now.toISOString().split("T")[0], // Menggunakan `now` yang sudah disesuaikan
        jam: now.toISOString().split("T")[1].slice(0, 5), // Menggunakan `now` yang sudah disesuaikan
      });
  
      showToast('Donation added successfully!', 'success');
  
      // Redirect to manage donation page
      router.push('/manage-donation').then(() => {
        window.dispatchEvent(new CustomEvent('data-updated'));  // Emit event here
      });
    } catch (error) {
      console.error('Error adding donation:', error);
      showToast('Failed to add donation. Please try again.', 'danger');
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
  