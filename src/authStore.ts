import { defineStore } from "pinia";
import { login, logout, loginWithGoogle } from "@/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    currentUser: null as any, // State untuk menyimpan data pengguna
    errorMessage: "",
  }),
  actions: {
    // Cek status pengguna saat aplikasi pertama kali dimuat
    async initialize() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = user;
          // Simpan ke localStorage
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          this.currentUser = null;
          // Hapus user dari localStorage jika logout
          localStorage.removeItem("user");
        }
      });
    },

    // Login
    async login(email: string, password: string) {
      try {
        this.currentUser = await login(email, password);
        this.errorMessage = "";
        // Simpan ke localStorage
        localStorage.setItem("user", JSON.stringify(this.currentUser));
      } catch (error: any) {
        console.error("Error during login:", error);
        this.errorMessage = error.message || "Login failed.";
      }
    },

    // Logout
    async logout() {
      try {
        await logout();
        this.currentUser = null;
        this.errorMessage = "";
        // Hapus user dari localStorage
        localStorage.removeItem("user");
      } catch (error: any) {
        console.error("Error during logout:", error);
        this.errorMessage = error.message || "Logout failed.";
      }
    },

    // Login dengan Google
    async loginWithGoogle() {
      try {
        this.currentUser = await loginWithGoogle();
        this.errorMessage = "";
        // Simpan ke localStorage
        localStorage.setItem("user", JSON.stringify(this.currentUser));
      } catch (error: any) {
        console.error("Error during Google login:", error);
        this.errorMessage = error.message || "Google login failed.";
      }
    },

    // Validasi apakah pengguna sudah login
    isAuthenticated() {
      return !!this.currentUser;
    },
  },
});
