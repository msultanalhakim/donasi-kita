import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import AuthPage from '../views/AuthPage.vue';

import { onAuthStateChanged } from 'firebase/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Auth',
    component: AuthPage
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
