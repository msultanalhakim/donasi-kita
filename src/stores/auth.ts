import { defineStore } from "pinia";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { dataBase, auth } from "@/firebase";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
    }),
    actions: {
        async register(user: any) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
                const registeredUser = userCredential.user;
                this.isLoggedIn = true;

                // Simpan data pengguna di Firestore
                await setDoc(doc(dataBase, "users", registeredUser.uid), {
                    records: [],
                });
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || "Pendaftaran gagal.");
                }
                throw new Error("Pendaftaran gagal dengan alasan yang tidak diketahui.");
            }
        },

        async login(user: any) {
            if (!user.email || !user.password) {
                throw new Error("Email dan password harus diisi.");
            }
        
            try {
                const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
                const loggedInUser = userCredential.user;
                if (!loggedInUser) {
                    throw new Error("Login gagal. Tidak dapat menemukan data pengguna.");
                }
        
                this.isLoggedIn = true;
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || "Login gagal.");
                }
                throw new Error("Login gagal dengan alasan yang tidak diketahui.");
            }
        }
    }        
});
