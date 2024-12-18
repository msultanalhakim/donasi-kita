<template>
  <ion-page>
    <ion-content fullscreen>
      <!-- loading -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- main content -->
      <!-- <div class="main-content" v-show="!loading"> -->
      <div class="header-container">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="profile-details">
            <img
              src="/assets/images/user.jpg"
              alt="Profile Picture"
              class="profile-picture"
            />
            <div class="profile-text">
              <p class="greeting">Selamat Datang,</p>
              <h2 class="user-name">{{ user?.name ?? 'User' }}</h2>
            </div>
          </div>
          <ion-button fill="clear" class="settings-button" @click="openPopover">
            <ion-icon :icon="settings"></ion-icon>
          </ion-button>

          <ion-popover :is-open="showPopover" @did-dismiss="closePopover">
            <ion-content>
              <ion-list>
                <ion-item button @click="handleLogout">Logout</ion-item>
              </ion-list>
            </ion-content>
          </ion-popover>
        </div>

       <!-- Search Bar Section -->
        <div class="search-bar">
          <ion-icon :icon="searchOutline" class="search-icon"></ion-icon>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="What are you looking for today?"
            @input="filterContent"
          />
        </div>
      </div>

      <!-- Special Offers Section -->
      <div class="special-offers">
        <!-- Section Header -->
        <div class="special-header">
          <h2>Rekomendasi Donasi</h2>
        </div>

          <!-- Swiper Section -->
          <swiper
            :space-between="20"
            :slides-per-view="1"
            :centered-slides="true"
            :loop="false"
            class="special-swiper"
            @slideChange="onSlideChange"
          >
          <swiper-slide
            v-for="(target, index) in targets"
            :key="index"
            class="offer-slide"
          >
            <ion-card class="offer-card">
              <img :src="target.imageLink" alt="Target Image" class="offer-image" />
              <ion-card-header>
                <ion-card-title>{{ target.name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content class="offer-description">
                {{ limitDescription(target.description) }}
              </ion-card-content>
            </ion-card>
          </swiper-slide>
        </swiper>

        <!-- Navigation Indicators -->
        <div class="swiper-navigation">
          <span
            v-for="(target, index) in targets"
            :key="'indicator-' + index"
            class="swiper-dot"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>


      <!-- Category Section -->
      <div class="category-section">
        <div class="category-header">
          <h2>Jelajahi Menu</h2>
          <ion-button fill="clear" class="see-all-button" @click="toggleSeeAll">
            See All
          </ion-button>
        </div>
        <div class="category-grid">
          <div
            v-for="(category, index) in visibleCategories"
            :key="index"
            class="category-card"
          >
            <button @click="router.push(category.link)">
              <div class="icon-container">
                <ion-icon :icon="category.icon" class="category-icon"></ion-icon>
              </div>
            </button>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>

      <!-- Artikel Section -->
      <div class="article-section">
        <h2>Artikel Terbaru</h2>

        <!-- List Artikel -->
        <div v-for="(article, index) in articles" :key="index" class="article-item">
          <div
            class="article-flex-container"
            @click="router.push(`/detail-artikel/${article.id}`)"
          >
            <img :src="article.imageLink" alt="Article Image" class="article-image" />
            <div class="article-text">
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-content">{{ article.description.slice(0, 70) }}...</p>
              <span class="article-footer">{{ article.tanggalTeks }}</span>
            </div>
          </div>
          <hr class="article-divider" />
        </div>

        <!-- Tombol Baca Selengkapnya -->
        <div class="read-more-container">
          <ion-button
            class="read-more-button"
            expand="block"
            @click="router.push('/artikel')"
          >
            Baca Selengkapnya
          </ion-button>
        </div>
      </div>

      <!-- Footer Section -->
      <footer>
        <div class="footer-container">
          <p class="copyright-text">© 2024 Donasi Kita. All Rights Reserved.</p>
          <!-- <p class="footer-credits">
      Created by <a href="https://example.com" target="_blank">Donasi-kita</a>
    </p> -->
        </div>
      </footer>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Swiper as SwiperClass } from 'swiper';
import "swiper/css";
import {
  settingsOutline,
  searchOutline,
  settings,
  heart,
  newspaper,
  document,
  home,
} from "ionicons/icons";
import { collection, getDocs } from "firebase/firestore";
import { dataBase } from "@/firebase";
import { useAuthStore } from "@/authStore";
import { useRouter } from "vue-router";

const router = useRouter();

// Define the Donation Target type
type DonationTarget = {
  id: string;
  name: string;
  description: string;
  imageLink?: string; // Optional image link
};

// Define the Article type
type Article = {
  id: string;
  title: string;
  description: string;
  imageLink?: string;
  tanggalTeks?: string;  // Add tanggalTeks to the Article type
};

// State Variables
const loading = ref(true);
const targets = ref<DonationTarget[]>([]);
const articles = ref<Article[]>([]);
const currentSlide = ref(0);
const categories = [
  { name: "Artikel", icon: newspaper, link: "/artikel" },
  { name: "Donasi", icon: heart, link: "/form-donasi" },
  { name: "Penerima", icon: home, link: "/target" },
  { name: "Riwayat", icon: document, link: "/riwayat-donasi" },
];
const visibleCategories = ref(categories.slice(0, 4));
const showAll = ref(false);

// Fetch Donation Targets
const fetchTargets = async () => {
  const querySnapshot = await getDocs(collection(dataBase, "donation-targets"));
  targets.value = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "Unnamed Target",
      description: data.description || "No Description",
      imageLink: data.imageLink || "", // Optional field for image link
    } as DonationTarget;
  });
};

