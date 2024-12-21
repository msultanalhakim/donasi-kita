<template>
    <ion-page>
      <!-- Header -->
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-button @click="navigateToDashboard" color="light">
              <ion-icon slot="icon-only" :icon="home"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Manage Donations</ion-title>
        </ion-toolbar>
  
        <!-- Sub-header for Donations List -->
        <ion-toolbar color="light">
          <ion-title size="small">Donations List Overview</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="navigateToAddDonation" color="success">
              <ion-icon slot="start" :icon="add"></ion-icon>
              Add Donation
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <!-- Content -->
      <ion-content fullscreen>
        <div class="crud-container">
          <!-- Search Section -->
          <div class="search-filter-container">
            <ion-searchbar
              v-model="searchQuery"
              debounce="500"
              placeholder="Search donations..."
              show-clear-button="focus"
            ></ion-searchbar>
          </div>
  
          <!-- Donation List -->
          <div class="table-container">
            <ion-list>
              <ion-item v-for="donation in paginatedDonations" :key="donation.id" lines="inset">
                <ion-label>
                  <div class="donation-card">
                    <div class="donation-header">
                      <h2>{{ donation.barang }}</h2>{{  }}
                      <!-- Ensure donation and status exist before checking conditions -->
                      <ion-button 
                        v-if="donation?.status === false" 
                        color="transparent" 
                        @click="verifyDonation(donation.id)" 
                        class="donation-false"
                      >
                      <ion-icon slot="icon-only" :icon="checkbox" style="font-size: 18px;color: green;"></ion-icon>
                        Verify
                      </ion-button>
                      <ion-button 
                        v-if="donation?.status === true" 
                        color="transparent" 
                        class="donation-true"
                        disabled
                      >
                        <ion-icon slot="icon-only" :icon="checkbox" style="font-size: 18px;"></ion-icon>
                        Verified
                      </ion-button>
                    </div>
                    <div class="donation-info">
                      <p><strong>Kategori:</strong> {{ donation.kategori }}</p>
                      <p><strong>Penerima:</strong> {{ donation.penerima }}</p>
                      <p><strong>Jumlah:</strong> {{ donation.jumlah }}</p>
                      <p><strong>Metode Pengiriman:</strong> {{ donation.metodePengiriman }}</p>
                      <p><strong>User Email:</strong> {{ donation.email }}</p>
                    </div>
                    <ion-buttons slot="end" class="button-group">
                      <ion-button color="primary" fill="outline" @click="editDonation(donation)">
                        <ion-icon slot="icon-only" :icon="create" style="font-size: 18px;"></ion-icon>
                      </ion-button>
                      <ion-button color="danger" fill="outline" @click="deleteDonation(donation.id)">
                        <ion-icon slot="icon-only" :icon="trash" style="font-size: 18px;"></ion-icon>
                      </ion-button>
                    </ion-buttons>
                  </div>
                </ion-label>
              </ion-item>
            </ion-list>
          </div>
  
          <!-- Pagination -->
          <div class="pagination">
            <ion-button :disabled="currentPage === 1" @click="previousPage" class="custom-pagination-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </ion-button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <ion-button :disabled="currentPage === totalPages" @click="nextPage" class="custom-pagination-button">
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
  import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
  import { dataBase } from '@/firebase';
  import { trash, create, add, home, checkboxOutline, checkbox } from 'ionicons/icons';
  import { alertController, toastController } from '@ionic/vue';
  
  // Router
  const router = useRouter();
  
  /// Define the Donation type
type Donation = {
  timestamp: any;
  id: string;
  barang: string;
  jumlah: number;
  kategori: string;
  metodePengiriman: string;
  penerima: string;
  email: string;
  tanggal: string | Date;
  status: string | boolean;
};

// Reactive Variables
const donations = ref<Donation[]>([]);
const itemsPerPage = 5;
const currentPage = ref(1);
const searchQuery = ref('');

