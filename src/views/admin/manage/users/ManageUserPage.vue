<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="end">
          <ion-button @click="() => router.push('/dashboard')" color="light">
            <ion-icon slot="icon-only" :icon="home"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Manage Users</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div class="crud-container">
        <!-- Add User Button -->
        <!-- <div class="header-actions">
          <ion-button expand="block" @click="() => router.push('/manage-user/add')" color="success">
            <ion-icon slot="start" :icon="add"></ion-icon>
            Add New User
          </ion-button>
        </div> -->

        <!-- Search Section -->
        <div class="search-filter-container">
          <ion-searchbar
            v-model="searchQuery"
            debounce="500"
            placeholder="Search users..."
            show-clear-button="focus"
          ></ion-searchbar>
        </div>

        <!-- Users Table -->
        <div class="table-container">
          <ion-list>
            <!-- Table Header -->
            <ion-item class="table-header">
              <ion-label class="table-column">name</ion-label>
              <ion-label class="table-column">Email</ion-label>
              <ion-label class="table-column">Role</ion-label>
              <ion-label class="table-column">Actions</ion-label>
            </ion-item>

            <!-- Table Rows -->
            <ion-item v-for="user in paginatedUsers" :key="user.id" lines="inset">
              <ion-label>
                <h2>{{ user.name }}</h2>
                <p>{{ user.email }}</p>
                <p>{{ user.role }}</p>
              </ion-label>
              <ion-buttons slot="end">
                <!-- <ion-button color="primary" fill="outline" @click="editUser(user)">
                  <ion-icon slot="icon-only" :icon="create"></ion-icon>
                </ion-button> -->
                <!-- <ion-button color="danger" fill="outline" @click="deleteUser(user.id)">
                  <ion-icon slot="icon-only" :icon="trash"></ion-icon>
                </ion-button> -->
              </ion-buttons>
            </ion-item>
          </ion-list>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <ion-button :disabled="currentPage === 1" @click="previousPage" color="tertiary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </ion-button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <ion-button :disabled="currentPage === totalPages" @click="nextPage" color="tertiary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { dataBase } from '@/firebase';
import { trash, create, add, home } from 'ionicons/icons';

// Router
const router = useRouter();

// Define the User type
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const users = ref<User[]>([]);
const itemsPerPage = 4;
const currentPage = ref(1);
const searchQuery = ref('');

const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(dataBase, 'users'));
  users.value = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || 'Unnamed User',
      email: data.email || 'No Email',
      role: data.role || 'No Role',
    } as User;
  });
};

onMounted(() => {
  fetchUsers();
});

const refreshData = () => {
  fetchUsers();
};

onMounted(() => {
  window.addEventListener('data-updated', refreshData);
});

onBeforeUnmount(() => {
  window.removeEventListener('data-updated', refreshData);
});

const filteredUsers = computed(() => {
  const searchLower = searchQuery.value.toLowerCase();
  return users.value.filter(user =>
    (user.name || '').toLowerCase().includes(searchLower) ||
    (user.email || '').toLowerCase().includes(searchLower) ||
    (user.role || '').toLowerCase().includes(searchLower)
  );
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const editUser = (user: User) => {
  router.push({ name: 'ManageUserEdit', params: { userId: user.id } });
};

const deleteUser = async (userId: string) => {
  const userRef = doc(dataBase, 'users', userId);
  try {
    await deleteDoc(userRef);
    alert('User deleted successfully!');
    fetchUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Failed to delete user.');
  }
};

</script>

<style scoped>

ion-content {
  --background: #f4f7fa;
  font-family: 'Arial', sans-serif;
}

.crud-container {
  padding: 20px;
}

.header-actions {
  margin-bottom: 20px;
  text-align: center;
}

.search-filter-container {
  margin-bottom: 20px;
}

.table-container {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.table-header {
  font-weight: bold;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 10px;
}

ion-item {
  --background-hover: #f7f7f7;
  border-radius: 10px;
  margin-bottom: 12px;
}

ion-item h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

ion-item p {
  margin: 4px 0;
  color: #555;
  font-size: 14px;
}

ion-buttons ion-button {
  margin-left: 10px;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.pagination span {
  margin: 0 15px;
  font-size: 14px;
  color: #333;
}

ion-button {
  --border-radius: 8px;
}

ion-button[fill="outline"] {
  --border-color: #ccc;
  --border-width: 1px;
  --color: #333;
}

ion-button[fill="outline"]:hover {
  --background: #f2f2f2;
}

ion-button[color="success"] {
  --background: #28a745;
  --color: white;
}

ion-button[color="primary"] {
  --background: #007bff;
  --color: white;
}

ion-button[color="danger"] {
  --background: #dc3545;
  --color: white;
}

ion-button[color="tertiary"] {
  --background: #f0f0f0;
  --color: #007bff;
}
</style>
