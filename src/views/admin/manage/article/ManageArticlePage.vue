<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="end">
          <ion-button @click="navigateToDashboard" color="light">
            <ion-icon slot="icon-only" :icon="home"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Manage Articles</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div class="crud-container">
        <!-- Add Article Button -->
        <div class="header-actions">
          <ion-button expand="block" @click="navigateToAddArticle" color="success">
            <ion-icon slot="start" :icon="add"></ion-icon>
            Add New Article
          </ion-button>
        </div>

        <!-- Search Section -->
        <div class="search-filter-container">
          <ion-searchbar
            v-model="searchQuery"
            debounce="500"
            placeholder="Search articles..."
            show-clear-button="focus"
          ></ion-searchbar>
        </div>

        <!-- Articles Table -->
        <div class="table-container">
          <ion-list>
            <!-- Table Header -->
            <ion-item class="table-header">
              <ion-label class="table-column">Title</ion-label>
              <ion-label class="table-column">Author</ion-label>
              <ion-label class="table-column">Desc</ion-label>
              <ion-label class="table-column">CA</ion-label>
              <ion-label class="table-column">LU</ion-label>
              <ion-label class="table-column">Actions</ion-label>
            </ion-item>

            <!-- Table Rows -->
            <ion-item v-for="article in paginatedArticles" :key="article.id" lines="inset">
              <ion-label>
                <h2>{{ article.title }}</h2>
                <p><strong>Author :</strong> {{ article.author }}</p>
                <p><strong>Content :</strong> {{ article.description }}</p>
                <p><strong>Created At :</strong> {{ formatDate(article.createdAt) }}</p>
                <p><strong>Last Updated :</strong> {{ formatDate(article.lastUpdated) }}</p>
              </ion-label>
              <ion-buttons slot="end">
                <ion-button color="primary" fill="outline" @click="editArticle(article)">
                  <ion-icon slot="icon-only" :icon="create"></ion-icon>
                </ion-button>
                <ion-button color="danger" fill="outline" @click="deleteArticle(article.id)">
                  <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-item>
          </ion-list>
        </div>

        <!-- Pagination -->
        <div class="pagination">
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

// Define the Article type
type Article = {
  id: string;
  title: string;
  author: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
};

// Reactive Variables
const articles = ref<Article[]>([]);
const itemsPerPage = 5;
const currentPage = ref(1);
const searchQuery = ref('');

// Fetch Articles
const fetchArticles = async () => {
  const querySnapshot = await getDocs(collection(dataBase, 'articles'));
  articles.value = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || 'Untitled Article',
      author: data.author || 'Unknown Author',
      description: data.description || 'No Description',
      createdAt: data.createdAt || null, 
      lastUpdated: data.lastUpdated || null, 
    } as Article;
  });
};

// Call fetchArticles on component mount
onMounted(() => {
  fetchArticles();
});

// Listen for the custom data-updated event
const refreshData = () => {
  fetchArticles();
};

onMounted(() => {
  window.addEventListener('data-updated', refreshData);
});

onBeforeUnmount(() => {
  window.removeEventListener('data-updated', refreshData);
});

// Search Articles
const filteredArticles = computed(() => {
  const searchLower = searchQuery.value.toLowerCase();
  return articles.value.filter((article) =>
    (article.title || '').toLowerCase().includes(searchLower) ||
    (article.author || '').toLowerCase().includes(searchLower) ||
    (article.description || '').toLowerCase().includes(searchLower)
  );
});

// Pagination
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

// Edit Article
const editArticle = (article: Article) => {
  router.push({ name: 'ManageArticleEdit', params: { articleId: article.id } });
};

const deleteArticle = async (articleId: string) => {
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
          const targetRef = doc(dataBase, 'articles', articleId);
          try {
            await deleteDoc(targetRef);
            console.log('Article deleted successfully!');
            
            // Show success toast notification
            const toast = await toastController.create({
              message: 'Article deleted successfully!',
              duration: 2000,
              color: 'danger', // Red color for danger (or success, depending on context)
              position: 'top' 
            });
            toast.present();
            
            fetchArticles(); // Refresh the list of articles after deletion
          } catch (error) {
            console.error('Error deleting article:', error);
            
            // Show error toast notification
            const toast = await toastController.create({
              message: 'Error deleting article. Please try again.',
              duration: 2000,
              color: 'secondary '
            });
            toast.present();
          }
        }
      }
    ]
  });
  await alert.present();
};

// Format date
const formatDate = (timestamp: any) => {
  if (!timestamp) return 'N/A';
  if (timestamp instanceof Object && timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return 'Invalid Date';
};

// Navigation helpers
const navigateToDashboard = () => router.push('/dashboard');
const navigateToAddArticle = () => router.push('/manage-article/add');
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
