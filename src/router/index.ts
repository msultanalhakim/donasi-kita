import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import BerandaPage from "@/views/BerandaPage.vue";
import BeritaPage from "@/views/BeritaPage.vue";
import PengaturanPage from "@/views/PengaturanPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import HomePage from "@/views/HomePage.vue";
import RegisterPage from "@/views/RegisterPage.vue";

import { onAuthStateChanged } from "firebase/auth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/auth",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
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
