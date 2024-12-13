<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="navigateToDashboard" color="light">
            <ion-icon slot="icon-only" :icon="home"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Manage Users</ion-title>
      </ion-toolbar>

      <!-- Sub-header for Users List -->
      <ion-toolbar color="light">
        <ion-title size="small">Users List Overview</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content fullscreen>
      <div class="crud-container">
        <!-- Search Section -->
        <div class="search-filter-container">
          <ion-searchbar
            v-model="searchQuery"
            debounce="500"
            placeholder="Search users..."
            show-clear-button="focus"
          ></ion-searchbar>
        </div>

        <!-- Users List -->
        <div class="table-container">
          <ion-list>
            <ion-item v-for="user in paginatedUsers" :key="user.id" lines="inset">
              <ion-label>
                <div class="user-card">
                  <h2>{{ user.name }}</h2>
                  <div class="user-info">
                    <p><strong>Email:</strong> {{ user.email }}</p>
                    <p><strong>Role:</strong> {{ user.role }}</p>
                    <p v-if="user.role === 'user'"><strong>Phone:</strong> {{ user.phone || 'N/A' }}</p>
                    <p v-if="user.role === 'user'"><strong>Address:</strong> {{ user.address || 'N/A' }}</p>
                  </div>
                  <!-- <ion-buttons slot="end" class="button-group">
                    <ion-button color="primary" fill="outline" @click="editUser(user)">
                      <ion-icon slot="icon-only" :icon="create" style="font-size: 18px;"></ion-icon>
                    </ion-button>
                    <ion-button color="danger" fill="outline" @click="deleteUser(user.id)">
                      <ion-icon slot="icon-only" :icon="trash" style="font-size: 18px;"></ion-icon>
                    </ion-button>
                  </ion-buttons> -->
                </div>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <ion-button :disabled="currentPage === 1" @click="previousPage" class="custom-pagination-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </ion-button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <ion-button :disabled="currentPage === totalPages" @click="nextPage" class="custom-pagination-button">
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
import { alertController, toastController } from '@ionic/vue';

// Router
const router = useRouter();

// Define the User type
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
};

const users = ref<User[]>([]);
const itemsPerPage = 5;
const currentPage = ref(1);
const searchQuery = ref('');

// Fetch Users
const fetchUsers = async () => {
  const querySnapshot = await getDocs(collection(dataBase, 'users'));
  users.value = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || 'Unnamed User',
      email: data.email || 'No Email',
      role: data.role || 'No Role',
      phone: data.phone || null,
      address: data.address || null,
    } as User;
  });
};

// Call fetchUsers on component mount
onMounted(() => {
  fetchUsers();
});

// Listen for the custom data-updated event
const refreshData = () => {
  fetchUsers();
};

onMounted(() => {
  window.addEventListener('data-updated', refreshData);
});

onBeforeUnmount(() => {
  window.removeEventListener('data-updated', refreshData);
});

// Search Users
const filteredUsers = computed(() => {
  const searchLower = searchQuery.value.toLowerCase();
  return users.value.filter(user =>
    (user.name || '').toLowerCase().includes(searchLower) ||
    (user.email || '').toLowerCase().includes(searchLower) ||
    (user.role || '').toLowerCase().includes(searchLower)
  );
});

// Pagination
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

// Edit User
const editUser = (user: User) => {
  router.push({ name: 'ManageUserEdit', params: { userId: user.id } });
};

const deleteUser = async (userId: string) => {
  const alert = await alertController.create({
    header: 'Confirm Delete',
    message: 'Are you sure you want to delete this user?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Delete canceled');
        }
      },
      {
        text: 'Yes',
        handler: async () => {
          const userRef = doc(dataBase, 'users', userId);
          try {
            await deleteDoc(userRef);
            console.log('User deleted successfully!');
            
            // Show success toast notification
            const toast = await toastController.create({
              message: 'User deleted successfully!',
              duration: 2000,
              color: 'danger',
              position: 'top'
            });
            toast.present();

            fetchUsers(); // Refresh the list of users after deletion
          } catch (error) {
            console.error('Error deleting user:', error);

            // Show error toast notification
            const toast = await toastController.create({
              message: 'Error deleting user. Please try again.',
              duration: 2000,
              color: 'secondary'
            });
            toast.present();
          }
        }
      }
    ]
  });
  await alert.present();
};

// Navigation helpers
const navigateToDashboard = () => router.push('/dashboard');
const navigateToAddUser = () => router.push('/manage-user/add');
</script>

<style scoped>
ion-content {
  --background: #f4f7fa;
  font-family: 'Arial', sans-serif;
}

.crud-container {
  padding: 20px;
}

.search-filter-container {
  margin-bottom: 20px;
}

.table-container {
  padding: 5px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.user-card {
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;
}

.user-card h2 {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #333;
  margin: 10px;
}

.user-info p {
  margin: 8px 0;
  color: #555;
  font-size: 12px;
  margin: 10px;
}

.user-info {
  margin-top: 10px;
}

ion-buttons ion-button {
  margin-left: 15px;
}

.pagination {
  text-align: center;
  margin-top: 25px;
  margin-bottom: 20px;
}

.pagination span {
  margin: 0 15px;
  font-size: 14px;
  color: #4f4f4f;
}

.custom-pagination-button {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.button-group {
  display: flex;
  justify-content: flex-end;
}
</style>