const fetchDonations = async () => {
  try {
    // Query to fetch donations, ordered by 'timestamp'
    const donationsQuery = query(
      collection(dataBase, 'donations'),
      orderBy('timestamp', 'desc') // Order by 'timestamp' descending
    );

    // Fetch the sorted documents from Firestore
    const querySnapshot = await getDocs(donationsQuery);

    // Map the fetched documents to Donation type
    donations.value = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();

        if (!data.timestamp) {
          console.error(`Missing 'timestamp' for donation ID: ${doc.id}`);
          return null; // Skip documents with missing 'timestamp'
        }

        const timestampDate = data.timestamp.toDate 
          ? data.timestamp.toDate() 
          : new Date(); // Convert Firestore Timestamp to Date

        return {
          id: doc.id,
          barang: String(data.barang || 'Unnamed Item'), // Ensure type string
          jumlah: Number(data.jumlah || 0), // Ensure type number
          kategori: String(data.kategori || 'No Category'), // Ensure type string
          metodePengiriman: String(data.metodePengiriman || 'No Delivery Type'), // Ensure type string
          penerima: String(data.penerima || 'No Target'), // Ensure type string
          email: String(data.email || 'No Email'), // Ensure type string
          timestamp: timestampDate, // Use the timestamp as a Date
          tanggal: timestampDate.toISOString().split("T")[0], // Derive 'tanggal' from timestamp
          status: data.status ?? false, // Ensure type string | boolean
        } as Donation;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null) // Filter out null values
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Explicitly sort by timestamp
  } catch (error) {
    console.error("Error fetching donations:", error);
  }
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
    return donations.value.filter((donation) =>
      (donation.barang || '').toLowerCase().includes(searchLower) ||
      (donation.kategori || '').toLowerCase().includes(searchLower)
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
  
  const verifyDonation = async (donationId: string) => {
  const alert = await alertController.create({
    header: "Confirm Verification",
    message: "Are you sure you want to verify this donation?",
    buttons: [
      {
        text: "No",
        role: "cancel",
        handler: () => {
          console.log("Verification canceled.");
        },
      },
      {
        text: "Yes",
        handler: async () => {
          try {
            const docRef = doc(dataBase, "donations", donationId);
            await updateDoc(docRef, {
              status: true, // Update to a boolean for consistency
            });

            const toast = await toastController.create({
              message: "Donation has been verified!",
              duration: 2000,
              color: "secondary",
              position: "top",
            });
            toast.present();

            // Refresh the page
            location.reload();
          } catch (error) {
            console.error("Error verifying donation:", error);

            const errorToast = await toastController.create({
              message: "An error occurred while verifying the donation.",
              duration: 2000,
              color: "danger",
              position: "top",
            });
            errorToast.present();
          }
        },
      },
    ],
  });

  await alert.present();
};
  
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
                color: 'danger', // Red color for danger (or success, depending on context)
                position: 'top'
              });
              toast.present();
              
              fetchDonations(); // Refresh the donation list after deletion
            } catch (error) {
              console.error('Error deleting donation:', error);
              
              // Show error toast notification
              const toast = await toastController.create({
                message: 'Error deleting donation. Please try again.',
                duration: 2000,
                color: 'secondary'
              });
              toast.present();
            }
          }
        }
      ]
    });
    await alert.present();
  };
  
  // Navigation helpers
  const navigateToDashboard = () => router.push('/dashboard');
  const navigateToAddDonation = () => router.push('/manage-donation/add');
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
    margin-bottom: 25px;
    text-align: center;
  }
  
  .search-filter-container {
    margin-bottom: 20px;
  }
  
  .table-container {
    padding: 15px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
  
  .donation-card {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .donation-header {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  
  .donation-header .donation-false{
    background: #e0e0e0;
    color: green;
    padding: 6px 12px;
    border-radius: 20px;
  }
  
  .donation-header .donation-true{
    background: green;
    color: #e0e0e0;
    padding: 6px 12px;
    border-radius: 20px;
  }
  
  .donation-header h2 {
    font-size: 22px;
    font-weight: bold;
    margin: 0;
    color: #333;
  }
  
  .donation-info p {
    margin: 8px 0;
    color: #666;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
  }
  
  .custom-pagination-button {
    padding: 10px;
    font-size: 18px;
  }
  
  .button-group ion-button {
    margin-left: 8px;
  }
  .button-group {
  display: flex;
  justify-content: flex-end;
}
  </style>
  