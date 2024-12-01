<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Manage Articles</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content fullscreen>
        <div class="crud-container">
          <!-- Add Article Button -->
          <div class="header-actions">
            <ion-button expand="block" @click="addArticle">
              <ion-icon slot="start" name="add-outline"></ion-icon>
              Add New Article
            </ion-button>
          </div>
  
          <!-- Search and Filter Section (80:20 ratio) -->
          <div class="search-filter-container">
            <!-- Search Bar (80%) -->
            <div class="search-bar">
              <ion-searchbar v-model="searchQuery" debounce="500" placeholder="Search articles..."></ion-searchbar>
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
              <ion-select v-model="sortOption" @ionChange="sortArticles">
                <ion-select-option value="title">Article Title</ion-select-option>
                <ion-select-option value="date">Date Published</ion-select-option>
              </ion-select>
            </ion-item>
          </div>
  
          <!-- Articles Table -->
          <div class="table-container">
            <ion-list>
              <!-- Table Header -->
              <ion-item class="table-header">
                <ion-label class="table-column">Title</ion-label>
                <ion-label class="table-column">Date Published</ion-label>
                <ion-label class="table-column">Actions</ion-label>
              </ion-item>
              
              <!-- Table Rows -->
              <ion-item v-for="article in paginatedArticles" :key="article.id">
                <ion-label>
                  <h2>{{ article.title }}</h2>
                  <p>{{ article.datePublished }}</p>
                </ion-label>
                <ion-button color="primary" fill="outline" @click="editArticle(article.id)">
                  <ion-icon slot="icon-only" :icon="create"></ion-icon>
                </ion-button>
                <ion-button color="danger" fill="outline" @click="deleteArticle(article.id)">
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
  
  // Example Article Data
  const articles = ref([
    { id: 1, title: 'How to Build a Vue App', datePublished: '2024-11-01' },
    { id: 2, title: 'Getting Started with Ionic', datePublished: '2024-10-25' },
    { id: 3, title: 'Mastering JavaScript', datePublished: '2024-09-15' },
    { id: 4, title: 'Understanding Vuex', datePublished: '2024-11-10' },
    { id: 5, title: 'CSS Grid Layout', datePublished: '2024-08-30' },
    { id: 6, title: 'Introduction to TypeScript', datePublished: '2024-11-05' },
  ]);
  
  const sortOption = ref('title');
  const itemsPerPage = 3;
  const currentPage = ref(1);
  const searchQuery = ref('');
  const isFilterMenuVisible = ref(false);
  
  // Methods for CRUD operations
  const addArticle = () => {
    console.log('Add Article');
  };
  
  const editArticle = (id: number) => {
    console.log(`Edit Article: ${id}`);
  };
  
  const deleteArticle = (id: number) => {
    console.log(`Delete Article: ${id}`);
  };
  
  // Sorting Functionality
  const sortArticles = () => {
    articles.value.sort((a, b) => {
      if (sortOption.value === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortOption.value === 'date') {
        return new Date(a.datePublished).getTime() - new Date(b.datePublished).getTime();
      }
      return 0;
    });
  };
  
  // Search Functionality
  const filteredArticles = computed(() => {
    const searchLower = searchQuery.value.toLowerCase();
    return articles.value.filter(article =>
      article.title.toLowerCase().includes(searchLower) || article.datePublished.toLowerCase().includes(searchLower)
    );
  });
  
  // Pagination Functionality
  const totalPages = computed(() => Math.ceil(filteredArticles.value.length / itemsPerPage));
  
  const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredArticles.value.slice(start, end);
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
  