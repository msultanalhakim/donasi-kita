import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/authStore"; // Sesuaikan dengan lokasi authStore Anda


//test
import TestPage from "@/views/TestPage.vue"; 

//user Views
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import HomePage from "@/views/HomePage.vue";
import DonasiPage from "@/views/DonasiPage.vue";
import DonasiForm from "@/views/DonasiForm.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import HistoryPage from "@/views/HistoryPage.vue";
import BeritaPage from "@/views/BeritaPage.vue";
import PengaturanPage from "@/views/PengaturanPage.vue";
import DetailDonasiPage from "@/views/DetailDonasiPage.vue";

// Admin Views
import DashboardPage from "@/views/admin/DashboardPage.vue";
import ManageUserPage from "@/views/admin/manage/users/ManageUserPage.vue";
import ManageUserAddPage from "@/views/admin/manage/users/ManageUserAddPage.vue";
import ManageUserEditPage from "@/views/admin/manage/users/ManageUserEditPage.vue";

import ManageTargetPage from "@/views/admin/manage/donations-target/ManageTargetPage.vue";
import ManageTargetAddPage from "@/views/admin/manage/donations-target/ManageTargetAddPage.vue";
import ManageTargetEditPage from "@/views/admin/manage/donations-target/ManageTargetEditPage.vue";

import ManageCategoryPage from "@/views/admin/manage/categories/ManageCategoryPage.vue";
import ManageCategoryAddPage from "@/views/admin/manage/categories/ManageCategoryAddPage.vue";
import ManageCategoryEditPage from "@/views/admin/manage/categories/ManageCategoryEditPage.vue";

import ManageArticlePage from "@/views/admin/manage/article/ManageArticlePage.vue";
import ManageArticleAddPage from "@/views/admin/manage/article/ManageArticleAddPage.vue";
import ManageArticleEditPage from "@/views/admin/manage/article/ManageArticleEditPage.vue";

import ManageDonationPage from "@/views/admin/manage/donations/ManageDonationPage.vue";
import ManageDonationAddPage from "@/views/admin/manage/donations/ManageDonationAddPage.vue";
import ManageDonationEditPage from "@/views/admin/manage/donations/ManageDonationEditPage.vue";

import SettingPage from "@/views/admin/SettingPage.vue";
import SettingUser from "@/views/settingUser.vue";


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

//User Routes
const routes: Array<RouteRecordRaw> = [
  {
    path: "/test",
    name: "test",
    component: TestPage,
  },
  { path: "/", redirect: "/login" },
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

  // sudah login
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/donation-menu",
    name: "Donasi",
    component: DonasiPage,
  },
  {
    path: "/form-donasi",
    name: "Form Donasi",
    component: DonasiForm,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
  },
  {
    path: "/riwayat-donasi",
    name: "Riwayat Donasi",
    component: HistoryPage,
  },

  {
    path: "/detail-donasi/:donasiId",
    name: "Detail Donasi",
    component: DetailDonasiPage,
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
  {
    path: "/settingUser",
    name: "ManageSettingUser",
    component: SettingUser,
  },

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
    path: "/manage-target",
    name: "ManageTarget",
    component: ManageTargetPage,
  },
  {
    path: "/manage-target/add",
    name: "ManageTargetAdd",
    component: ManageTargetAddPage,
  },
  {
    path: "/manage-target/edit:targetId",
    name: "ManageTargetEdit",
    component: ManageTargetEditPage,
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
    path: "/manage-category/edit/:categoriesId",
    name: "ManageCategoryEdit",
    component: ManageCategoryEditPage,
  },
  {
    path: "/manage-article",
    name: "ManageArticle",
    component: ManageArticlePage,
  },
  {
    path: "/manage-article/add",
    name: "ManageArticleAdd",
    component: ManageArticleAddPage,
  },
  {
    path: "/manage-article/edit/:articleId",
    name: "ManageArticleEdit",
    component: ManageArticleEditPage,
  },
  {
    path: "/manage-donation",
    name: "ManageDonation",
    component: ManageDonationPage,
  },
  {
    path: "/manage-donation/add",
    name: "ManageDonationAdd",
    component: ManageDonationAddPage,
  },
  {
    path: "/manage-donation/edit/:donationId",
    name: "ManageDonationEdit",
    component: ManageDonationEditPage,
  },
  {
    path: "/setting",
    name: "ManageSetting",
    component: SettingPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

//logic cek login

// // Tambahkan Guard untuk Auth dan Guest
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();

//   // Cek status login
//   const isLoggedIn = !!authStore.currentUser;

//   // Halaman yang memerlukan login
//   if (to.meta.requiresAuth && !isLoggedIn) {
//     next({ name: "Login" }); // Redirect ke login jika belum login
//   }
//   // Halaman yang hanya untuk guest
//   else if (to.meta.guestOnly && isLoggedIn) {
//     next({ name: "Dashboard" }); // Redirect ke dashboard jika sudah login
//   }
//   // Lanjutkan jika semua syarat terpenuhi
//   else {
//     next();
//   }
// });

export default router;
