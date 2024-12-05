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
  
          <!-- Search and Filter Section (80:20 ratio) -->
          <div class="search-filter-container">
            <!-- Search Bar (80%) -->
            <div class="search-bar">
              <ion-searchbar v-model="searchQuery" debounce="500" placeholder="Search donation targets..."></ion-searchbar>
            </div>
  
            <!-- Filter Icon (20%) -->
            <div class="filter-icon">
              <ion-icon :icon="filter" @click="toggleFilterMenu"></ion-icon>
            </div>
          </div>
  
          <!-- Filter and Sort Section (Hidden by Default) -->
          <div v-if="isFilterMenuVisible" class="filter-sort">
            <ion-item>
              <ion-label>Sort By</ion-label>
              <ion-select v-model="sortOption" @ionChange="sortTargets">
                <ion-select-option value="name">Name</ion-select-option>
                <ion-select-option value="collectedDonations">Collected Donations</ion-select-option>
              </ion-select>
            </ion-item>
          </div>
  
          <!-- Donation Targets Table -->
          <div class="table-container">
            <ion-list>
              <!-- Table Header -->
              <ion-item class="table-header">
                <ion-label class="table-column">Field</ion-label>
                <ion-label class="table-column">Actions</ion-label>
              </ion-item>
  
              <!-- Table Rows -->
              <ion-item v-for="target in paginatedTargets" :key="target.id">
                <ion-label>
                  <h2>{{ target.name }}</h2>
                  <p>{{ target.description }}</p>
                  <span>{{ target.collectedDonations }} donations</span>
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
  import { ref, computed, onMounted } from 'vue';
  import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
  import { dataBase } from '@/firebase';
  import { trash, create, filter, add } from 'ionicons/icons';
  import { home } from 'ionicons/icons';
  
  // Router
  const router = useRouter();
  
  // Define the Donation Target type
  type DonationTarget = {
    id: string;
    name: string;
    description: string;
    collectedDonations: number;
  };
  
  // Reactive Variables
  const targets = ref<DonationTarget[]>([]);
  const sortOption = ref('name');
  const itemsPerPage = 3;
  const currentPage = ref(1);
  const searchQuery = ref('');
  const isFilterMenuVisible = ref(false);
  
  // Fetch Donation Targets
  const fetchTargets = async () => {
    const querySnapshot = await getDocs(collection(dataBase, 'donation-targets'));
    targets.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unnamed Target', // Fallback for missing name
        description: data.description || 'No Description',
        collectedDonations: data.collectedDonations || 0,
      } as DonationTarget;
    });
  };
  
  // Call fetchTargets on component mount
  onMounted(() => {
    fetchTargets();
  });
  
  // Sort Donation Targets
  const sortTargets = () => {
    targets.value.sort((a, b) => {
      if (sortOption.value === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortOption.value === 'collectedDonations') {
        return a.collectedDonations - b.collectedDonations;
      }
      return 0;
    });
  };
  
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
  
  // Toggle Filter Menu
  const toggleFilterMenu = () => {
    isFilterMenuVisible.value = !isFilterMenuVisible.value;
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
      fetchTargets();  // Refresh the donation target list after deletion
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
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .search-bar {
    flex: 8; /* 80% */
  }
  
  .filter-icon {
    flex: 2; /* 20% */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .filter-sort {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  
  ion-icon {
    color: #666;
  }
  
  ion-label h2 {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  
  ion-label p {
    font-size: 14px;
    color: #666;
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
  
  .table-column {
    flex: 1;
  }
  </style>
  