// Format Firestore Date to 'Day Month Year' format
const formatFirestoreDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  return new Intl.DateTimeFormat("id-ID", options).format(date);
};

// Fetch Articles
const fetchArticles = async () => {
  const querySnapshot = await getDocs(collection(dataBase, "articles"));
  articles.value = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.id,
      title: data.title || "Untitled Article",
      author: data.author,
      imageLink: data.imageLink || "",
      tanggalTeks: formatFirestoreDate(data.tanggal),
      description: data.description || "No description available",  // Default description
    } as Article;
  });
};

// Function to limit description to 20 words
const limitDescription = (description: string) => {
  const words = description.split(" ");
  return words.length > 18 ? words.slice(0, 18).join(" ") + "..." : description;
};

const authStore = useAuthStore();

// Define the User type
interface User {
  name: string;
  email: string;
  // Add other properties as needed
}
const user = ref<User | null>(null);
onMounted(async () => {
  await authStore.loadUserFromLocalStorage();
  user.value = authStore.currentUser;
  await fetchTargets();
  await fetchArticles();
  loading.value = false;
});

// Swiper navigation methods
const onSlideChange = (swiper: any) => {
  currentSlide.value = swiper.realIndex;
};
// Menginisialisasi swiper
let swiperInstance: SwiperClass | null = null;

// Fungsi untuk memindahkan ke slide yang dipilih berdasarkan index
const goToSlide = (index: number) => {
  if (swiperInstance) {
    swiperInstance.slideTo(index);
  }
};

// Saat Swiper siap, set instance swiper
const onSwiperInit = (swiper: SwiperClass) => {
  swiperInstance = swiper;
};

// Toggle Category Visibility
const toggleSeeAll = () => {
  showAll.value = !showAll.value;
  visibleCategories.value = showAll.value ? categories : categories.slice(0, 4);
};

// State for managing the popover visibility
const showPopover = ref(false);

const openPopover = () => {
  showPopover.value = true;
};

const closePopover = () => {
  showPopover.value = false;
};

// Implement logout functionality
const handleLogout = async () => {
  await authStore.logout(); // Memanggil fungsi logout dari authStore.ts
  await router.push("/login"); // Arahkan ke halaman login setelah logout
};

// State for managing the search query
const searchQuery = ref("");

