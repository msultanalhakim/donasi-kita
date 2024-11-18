import { dataBase } from '@/firebase'; 
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Mendapatkan referensi koleksi donasi
const donationCollection = collection(dataBase, "donations");

// Menambahkan donasi baru
export const addDonation = async (donationData: any) => {
  try {
    const docRef = await addDoc(donationCollection, donationData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Mengambil semua data donasi
export const getDonations = async () => {
  try {
    const querySnapshot = await getDocs(donationCollection);
    const donations: any[] = [];
    querySnapshot.forEach((doc) => {
      donations.push({ id: doc.id, ...doc.data() });
    });
    return donations;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

// Mengupdate donasi berdasarkan ID
export const updateDonation = async (donationId: string, updatedData: any) => {
  try {
    const donationRef = doc(dataBase, "donations", donationId);
    await updateDoc(donationRef, updatedData);
    console.log("Document updated with ID: ", donationId);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// Menghapus donasi berdasarkan ID
export const deleteDonation = async (donationId: string) => {
  try {
    const donationRef = doc(dataBase, "donations", donationId);
    await deleteDoc(donationRef);
    console.log("Document deleted with ID: ", donationId);
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};
