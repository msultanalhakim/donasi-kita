<template>
  <ion-page>
    <!-- Side Menu -->
    <ion-menu side="start" menu-id="first" content-id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item button @click="() => router.push('/dashboard')">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
            Dashboard
          </ion-item>
          <ion-item button @click="() => router.push('/manage-user')">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
            Manage Users
          </ion-item>
          <ion-item button @click="() => router.push('/manage-category')">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
            Manage Categories
          </ion-item>
          <ion-item button @click="navigateTo('settings')">
            <ion-icon slot="start" :icon="settingsOutline"></ion-icon>
            Settings
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-menu>

    <!-- Main Content -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button> <!-- Menu Button -->
        </ion-buttons>
        <ion-title>Manage Categories</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content id="main-content" fullscreen>
      <div class="crud-container">
        <!-- Add Category Button -->
        <div class="header-actions">
          <ion-button expand="block" @click="addCategory">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
            Add New Category
          </ion-button>
        </div>

        <!-- Search and Filter Section (80:20 ratio) -->
        <div class="search-filter-container">
          <!-- Search Bar (80%) -->
          <div class="search-bar">
            <ion-searchbar v-model="searchQuery" debounce="500" placeholder="Search categories..."></ion-searchbar>
          </div>

          <!-- Filter Icon (20%) -->
          <div class="filter-icon">
            <ion-icon :icon="filterOutline" @click="toggleFilterMenu"></ion-icon>
          </div>
        </div>

        <!-- Filter Section (Hidden by Default) -->
        <div v-if="isFilterMenuVisible" class="filter-sort">
          <ion-item>
            <ion-label>Sort By</ion-label>
            <ion-select v-model="sortOption" @ionChange="sortCategories">
              <ion-select-option value="name">Name</ion-select-option>
              <ion-select-option value="description">Description</ion-select-option>
            </ion-select>
          </ion-item>
        </div>

        <!-- Categories Table -->
        <div class="table-container">
          <ion-list>
            <!-- Table Header -->
            <ion-item class="table-header">
              <ion-label class="table-column">Category Name</ion-label>
              <ion-label class="table-column">Actions</ion-label>
            </ion-item>

            <!-- Table Rows -->
            <ion-item v-for="category in paginatedCategories" :key="category.id">
              <ion-label>
                <h2>{{ category.name }}</h2>
                <p>{{ category.description }}</p>
              </ion-label>
              <ion-button color="primary" fill="outline" @click="editCategory(category.id)">
                <ion-icon slot="icon-only" :icon="create"></ion-icon>
              </ion-button>
              <ion-button color="danger" fill="outline" @click="deleteCategory(category.id)">
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
import { ref, computed } from 'vue';
import { trash, create, filterOutline, addOutline, settingsOutline } from "ionicons/icons";

const router = useRouter();

// Example Category Data
const categories = ref([
  { id: 1, name: 'Electronics', description: 'Devices and gadgets' },
  { id: 2, name: 'Furniture', description: 'Home and office furniture' },
  { id: 3, name: 'Clothing', description: 'Apparel and accessories' },
  { id: 4, name: 'Books', description: 'All kinds of books' },
  { id: 5, name: 'Toys', description: 'Children and adult toys' },
  { id: 6, name: 'Sports', description: 'Sporting goods' },
]);

const sortOption = ref('name');
const itemsPerPage = 3;
const currentPage = ref(1);
const searchQuery = ref('');
const isFilterMenuVisible = ref(false);

// Methods for CRUD operations
const addCategory = () => {
  console.log('Add Category');
};

const editCategory = (id: number) => {
  console.log(`Edit Category: ${id}`);
};

const deleteCategory = (id: number) => {
  console.log(`Delete Category: ${id}`);
};

// Sorting Functionality
const sortCategories = () => {
  categories.value.sort((a, b) => {
    if (sortOption.value === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption.value === 'description') {
      return a.description.localeCompare(b.description);
    }
    return 0;
  });
};

// Search Functionality
const filteredCategories = computed(() => {
  const searchLower = searchQuery.value.toLowerCase();
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchLower) || category.description.toLowerCase().includes(searchLower)
  );
});

// Pagination Functionality
const totalPages = computed(() => Math.ceil(filteredCategories.value.length / itemsPerPage));

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCategories.value.slice(start, end);
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
}
// Navigation Function
const navigateTo = (page: string) => {
  console.log(`Navigate to ${page}`);
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
