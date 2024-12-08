<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="() => router.push('/dashboard')">
            <ion-icon slot="icon-only" :icon="home"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Manage Categories</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div class="crud-container">
        <!-- Add Category Button -->
        <div class="header-actions">
          <ion-button expand="block" @click="() => router.push('/manage-category/add')">
            <ion-icon slot="start" :icon="add"></ion-icon>
            Add New Category
          </ion-button>
        </div>

        <!-- Search and Filter Section -->
        <div class="search-filter-container">
          <div class="search-bar">
            <ion-searchbar
              v-model="searchQuery"
              debounce="500"
              placeholder="Search categories..."
            ></ion-searchbar>
          </div>
        </div>

        <!-- Categories Table -->
        <div class="table-container">
          <ion-list>
            <!-- Table Header -->
            <ion-item class="table-header">
              <ion-label class="table-column">Category Name</ion-label>
              <ion-label class="table-column">Description</ion-label>
              <ion-label class="table-column">Actions</ion-label>
            </ion-item>

            <!-- Table Rows -->
            <ion-item v-for="category in paginatedCategories" :key="category.id">
              <ion-label>
                <h2>{{ category.name }}</h2>
                <p>{{ category.description }}</p>
              </ion-label>
              <ion-button color="primary" fill="outline" @click="editCategory(category)">
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { dataBase } from '@/firebase';
import { trash, create, add, home } from 'ionicons/icons';

// Router
const router = useRouter();

// Define the Category type
type Category = {
  id: string;
  name: string;
  description: string;
};

// Reactive Variables
const categories = ref<Category[]>([]);
const itemsPerPage = 5;
const currentPage = ref(1);
const searchQuery = ref('');

// Fetch Categories
const fetchCategories = async () => {
  const querySnapshot = await getDocs(collection(dataBase, 'categories'));
  categories.value = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || 'Unnamed Category', // Fallback for missing name
      description: data.description || 'No Description',
    } as Category;
  });
};

// Call fetchCategories on component mount
onMounted(() => {
  fetchCategories();
});

// Listen for the custom data-updated event
const refreshData = () => {
  fetchCategories();
};

onMounted(() => {
  window.addEventListener('data-updated', refreshData);
});

onBeforeUnmount(() => {
  window.removeEventListener('data-updated', refreshData);
});

// Search Categories
const filteredCategories = computed(() => {
  const searchLower = searchQuery.value.toLowerCase();
  return categories.value.filter(category =>
    (category.name || '').toLowerCase().includes(searchLower) ||
    (category.description || '').toLowerCase().includes(searchLower)
  );
});

// Pagination
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

// Edit Category
const editCategory = (category: Category) => {
  router.push({ name: 'ManageCategoryEdit', params: { categoriesId: category.id } });
};

// Delete Category
const deleteCategory = async (categoriesId: string) => {
  const categoryRef = doc(dataBase, 'categories', categoriesId);
  try {
    await deleteDoc(categoryRef);
    alert('Category deleted successfully!');
    fetchCategories(); // Refresh the category list after deletion
  } catch (error) {
    console.error('Error deleting category:', error);
    alert('Failed to delete category.');
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
