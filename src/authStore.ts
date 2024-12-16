import { defineStore } from "pinia";
import { login, logout, loginWithGoogle } from "@/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, dataBase } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    currentUser: null as any, // State untuk menyimpan data pengguna
    errorMessage: "",
  }),
  actions: {
    // Cek status pengguna saat aplikasi pertama kali dimuat
    async initializeAuthListener() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.currentUser = user;
          console.log("User logged in:", user);

          // Ambil role dari Firestore
          // const userDocRef = doc(dataBase, "users", user.uid);
          // const docSnap = await getDoc(userDocRef);

          // if (docSnap.exists()) {
          //   const userData = docSnap.data();
          //   this.currentUser = { ...user, role: userData.role };

          //   console.log("Current user with role:", this.currentUser); // Log untuk cek role

          //   // Simpan currentUser dengan role ke localStorage
          //   localStorage.setItem("user", JSON.stringify(this.currentUser));
          // } else {
          //   console.log("No user document found in Firestore");
          // }
        } else {
          console.log("User logged out");
          this.currentUser = null;
          localStorage.removeItem("user");
        }
      });
    },

    // Login
    async login(email: string, password: string) {
      try {
        // Melakukan login dengan email dan password
        const user = await login(email, password);
        this.errorMessage = "";

        // Mengambil role dari Firestore
        const userDocRef = doc(dataBase, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.currentUser = { ...user, role: userData.role }; // Menambahkan role ke currentUser

          // Simpan currentUser dengan role ke localStorage
          localStorage.setItem("user", JSON.stringify(this.currentUser));
        } else {
          console.log("No user document found in Firestore");
        }
      } catch (error: any) {
        console.error("Error during login:", error);
        this.errorMessage = error.message || "Login failed.";
      }
    },
    // Logout

    // Pada fungsi logout
    async logout() {
      try {
        await signOut(auth); // Pastikan logout Firebase Auth juga dilakukan
        this.currentUser = null;
        this.errorMessage = "";
        localStorage.removeItem("user");
      } catch (error: any) {
        console.error("Error during logout:", error);
        this.errorMessage = error.message || "Logout failed.";
      }
    },

    // Login dengan Google
    // Login dengan Google
    async loginWithGoogle() {
      try {
        const user = await loginWithGoogle(); // Menggunakan fungsi loginWithGoogle
        // Mengambil role dari Firestore
        const userDocRef = doc(dataBase, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.currentUser = { ...user, role: userData.role }; // Menambahkan role ke currentUser

          // Simpan currentUser dengan role ke localStorage
          localStorage.setItem("user", JSON.stringify(this.currentUser));
        } else {
          console.log("No user document found in Firestore");
        }
        this.errorMessage = "";
      } catch (error: any) {
        console.error("Error during Google login:", error);
        this.errorMessage = error.message || "Google login failed.";
      }
    },
    // Validasi apakah pengguna sudah login
    isAuthenticated() {
      return !!this.currentUser;
    },

    // Load currentUser dari localStorage saat aplikasi dimulai
    async loadUserFromLocalStorage() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        this.currentUser = await JSON.parse(storedUser);

        // Ambil data user berdasarkan email dari Firestore untuk mendapatkan role
        const userDocRef = doc(dataBase, "users", this.currentUser.uid); // Menggunakan UID yang sudah ada di localStorage
        await getDoc(userDocRef)
          .then(async (docSnap) => {
            if (docSnap.exists()) {
              const userData =  docSnap.data();
              // Menambahkan properti 'role' dari Firestore ke currentUser
              this.currentUser.role = userData.role;
              this.currentUser.name = userData.name ;
            } else {
              console.log("No user document found in Firestore");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data from Firestore:", error);
          });
      } else {
        console.log("No user found in localStorage");
      }
    },
  },
});
