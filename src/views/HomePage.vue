<template>
  <ion-page>
    <ion-content fullscreen>
      <div class="header-container">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="profile-details">
            <img
              src="/assets/images/login-illustration.png"
              alt="Profile Picture"
              class="profile-picture"
            />
            <div class="profile-text">
              <p class="greeting">Welcome back,</p>
              <h2 class="user-name">Muhammad Sultan Alhakim</h2>
            </div>
          </div>
          <ion-button fill="clear" class="settings-button">
            <ion-icon :icon="settings"></ion-icon>
          </ion-button>
        </div>

        <!-- Search Bar Section -->
        <div class="search-bar">
          <ion-icon :icon="searchOutline" class="search-icon"></ion-icon>
          <input
            type="text"
            class="search-input"
            placeholder="What are you looking for today?"
          />
        </div>
      </div>

      <!-- Special Offers Section -->
      <div class="special-offers">
        <!-- Section Header -->
        <div class="special-header">
          <h2>Donation Recommendation</h2>
          <!-- <ion-button fill="clear" class="see-all-button">See All</ion-button> -->
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
            v-for="(offer, index) in offers"
            :key="index"
            class="offer-slide"
          >
            <ion-card class="offer-card">
              <img :src="offer.image" alt="Offer Image" class="offer-image" />
              <ion-card-header>
                <ion-card-title>{{ offer.title }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>{{ offer.description }}</ion-card-content>
            </ion-card>
          </swiper-slide>
        </swiper>

        <!-- Navigation Indicators -->
        <div class="swiper-navigation">
          <span
            v-for="(offer, index) in offers"
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
          <h2>Explore Categories</h2>
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
            <div class="icon-container">
              <ion-icon :icon="category.icon" class="category-icon"></ion-icon>
            </div>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>

      <!-- Artikel Section -->
      <div class="article-section">
        <h2>Latest Articles</h2>

        <!-- List Artikel -->
        <div
          v-for="(article, index) in articles"
          :key="index"
          class="article-item"
        >
          <div class="article-flex-container">
            <img :src="article.image" alt="Article Image" class="article-image" />
            <div class="article-text">
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-content">{{ article.content }}</p>
            </div>
          </div>
          <hr class="article-divider" />
        </div>

        <!-- Tombol Baca Selengkapnya -->
        <div class="read-more-container">
          <ion-button class="read-more-button" expand="block" @click="goToArticles">
            Read more
          </ion-button>
        </div>
      </div>

      <!-- Footer Section -->
<footer>
  <div class="footer-container">
    <p class="copyright-text">
      © 2024 Donasi Kita. All Rights Reserved.
    </p>
    <!-- <p class="footer-credits">
      Created by <a href="https://example.com" target="_blank">Donasi-kita</a>
    </p> -->
  </div>
</footer>
      
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  settingsOutline,
  personOutline,
  addOutline,
  gridOutline,
  homeOutline,
  searchOutline,
  notificationsOutline,
  locationOutline,
  location,
  notifications,
  cube,
  settings,
  bicycle,
  book,
  bag,
  gameController,
  phonePortrait,
  shirt,
  logoFacebook,
  logoInstagram,
  logoTwitter,
  cubeOutline,
  heart,
  newspaper,
  clipboard,
} from "ionicons/icons";
import router from "@/router";

// Mock data for offers
const offers = [
  {
    title: "Limited Time Offer",
    description: "Get up to 50% off on cleaning services.",
    image: "/assets/images/login-illustration.png",
  },
  {
    title: "Repair Discount",
    description: "Save 30% on repairing services for a week.",
    image: "/assets/images/login-illustration.png",
  },
  {
    title: "Exclusive Package",
    description: "Avail a combo offer for your home services!",
    image: "/assets/images/login-illustration.png",
  },
  {
    title: "Free Service Day",
    description: "Enjoy free services on our special day!",
    image: "/assets/images/login-illustration.png",
  },
];

const articles = ref([
  {
    title: "Meningkatkan Literasi di Indonesia",
    content: "Literasi menjadi kunci kemajuan bangsa. Program-program literasi...",
    image: "/assets/images/literasi.jpg", // Gambar pertama
  },
  {
    title: "Pengaruh Teknologi pada Pendidikan",
    content: "Teknologi membawa banyak perubahan dalam cara kita belajar...",
    image: "/assets/images/teknologi.jpg", // Gambar kedua
  },
  {
    title: "Tips Donasi Efektif",
    content: "Agar donasi tepat sasaran, ada beberapa tips penting yang perlu...",
    image: "/assets/images/donasi.jpg", // Gambar ketiga
  },
]);

// Fungsi untuk navigasi ke halaman artikel penuh
const goToArticles = () => {
  router.push("/all-articles");
};

// Mock data untuk kategori yang telah diperbarui
const categories = [
  { name: "Donasi", icon: heart },
  { name: "Article", icon: newspaper },
  { name: "Laporan", icon: clipboard },
];

// Fungsi untuk mendapatkan route berdasarkan nama kategori
const getCategoryRoute = (categoryName: string) => {
  switch (categoryName) {
    case "Article":
      return "/article";
    case "Target Donasi":
      return "/donation-target";
    case "History":
      return "/history";
    default:
      return "/";
  }
};


// State for Swiper
const currentSlide = ref(0);

// Swiper navigation methods
const onSlideChange = (swiper: any) => {
  currentSlide.value = swiper.realIndex;
};

const goToSlide = (index: number) => {
  const swiperInstance = (
    document.querySelector(".special-swiper") as HTMLElement & { swiper: any }
  )?.swiper;
  swiperInstance?.slideToLoop(index);
};

// State for managing visible categories
const visibleCategories = ref(categories.slice(0, 4)); // Initially show first 5 categories
const showAll = ref(false);

// Toggle function for showing more categories
const toggleSeeAll = () => {
  showAll.value = !showAll.value;
  if (showAll.value) {
    visibleCategories.value = categories; // Show all categories
  } else {
    visibleCategories.value = categories.slice(0, 4); // Show only first 5 categories
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
.special-offers {
  /* padding: 12px 5px 0; */
}

/* Section Header */
.special-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin: 0 12px; */
  padding: 20px
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
  margin-top: -10px;
}

.offer-slide {
  width: 80%;
}

.offer-card {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.offer-image {
  width: 100%;
  height: 180px;
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
  margin-top: -6px;
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
  padding: 20px;
}

.category-grid {
  padding: 4px 0;
  display: flex;
  /* justify-content: space-between; */
  padding-left: 15px;
  flex-wrap: wrap;  /* Allow items to wrap into the next row */
   gap: 40px;/* Add gap between items */

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
  padding: 20px 5px 0;
}

.article-section h2{
  font-size: 20px;
  color: #333;
  font-weight: bold;
  margin: 0;
  padding: 20px;
}

.article-flex-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.article-image {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
}

.article-text {
  flex: 1;
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
  --background: #85a98f;
  --background-hover: #5a6c57;
  --color: #fff;
  font-size: 10px;
  font-weight: 600;
  border-radius: 8px;
  width: 40%;
  padding-bottom: 20px;
  margin: 0 auto;
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

.footer-container a:hover {
  text-decoration: underline; /* Tambahkan garis bawah saat hover */
}


</style>
