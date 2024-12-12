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
        <ion-title>Manage Donation Targets</ion-title>
      </ion-toolbar>

      <!-- Sub-header for Donation Targets List -->
      <ion-toolbar color="light">
        <ion-title size="small">Donation Targets List Overview</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="navigateToAddTarget" color="success">
            <ion-icon slot="start" :icon="add"></ion-icon>
            Add Donation Target
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
            placeholder="Search donation targets..."
            show-clear-button="focus"
          ></ion-searchbar>
        </div>

        <!-- Donation Targets List -->
        <div class="table-container">
          <ion-list>
            <ion-item v-for="target in paginatedTargets" :key="target.id" lines="inset">
              <ion-label>
                <div class="target-card">
                  <h2>{{ target.name }}</h2>
                  <div class="target-info">
                    <p><strong>Description:</strong> {{ target.description }}</p>

                    <!-- Display Image Link -->
                    <p v-if="target.imageLink">
                      <strong>Image:</strong>
                      <img :src="target.imageLink" alt="Donation Target Image" style="max-width: 100%; height: auto; margin-top: 10px;" />
                    </p>
                  </div>
                  <ion-buttons slot="end" class="button-group">
                    <ion-button color="primary" fill="outline" @click="editTarget(target)">
                      <ion-icon slot="icon-only" :icon="create" style="font-size: 18px;"></ion-icon>
                    </ion-button>
                    <ion-button color="danger" fill="outline" @click="deleteTarget(target.id)">
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
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { dataBase } from '@/firebase';
import { trash, create, add, home } from 'ionicons/icons';
import { alertController, toastController } from '@ionic/vue';

// Router
const router = useRouter();

// Define the Donation Target type
type DonationTarget = {
  id: string;
  name: string;
  description: string;
  imageLink?: string;  // Optional image link
};

const targets = ref<DonationTarget[]>([]);
const itemsPerPage = 5;
const currentPage = ref(1);
const searchQuery = ref('');

// Fetch Donation Targets
const fetchTargets = async () => {
  const querySnapshot = await getDocs(collection(dataBase, 'donation-targets'));
  targets.value = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || 'Unnamed Target',
      description: data.description || 'No Description',
      imageLink: data.imageLink || '', // Optional field for image link
    } as DonationTarget;
  });
};

// Call fetchTargets on component mount
onMounted(() => {
  fetchTargets();
});

// Listen for the custom data-updated event
const refreshData = () => {
  fetchTargets();
};

onMounted(() => {
  window.addEventListener('data-updated', refreshData);
});

onBeforeUnmount(() => {
  window.removeEventListener('data-updated', refreshData);
});

// Search Donation Targets
const filteredTargets = computed(() => {
  const searchLower = searchQuery.value.toLowerCase();
  return targets.value.filter(target =>
    (target.name || '').toLowerCase().includes(searchLower) ||
    (target.description || '').toLowerCase().includes(searchLower)
  );
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredTargets.value.length / itemsPerPage));

const paginatedTargets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTargets.value.slice(start, end);
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

// Edit Donation Target
const editTarget = (target: DonationTarget) => {
  router.push({ name: 'ManageTargetEdit', params: { targetId: target.id } });
};

const deleteTarget = async (targetId: string) => {
  const alert = await alertController.create({
    header: 'Confirm Delete',
    message: 'Are you sure you want to delete this donation target?',
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
          const targetRef = doc(dataBase, 'donation-targets', targetId);
          try {
            await deleteDoc(targetRef);
            console.log('Donation target deleted successfully!');

            // Show success toast notification
            const toast = await toastController.create({
              message: 'Donation target deleted successfully!',
              duration: 2000,
              color: 'danger',
              position: 'top'
            });
            toast.present();

            fetchTargets(); // Refresh the list of targets after deletion
          } catch (error) {
            console.error('Error deleting donation target:', error);

            // Show error toast notification
            const toast = await toastController.create({
              message: 'Error deleting donation target. Please try again.',
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
const navigateToAddTarget = () => router.push('/manage-target/add');
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
  padding: 5px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.target-card {
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;
}

.target-card h2 {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.target-info p {
  margin: 8px 0;
  color: #555;
  font-size: 12px;
}

.target-info {
  margin-top: 10px;
}

ion-buttons ion-button {
  margin-left: 15px;
}

.pagination {
  text-align: center;
  margin-top: 25px;
  margin-bottom: 20px;
}

.pagination span {
  margin: 0 10px;
  font-size: 16px;
}

.custom-pagination-button {
  --size: 30px;
}

.pagination ion-button[disabled] {
  opacity: 0.5;
}

img {
  max-width: 100%;
  height: auto;
}
.button-group {
  display: flex;
  justify-content: flex-end;
}
</style>
