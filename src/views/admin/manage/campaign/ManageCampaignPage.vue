<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Manage Campaigns</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content fullscreen>
        <div class="crud-container">
          <!-- Add Campaign Button -->
          <div class="header-actions">
            <ion-button expand="block" @click="addCampaign">
              <ion-icon slot="start" name="add-outline"></ion-icon>
              Add New Campaign
            </ion-button>
          </div>
  
          <!-- Search and Filter Section (80:20 ratio) -->
          <div class="search-filter-container">
            <!-- Search Bar (80%) -->
            <div class="search-bar">
              <ion-searchbar v-model="searchQuery" debounce="500" placeholder="Search campaigns..."></ion-searchbar>
            </div>
  
            <!-- Filter Icon (20%) -->
            <div class="filter-icon">
              <ion-icon name="filter-outline" @click="toggleFilterMenu"></ion-icon>
            </div>
          </div>
  
          <!-- Filter Section (Hidden by Default) -->
          <div v-if="isFilterMenuVisible" class="filter-sort">
            <ion-item>
              <ion-label>Sort By</ion-label>
              <ion-select v-model="sortOption" @ionChange="sortCampaigns">
                <ion-select-option value="name">Campaign Name</ion-select-option>
                <ion-select-option value="status">Status</ion-select-option>
              </ion-select>
            </ion-item>
          </div>
  
          <!-- Campaigns Table -->
          <div class="table-container">
            <ion-list>
              <!-- Table Header -->
              <ion-item class="table-header">
                <ion-label class="table-column">Campaign Name</ion-label>
                <ion-label class="table-column">Status</ion-label>
                <ion-label class="table-column">Actions</ion-label>
              </ion-item>
              
              <!-- Table Rows -->
              <ion-item v-for="campaign in paginatedCampaigns" :key="campaign.id">
                <ion-label>
                  <h2>{{ campaign.name }}</h2>
                  <p>{{ campaign.status }}</p>
                </ion-label>
                <ion-button color="primary" fill="outline" @click="editCampaign(campaign.id)">
                  <ion-icon slot="icon-only" :icon="create"></ion-icon>
                </ion-button>
                <ion-button color="danger" fill="outline" @click="deleteCampaign(campaign.id)">
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
  import { ref, computed } from 'vue';
  import { trash, create } from "ionicons/icons";
  
  // Example Campaign Data
  const campaigns = ref([
    { id: 1, name: 'Spring Sale', status: 'Active' },
    { id: 2, name: 'Winter Campaign', status: 'Inactive' },
    { id: 3, name: 'Summer Collection', status: 'Active' },
    { id: 4, name: 'Black Friday', status: 'Completed' },
    { id: 5, name: 'Back to School', status: 'Active' },
    { id: 6, name: 'Holiday Deals', status: 'Inactive' },
  ]);
  
  const sortOption = ref('name');
  const itemsPerPage = 3;
  const currentPage = ref(1);
  const searchQuery = ref('');
  const isFilterMenuVisible = ref(false);
  
  // Methods for CRUD operations
  const addCampaign = () => {
    console.log('Add Campaign');
  };
  
  const editCampaign = (id: number) => {
    console.log(`Edit Campaign: ${id}`);
  };
  
  const deleteCampaign = (id: number) => {
    console.log(`Delete Campaign: ${id}`);
  };
  
  // Sorting Functionality
  const sortCampaigns = () => {
    campaigns.value.sort((a, b) => {
      if (sortOption.value === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption.value === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
  };
  
  // Search Functionality
  const filteredCampaigns = computed(() => {
    const searchLower = searchQuery.value.toLowerCase();
    return campaigns.value.filter(campaign =>
      campaign.name.toLowerCase().includes(searchLower) || campaign.status.toLowerCase().includes(searchLower)
    );
  });
  
  // Pagination Functionality
  const totalPages = computed(() => Math.ceil(filteredCampaigns.value.length / itemsPerPage));
  
  const paginatedCampaigns = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCampaigns.value.slice(start, end);
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
  
  // Toggle the filter menu visibility
  const toggleFilterMenu = () => {
    isFilterMenuVisible.value = !isFilterMenuVisible.value;
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
  