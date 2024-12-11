<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="end">
            <ion-button @click="() => router.push('/dashboard')" color="light">
              <ion-icon slot="icon-only" :icon="home"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Manage Donations</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content fullscreen>
        <div class="crud-container">
          <!-- Add Donation Button -->
          <div class="header-actions">
            <ion-button expand="block" @click="() => router.push('/manage-donations/add')" color="success">
              <ion-icon slot="start" :icon="add"></ion-icon>
              Add New Donation
            </ion-button>
          </div>
  
          <!-- Search Section -->
          <div class="search-filter-container">
            <ion-searchbar
              v-model="searchQuery"
              debounce="500"
              placeholder="Search donations..."
            ></ion-searchbar>
          </div>
  
          <!-- Donations Table -->
          <div class="table-container" v-if="donations.length > 0">
            <ion-list>
              <!-- Table Header -->
              <ion-item class="table-header">
                <ion-label class="table-column">Item Name</ion-label>
                <ion-label class="table-column">Quantity</ion-label>
                <ion-label class="table-column">Category</ion-label>
                <ion-label class="table-column">Delivery Type</ion-label>
                <ion-label class="table-column">Target</ion-label>
                <ion-label class="table-column">User Email</ion-label>
                <ion-label class="table-column">Actions</ion-label>
              </ion-item>
  
              <!-- Table Rows -->
              <ion-item v-for="donation in paginatedDonations" :key="donation.id" lines="inset">
                <ion-label>
                  <h2>{{ donation.itemName }}</h2>
                  <p><strong>Quantity:</strong> {{ donation.quantity }}</p>
                  <p><strong>Category:</strong> {{ donation.categoryItem }}</p>
                  <p><strong>Delivery Type:</strong> {{ donation.deliveryType }}</p>
                  <p><strong>Target:</strong> {{ donation.targetDonasi }}</p>
                  <p><strong>User Email:</strong> {{ donation.userEmail }}</p>
                </ion-label>
                <ion-buttons slot="end">
                  <ion-button color="primary" fill="outline" @click="editDonation(donation)">
                    <ion-icon slot="icon-only" :icon="create"></ion-icon>
                  </ion-button>
                  <ion-button color="danger" fill="outline" @click="deleteDonation(donation.id)">
                    <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                  </ion-button>
                </ion-buttons>
              </ion-item>
            </ion-list>
          </div>
  
          <!-- No Data Message -->
          <div v-else class="no-data">
            <p>No donations available. Please add a new donation.</p>
          </div>
  
          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <ion-button :disabled="currentPage === 1" @click="previousPage" color="tertiary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </ion-button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <ion-button :disabled="currentPage === totalPages" @click="nextPage" color="tertiary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </ion-button>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
  import { dataBase } from '@/firebase';
  import { trash, create, add, home } from 'ionicons/icons';
  import { alertController, toastController } from '@ionic/vue';
  
  // Router
  const router = useRouter();
  
  // Define the Donation type
  type Donation = {
    id: string;
    itemName: string;
    quantity: number;
    categoryItem: string;
    deliveryType: string;
    targetDonasi: string;
    userEmail: string;
  };
  
  // Reactive Variables
  const donations = ref<Donation[]>([]);
  const itemsPerPage = 5;
  const currentPage = ref(1);
  const searchQuery = ref('');
  
  // Fetch Donations
  const fetchDonations = async () => {
    const querySnapshot = await getDocs(collection(dataBase, 'donations'));
    donations.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        itemName: data.itemName || 'Unnamed Item',
        quantity: data.quantity || 0,
        categoryItem: data.categoryItem || 'No Category',
        deliveryType: data.deliveryType || 'No Delivery Type',
        targetDonasi: data.targetDonasi || 'No Target',
        userEmail: data.userEmail || 'No Email',
      } as Donation;
    });
  };
  
  // Call fetchDonations on component mount
  onMounted(() => {
    fetchDonations();
  });
  
  // Listen for the custom data-updated event
  const refreshData = () => {
    fetchDonations();
  };
  
  onMounted(() => {
    window.addEventListener('data-updated', refreshData);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('data-updated', refreshData);
  });
  
  // Search Donations
  const filteredDonations = computed(() => {
    const searchLower = searchQuery.value.toLowerCase();
    return donations.value.filter(donation =>
      (donation.itemName || '').toLowerCase().includes(searchLower) ||
      (donation.categoryItem || '').toLowerCase().includes(searchLower)
    );
  });
  
  // Pagination
  const totalPages = computed(() => Math.ceil(filteredDonations.value.length / itemsPerPage));
  
  const paginatedDonations = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredDonations.value.slice(start, end);
  });
  
  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };
  
  // Edit Donation
  const editDonation = (donation: Donation) => {
    router.push({ name: 'ManageDonationEdit', params: { donationId: donation.id } });
  };
  
  // Delete Donation
  const deleteDonation = async (donationId: string) => {
    const alert = await alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this donation?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete canceled');
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            const donationRef = doc(dataBase, 'donations', donationId);
            try {
              await deleteDoc(donationRef);
              console.log('Donation deleted successfully!');
              
              // Show success toast notification
              const toast = await toastController.create({
                message: 'Donation deleted successfully!',
                duration: 2000,
                color: 'danger', // Use danger color for delete actions
                position: 'top',
              });
              toast.present();
  
              fetchDonations(); // Refresh the donation list after deletion
            } catch (error) {
              console.error('Error deleting donation:', error);
  
              // Show error toast notification
              const toast = await toastController.create({
                message: 'Failed to delete donation.',
                duration: 2000,
                color: 'danger', // Red color for error
                position: 'top',
              });
              toast.present();
            }
          }
        }
      ]
    });
    await alert.present();
  };
  
  // Navigate to Add Donation
  const goToAddDonation = () => router.push('/manage-donation/add');
  </script>
  
  
  <style scoped>

  ion-content {
    --background: #f4f7fa;
    font-family: 'Arial', sans-serif;
  }
  
  .crud-container {
    padding: 20px;
  }
  
  .header-actions {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .search-filter-container {
    margin-bottom: 20px;
  }
  
  .table-container {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    padding: 15px;
  }
  
  .table-header {
    font-weight: bold;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 10px;
  }
  
  ion-item {
    --background-hover: #f7f7f7;
    border-radius: 10px;
    margin-bottom: 12px;
  }
  
  ion-item h2 {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    color: #333;
  }
  
  ion-item p {
    margin: 4px 0;
    color: #555;
    font-size: 14px;
  }
  
  ion-buttons ion-button {
    margin-left: 10px;
  }
  
  .pagination {
    text-align: center;
    margin-top: 20px;
  }
  
  .pagination span {
    margin: 0 15px;
    font-size: 14px;
    color: #333;
  }
  
  ion-button {
    --border-radius: 8px;
  }
  
  ion-button[fill="outline"] {
    --border-color: #ccc;
    --border-width: 1px;
    --color: #333;
  }
  
  ion-button[fill="outline"]:hover {
    --background: #f2f2f2;
  }
  
  ion-button[color="success"] {
    --background: #28a745;
    --color: white;
  }
  
  ion-button[color="primary"] {
    --background: #007bff;
    --color: white;
  }
  
  ion-button[color="danger"] {
    --background: #dc3545;
    --color: white;
  }
  
  ion-button[color="tertiary"] {
    --background: #f0f0f0;
    --color: #007bff;
  }
  </style>