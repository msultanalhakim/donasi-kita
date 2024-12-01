import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase"; // Pastikan Anda memiliki konfigurasi Firebase

// Views
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import HomePage from "@/views/HomePage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import BerandaPage from "@/views/BerandaPage.vue";
import BeritaPage from "@/views/BeritaPage.vue";
import PengaturanPage from "@/views/PengaturanPage.vue";

// Admin Views
import DashboardPage from "@/views/admin/DashboardPage.vue";
import ManageUserPage from "@/views/admin/manage/users/ManageUserPage.vue";
import ManageUserAddPage from "@/views/admin/manage/users/ManageUserAddPage.vue";
import ManageUserEditPage from "@/views/admin/manage/users/ManageUserEditPage.vue";
import ManageCategoryPage from "@/views/admin/manage/categories/ManageCategoryPage.vue";
import ManageCategoryAddPage from "@/views/admin/manage/categories/ManageCategoryAddPage.vue";
import ManageCategoryEditPage from "@/views/admin/manage/categories/ManageCategoryEditPage.vue";
import ManageCampaignPage from "@/views/admin/manage/ManageCampaignPage.vue";
import ManageArticlePage from "@/views/admin/manage/ManageArticlePage.vue";

// // Middleware
// const authGuard = (to, from, next) => {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       next();
//     } else {
//       next({ path: "/login" });
//     }
//   });
// };

// const adminGuard = (to, from, next) => {
//   onAuthStateChanged(auth, (user) => {
//     if (user && user.email === "admin@example.com") {
//       next();
//     } else {
//       alert("Access denied. Admins only.");
//       next({ path: "/home" });
//     }
//   });
// };

// Routes
const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/home", name: "Home", component: HomePage },
  { path: "/profile", name: "Profile", component: ProfilePage},
  { path: "/beranda", name: "Beranda", component: BerandaPage },
  { path: "/berita", name: "Berita", component: BeritaPage },
  { path: "/pengaturan", name: "Pengaturan", component: PengaturanPage },

  // Admin Routes
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
  },
  {
    path: "/manage-user",
    name: "ManageUser",
    component: ManageUserPage,
  },
  {
    path: "/manage-user/add",
    name: "ManageUserAdd",
    component: ManageUserAddPage,
  },
  {
    path: "/manage-user/edit/:userId",
    name: "ManageUserEdit",
    component: ManageUserEditPage,
  },
  {
    path: "/manage-category",
    name: "ManageCategory",
    component: ManageCategoryPage,
  },
  {
    path: "/manage-category/add",
    name: "ManageCategoryAdd",
    component: ManageCategoryAddPage,
  },
  {
    path: "/manage-category/edit",
    name: "ManageCategoryEdit",
    component: ManageCategoryEditPage,
  },
  {
    path: "/manage-campaign",
    name: "ManageCampaign",
    component: ManageCampaignPage,
  },
  {
    path: "/manage-article",
    name: "ManageArticle",
    component: ManageArticlePage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
