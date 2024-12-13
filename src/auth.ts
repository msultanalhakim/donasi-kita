import { auth, googleProvider, dataBase } from "@/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Fungsi Login
export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Fungsi Logout
export const logout = async () => {
  await signOut(auth);
};

// Fungsi Login dengan Google
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Cek apakah user sudah ada di Firestore
  const userDocRef = doc(dataBase, "users", user.uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    // Jika pengguna belum terdaftar, tambahkan ke Firestore
    await setDoc(userDocRef, {
      uid: user.uid,
      name: user.displayName || "Anonymous",
      email: user.email,
      role: "user",
      createdAt: new Date(),
    });
  }

  return user; // Return data pengguna
};
