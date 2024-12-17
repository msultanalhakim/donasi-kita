import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

/* Ionic Vue Components */
import { 
  IonicVue, 
  IonPage, 
  IonTitle, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonIcon, 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonModal, 
  IonInput, 
  IonList, 
  IonItem, 
  IonToolbar, 
  IonText, 
  IonLabel,
  IonFooter,
  IonTabButton,
  IonTabBar,
  IonHeader,
  IonButtons,
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonMenu,
  IonMenuButton,
  IonSearchbar,
  IonTextarea,
  IonImg,
  IonSegment,
  IonBadge,
  IonSegmentButton
} from '@ionic/vue';

import { Swiper, SwiperSlide } from 'swiper/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import 'swiper/css';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import '@ionic/vue/css/ionic-swiper.css';
import '@ionic/core/css/ionic.bundle.css';


/* Theme variables */
import './theme/variables.css';

/* Ionicons Icons */
import { logoIonic } from 'ionicons/icons';

/* Create Pinia State Management */
const pinia = createPinia();

/* Create Vue App */
const app = createApp(App)
  .use(IonicVue) // Integrating Ionic Framework
  .use(router)   // Adding Vue Router
  .use(pinia);
;   // Adding Pinia State Management

/* Global Components Registration */
app.component('ion-page', IonPage);
app.component('ion-content', IonContent);
app.component('ion-grid', IonGrid);
app.component('ion-row', IonRow);
app.component('ion-col', IonCol);
app.component('ion-icon', IonIcon);
app.component('ion-button', IonButton);
app.component('ion-card', IonCard);
app.component('ion-card-content', IonCardContent);
app.component('ion-title', IonTitle);
app.component('ion-card-title', IonCardTitle);
app.component('ion-card-subtitle', IonCardSubtitle);
app.component('ion-card-header', IonCardHeader);
app.component('ion-modal', IonModal);
app.component('ion-input', IonInput);
app.component('ion-list', IonList);
app.component('ion-item', IonItem);
app.component('ion-toolbar', IonToolbar);
app.component('ion-text', IonText);
app.component('ion-label', IonLabel);
app.component('ion-tab-bar', IonTabBar);
app.component('ion-tab-button', IonTabButton);
app.component('ion-header', IonHeader);
app.component('ion-footer', IonFooter);
app.component('ion-buttons', IonButtons);
app.component('ion-select', IonSelect);
app.component('ion-select-option', IonSelectOption);
app.component('ion-spinner', IonSpinner);
app.component('ion-back-button', IonBackButton);
app.component('ion-textarea', IonTextarea);
app.component('ion-menu', IonMenu);
app.component('ion-menu-button', IonMenuButton);
app.component('ion-img', IonImg);
app.component('ion-segment', IonSegment);
app.component('ion-segment-button', IonSegmentButton);
app.component('ion-badge', IonBadge);
app.component('ion-searchbar', IonSearchbar);
app.component('swiper', Swiper);
app.component('swiper-slide', SwiperSlide);

/* Providing Global Icons */
app.provide('logoIonic', logoIonic);

/* Mounting the App */
router.isReady().then(() => {
  app.mount('#app');
});
