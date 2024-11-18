import { dataBase } from '@/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const usersCollection = collection(dataBase, "users");  // Koleksi 'users' di Firestore
console.log(usersCollection);

// try {
//     const usersCollection = collection(dataBase, "users");
//     console.log(usersCollection);
//     const snapshot = await getDocs(usersCollection);
//     console.log("Snapshot received:", snapshot);
// } catch (error) {
//     console.error("Error fetching users:", error);
// }

// Ambil daftar pengguna
export const fetchUsers = async () => {
  try {
    const snapshot = await getDocs(usersCollection);
    if (snapshot.empty) {
      console.log("No users found in Firestore");
      return [];
    }

    // Map the snapshot to users array with fallback for missing fields
    return snapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email || "No email provided",
      password: doc.data().password || "No password provided",
    }));
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};

// Tambah pengguna baru
export const addUser = async (user: { email: string, password: string }) => {
  try {
    const docRef = await addDoc(usersCollection, user);
    console.log("User added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

// Update data pengguna
export const updateUser = async (id: string, user: { email: string, password: string }) => {
  try {
    const userRef = doc(dataBase, "users", id);
    await updateDoc(userRef, user);
    console.log("User updated successfully.");
  } catch (error) {
    console.error("Error updating user: ", error);
  }
};

// Hapus pengguna
export const deleteUser = async (id: string) => {
  try {
    const userRef = doc(dataBase, "users", id);
    await deleteDoc(userRef);
    console.log("User deleted successfully.");
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
};
