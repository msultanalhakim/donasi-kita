<template>
    <div class="home">
      <h1>Daftar Pengguna</h1>
      <div v-if="loading">Loading...</div>
      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.password }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="loadUsers">Refresh Data</button>
    </div>
  </template>
  
  <script>
  import { useUserStore } from '@/adm/stores/usersStore'; // Import store user
  import { onMounted } from 'vue';
  
  export default {
    name: 'HomePage',
    setup() {
      const userStore = useUserStore(); // Inisialisasi store
      const { users, loading, loadUsers } = userStore; // Mendapatkan state dan actions
  
      // Memuat data pengguna ketika halaman pertama kali dimuat
      onMounted(() => {
        loadUsers();
      });
  
      return {
        users,
        loading,
        loadUsers
      };
    }
  };
  </script>
  
  <style scoped>
  /* Styling untuk tabel */
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  button {
    margin-top: 20px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  