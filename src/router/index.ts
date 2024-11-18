import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import AuthPage from "../views/AuthPage.vue";
import Home from "../adm/pages/Home.vue";
import BerandaPage from "@/views/BerandaPage.vue";
import BeritaPage from "@/views/BeritaPage.vue";
import PengaturanPage from "@/views/PengaturanPage.vue";

import { onAuthStateChanged } from "firebase/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthPage,
  },
  {
    path: "/adm/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/beranda",
    name: "Beranda",
    component: BerandaPage,
  },
  {
    path: "/berita",
    name: "Berita",
    component: BeritaPage,
  },
  {
    path: "/pengaturan",
    name: "Pengaturan",
    component: PengaturanPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