// Filter function for content (articles or targets)
const filterContent = () => {
  if (searchQuery.value.trim() === "") {
    // If search query is empty, show all content
    fetchArticles();
    fetchTargets();
  } else {
    // Filter articles and targets based on the search query
    articles.value = articles.value.filter(article =>
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    targets.value = targets.value.filter(target =>
      target.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
};

</script>


<style scoped>
/* General styling */
ion-content {
  --background: #f5f5f5;
}

/* Header */
.ion-text-left {
  display: flex;
  align-items: center;
}

.ion-text-right {
  display: flex;
  justify-content: end;
  align-items: center;
}

/* General Container */
.header-container {
  padding: 26px 22px;
  background: linear-gradient(135deg, #85a98f, #5a6c57);
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 24px;
}

.profile-details {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-picture {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.profile-text .greeting {
  margin: 0;
  font-size: 16px;
  color: #e8f5e9;
  font-weight: 300;
}

.profile-text .user-name {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
}

.settings-button {
  --ion-color-primary: #ffffff;
  font-size: 20px;
}

/* Search Bar Section */
.search-bar {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 20px;
  border-radius: 30px;
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
  /* padding: 3px 0; */
  background-color: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* General Container */

/* Section Header */
.special-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 12px 0px;
  padding: 4px 20px;
}

.special-header h2 {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  margin: 0;
}

.see-all-button {
  font-size: 14px;
  color: #85a98f;
  --ion-color-primary: #85a98f;
}

/* Swiper Section */
.special-swiper {
  margin-top: -16px !important;
}

.offer-slide {
  width: 80%;
  padding: 0 10px;
}

.offer-card {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.offer-description {
  text-align: justify;
  text-align-last: center;
}

.offer-image {
  width: 100% !important;
  height: 280px !important;
  object-fit: cover;
}

ion-card-header {
  padding: 5px;
}

ion-card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

ion-card-content {
  font-size: 14px;
  color: #555;
}

/* Navigation Indicators */
.swiper-navigation {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.swiper-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.swiper-dot.active {
  background-color: #85a98f;
}

/* Category Section */
.category-section {
  margin: 5px 5px 0;
  /* padding: 10px 20px; */
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-header h2 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
  padding: 0 20px;
}

.category-grid {
  padding: 4px 0;
  display: flex;
  justify-content: center;
  padding-left: 10px;
  flex-wrap: wrap; /* Allow items to wrap into the next row */
  gap: 40px; /* Add gap between items */
}

.category-card {
  width: 15%; /* Set each card to take up 18% of the width */
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  text-align: center;
}

.category-card:hover {
  transform: scale(1.05);
}

.category-card button {
  background: transparent;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #85a98f, #5a6c57);
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 2rem;
  color: #ffffff;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-top: 8px;
}

/* Artikel Section Styling */
.article-section {
  padding: 8px 26px;
}

.article-section h2 {
  font-size: 20px;
  color: #333;
  font-weight: bold;
}

.article-flex-container {
  width: 100%;
  display: flex;
  align-items: center;
}

.article-image {
  width: 40%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
}

.article-text {
  width: 60%;
  padding: 14px;
}

.article-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.article-content {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.article-footer {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}

.article-divider {
  border: none;
  height: 1px;
  background-color: #ccc;
  margin: 15px 0;
}

.read-more-container {
  text-align: center;
  margin-top: 10px;
}

.read-more-button {
  --background-hover: #5a6c57;
  --background-activated: #525b44;
  --background: #85a98f;
  transition: background-color 0.5s ease-in-out;
  --color: #fff;
  --border-radius: 18px;
  font-size: 12px;
  font-weight: 600;
  padding: 10px 60px;
  display: block;
}

/* Footer Section Styles */
footer {
  /* background-color: #f8f9fa; Warna latar footer */
  color: #6c757d; /* Warna teks */
  text-align: center; /* Pusatkan teks */
  padding: 20px 10px; /* Jarak padding atas-bawah dan kiri-kanan */
  font-size: 14px; /* Ukuran font */
  border-top: 1px solid #e7e7e7; /* Garis pemisah atas footer */
}

.footer-container p {
  margin: 5px 0; /* Spasi antar paragraf */
}

.footer-container a {
  text-decoration: none; /* Hilangkan garis bawah tautan */
  color: #007bff; /* Warna biru khas tautan */
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
