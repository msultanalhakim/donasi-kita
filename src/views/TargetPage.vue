<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- loading -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <div class="header-container">
        <!-- Search Bar Section -->
        <div class="search-bar">
          <ion-icon :icon="searchOutline" class="search-icon"></ion-icon>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="What are you looking for today?"
          />
        </div>
      </div>

      <!-- News Cards Section -->
      <div class="news-container">
        <div v-for="articles in filteredArticles" :key="articles.id" class="news-card">
          <ion-card>
            <ion-img :src="articles.imageLink" alt="news.title"></ion-img>
            <ion-card-header>
              <ion-card-title>{{ articles.title }}</ion-card-title>
            </ion-card-header>

            <ion-button
              class="berita-button"
              expand="block"
              @click="router.push(`/detail-target/${articles.id}`)"
            >
              Baca Selengkapnya
            </ion-button>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { dataBase } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { searchOutline } from "ionicons/icons";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

const loading = ref(true);
const router = useRouter();
const searchQuery = ref(""); // State for managing the search query
interface Article {
  id: string;
  imageLink: string;
  title: string;
}
const articles = ref<Article[]>([]); // Correct type declaration for articles

// Fetch articles from Firestore
const fetchArticles = async () => {
  try {
    const querySnapshot = await getDocs(collection(dataBase, "donation-targets"));
    articles.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,  // Use doc.id for the key
      imageLink: doc.data().imageLink,
      title: doc.data().name,
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
};

// Computed property for filtered articles
const filteredArticles = computed(() => {
  if (searchQuery.value.trim() === "") {
    return articles.value;  // If no search query, return all articles
  } else {
    return articles.value.filter((article) =>
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
});

// Call the function to fetch articles on component mounted
onMounted(async () => {
  await fetchArticles();
  loading.value = false;
});
</script>

<style scoped>
ion-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* General Container */
.header-container {
  padding: 26px 22px;
  background: linear-gradient(135deg, #85a98f, #5a6c57);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Search Bar Section */
.search-bar {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  gap: 10px;
}

.search-icon {
  font-size: 22px;
  color: #6b7280;
}

.search-input {
  flex: 1;
  font-size: 16px;
  border: none;
  outline: none;
  background-color: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.news-container {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.news-card ion-card {
  --background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}

.news-card ion-img {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

ion-card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
}

ion-card-subtitle {
  font-size: 14px;
  color: #6c757d;
}

ion-card-content p {
  font-size: 14px;
  color: #5b5b5b;
  line-height: 1.6;
}

.berita-button {
  --background: #85a98f;
  --background-hover: #5a6c57;
  --background-activated: #525b44;
  --border-radius: 26px;
  transition: background-color 0.5s ease-in-out;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Spinner for loading */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #85a98f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
