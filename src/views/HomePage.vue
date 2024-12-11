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
          <h2>#SpecialForYou</h2>
          <ion-button fill="clear" class="see-all-button">See All</ion-button>
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
          <ion-button
            fill="clear"
            class="see-all-button"
            @click="router.push('/donation-menu')"
            >See All</ion-button
          >
        </div>
        <div class="category-grid">
          <div
            v-for="(category, index) in categories"
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

      <!-- How It Works Section -->
      <div class="how-it-works">
        <h2>How It Works</h2>
        <div class="steps-container">
          <div class="step">
            <ion-icon :icon="notifications" class="step-icon"></ion-icon>
            <p>Select the item you wish to donate from your collection.</p>
          </div>
          <div class="step">
            <ion-icon :icon="location" class="step-icon"></ion-icon>
            <p>
              Choose a time for the pickup or drop-off at a nearby location.
            </p>
          </div>
          <div class="step">
            <ion-icon :icon="cube" class="step-icon"></ion-icon>
            <p>
              Your items are delivered to those in need, creating a real impact!
            </p>
          </div>
        </div>
      </div>
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

// Mock data for categories
const categories = [
  { name: "Clothing", icon: shirt },
  { name: "Electronics", icon: phonePortrait },
  { name: "Vehicles", icon: bicycle },
  { name: "Books", icon: book },
  { name: "Toys & Games", icon: gameController },
  { name: "Accessories", icon: bag },
];

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

// Mock data for disaster news
const disasterNews = ref([
  {
    title: "Donate Clothes to the Needy",
    image: "/assets/images/login-illustration.png",
    description:
      "Clothing donations are needed urgently in the local community.",
  },
  {
    title: "Donate Electronics to Empower",
    image: "/assets/images/login-illustration.png",
    description:
      "Your old electronics can change lives by providing access to technology.",
  },
]);

// Mock data for success stories
const successStories = ref([
  {
    title: "The Impact of Donated Clothes",
    image: "/assets/images/login-illustration.png",
    testimonial:
      "Thanks to your generous clothing donations, many families have been able to stay warm this winter.",
  },
  {
    title: "A New Life Through Electronics",
    image: "/assets/images/login-illustration.png",
    testimonial:
      "Donating your old devices helped students excel in their online classes during the pandemic.",
  },
]);
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
  padding: 18px 0 24px;
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
  padding: 8px 0;
  background-color: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* General Container */
.special-offers {
  padding: 12px 18px 0;
}

/* Section Header */
.special-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 12px;
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
  padding: 10px;
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
  margin: 2px 15px 0;
  padding: 10px 20px;
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
}

.category-grid {
  padding: 4px 0;
  display: flex;
  width: 100%;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px; /* Prevent content from hiding */
  scroll-snap-type: x mandatory;
}

.category-card {
  display: flex;
  width: 25%;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  text-align: center;
  scroll-snap-align: start;
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

/* How It Works Section */
.how-it-works {
  margin: 20px 24px;
  padding: 14px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.steps-container {
  display: grid;
  gap: 20px;
}

.step {
  display: flex;
  gap: 15px;
  align-items: center;
}

.step-icon {
  font-size: 45px;
  color: #85a98f;
}

.step p {
  font-size: 16px;
  color: #333;
}
</style>
