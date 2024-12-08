<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="() => router.push('/dashboard')">
            <ion-icon slot="icon-only" :icon="home"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Manage Donation Targets</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div class="crud-container">
        <!-- Add Donation Target Button -->
        <div class="header-actions">
          <ion-button expand="block" @click="() => router.push('/manage-target/add')">
            <ion-icon slot="start" :icon="add"></ion-icon>
            Add New Donation Target
          </ion-button>
        </div>

        <!-- Search and Filter Section -->
        <div class="search-filter-container">
          <div class="search-bar">
            <ion-searchbar
              v-model="searchQuery"
              debounce="500"
              placeholder="Search donation targets..."
            ></ion-searchbar>
          </div>
        </div>

        <!-- Donation Targets Table -->
        <div class="table-container">
          <ion-list>
            <!-- Table Header -->
            <ion-item class="table-header">
              <ion-label class="table-column">Target Name</ion-label>
              <ion-label class="table-column">Description</ion-label>
              <ion-label class="table-column">Actions</ion-label>
            </ion-item>

            <!-- Table Rows -->
            <ion-item v-for="target in paginatedTargets" :key="target.id">
              <ion-label>
                <h2>{{ target.name }}</h2>
                <p>{{ target.description }}</p>
              </ion-label>
              <ion-button color="primary" fill="outline" @click="editTarget(target)">
                <ion-icon slot="icon-only" :icon="create"></ion-icon>
              </ion-button>
              <ion-button color="danger" fill="outline" @click="deleteTarget(target.id)">
                <ion-icon slot="icon-only" :icon="trash"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <ion-button :disabled="currentPage === 1" @click="previousPage">
            Previous
          </ion-button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <ion-button :disabled="currentPage === totalPages" @click="nextPage">
            Next
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

// Router
const router = useRouter();

// Define the Donation Target type
type DonationTarget = {
  id: string;
  name: string;
  description: string;
};

// Reactive Variables
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
      name: data.name || 'Unnamed Target', // Fallback for missing name
      description: data.description || 'No Description',
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

// Delete Donation Target
const deleteTarget = async (targetId: string) => {
  const targetRef = doc(dataBase, 'donation-targets', targetId);
  try {
    await deleteDoc(targetRef);
    alert('Donation target deleted successfully!');
    fetchTargets(); // Refresh the donation target list after deletion
  } catch (error) {
    console.error('Error deleting donation target:', error);
    alert('Failed to delete donation target.');
  }
};
</script>

<style scoped>
ion-content {
  --background: #f9fafc;
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
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.table-header {
  font-weight: bold;
}

ion-item {
  --background-hover: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 10px;
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
</style>
