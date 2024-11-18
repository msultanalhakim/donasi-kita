import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchUsers, addUser, updateUser, deleteUser } from '@/adm/services/usersService';

interface User {
  id: string;
  email: string;
  password: string;
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]); 
  const loading = ref(false);

  // Mengambil data pengguna
  const loadUsers = async () => {
    loading.value = true;
    try {
      users.value = await fetchUsers();
    } finally {
      loading.value = false;
    }
  };

  // Menambah pengguna baru
  const createUser = async (user: { email: string; password: string }) => {
    await addUser(user);
    await loadUsers(); // Refresh daftar pengguna setelah menambah
  };

  // Memperbarui pengguna
  const updateUserDetails = async (id: string, user: { email: string; password: string }) => {
    await updateUser(id, user);
    await loadUsers(); // Refresh daftar pengguna setelah memperbarui
  };

  // Menghapus pengguna
  const removeUser = async (id: string) => {
    await deleteUser(id);
    await loadUsers(); // Refresh daftar pengguna setelah menghapus
  };

  return {
    users,
    loading,
    loadUsers,
    createUser,
    updateUserDetails,
    removeUser
  };
});
