import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getDonations, addDonation, updateDonation, deleteDonation } from '@/adm/services/donationService';

export const useDonationStore = defineStore('donation', () => {
  const donations = ref<any[]>([]); // Menyimpan daftar donasi

  // Fungsi untuk mendapatkan donasi
  const loadDonations = async () => {
    donations.value = await getDonations();
  };

  // Fungsi untuk menambah donasi
  const createDonation = async (donation: { name: string; amount: number }) => {
    await addDonation(donation);
    loadDonations();  // Memuat ulang donasi setelah menambah
  };

  // Fungsi untuk memperbarui donasi
  const editDonation = async (id: string, donation: { name: string; amount: number }) => {
    await updateDonation(id, donation);
    loadDonations();  // Memuat ulang donasi setelah update
  };

  // Fungsi untuk menghapus donasi
  const removeDonation = async (id: string) => {
    await deleteDonation(id);
    loadDonations();  // Memuat ulang donasi setelah menghapus
  };

  return {
    donations,
    loadDonations,
    createDonation,
    editDonation,
    removeDonation,
  };
});
