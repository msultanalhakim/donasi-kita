<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/manage-user"></ion-back-button>
        </ion-buttons>
        <ion-title>Edit User</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="form-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Edit User Information</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="submitForm">
              <!-- Name Field -->
              <ion-item class="input-item">
                <ion-label position="stacked">Name</ion-label>
                <ion-input
                  type="text"
                  v-model="form.name"
                  placeholder="Enter user name"
                  required
                ></ion-input>
              </ion-item>

              <!-- Email Field -->
              <ion-item class="input-item">
                <ion-label position="stacked">Email</ion-label>
                <ion-input
                  type="email"
                  v-model="form.email"
                  placeholder="Enter user email"
                  required
                ></ion-input>
              </ion-item>

              <!-- Password Field -->
              <ion-item class="input-item">
                <ion-label position="stacked">Password</ion-label>
                <ion-input
                  type="password"
                  v-model="form.password"
                  placeholder="Enter new password (optional)"
                ></ion-input>
              </ion-item>

              <!-- Role Selection -->
              <ion-item class="input-item">
                <ion-label position="stacked">Role</ion-label>
                <ion-select v-model="form.role" placeholder="Select a role" :value="form.role" required>
                  <ion-select-option value="Administrator">Administrator</ion-select-option>
                  <ion-select-option value="User">User</ion-select-option>
                </ion-select>
              </ion-item>

              <!-- Submit Button -->
              <ion-button
                expand="block"
                type="submit"
                color="primary"
                :disabled="isSubmitting"
                class="submit-button"
              >
                <ion-spinner slot="start" v-if="isSubmitting"></ion-spinner>
                Save Changes
              </ion-button>

              <!-- Reset Button -->
              <ion-button
                expand="block"
                type="button"
                color="medium"
                @click="resetForm"
                class="reset-button"
              >
                Reset
              </ion-button>
            </form>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { dataBase } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions

// The form data model
const form = ref({
  name: '',
  email: '',
  password: '',
  role: '',
});

const router = useRoute();
const isSubmitting = ref(false);

// Get the userId from the route parameters
const route = useRoute();
const userId = route.params.userId;

// Fetch the user data when the component is mounted
onMounted(async () => {
  if (userId) {
    await fetchUserData(userId);
  }
});

// Function to fetch user data from Firestore
const fetchUserData = async (userId) => {
  try {
    // Reference to the user document in Firestore
    const userDocRef = doc(dataBase, "users", userId);  // Assuming the collection is 'users'
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // Populate the form with the fetched data
      const userData = userDocSnap.data();
      form.value = { ...userData }; // Assuming user data contains name, email, role, etc.
    } else {
      console.error("No such user found!");
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

// Function to submit the form and update user data in Firestore
const submitForm = async () => {
  isSubmitting.value = true;
  try {
    // Reference to the user document in Firestore
    const userDocRef = doc(dataBase, "users", userId); // Assuming the collection is 'users'

    // Update the user data in Firestore
    await updateDoc(userDocRef, {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password || "", // Password might be optional
      role: form.value.role,
    });

    alert('User information updated successfully!');
    // router.push({ name: 'ManageUser' }); // Replace 'ManageUserPage' with the appropriate route name
  } catch (error) {
    console.error('Error updating user data:', error);
    alert('Failed to update user. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

// Function to reset the form
const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    password: '',
    role: '',
  };
};
</script>

<style scoped>
ion-content {
  --background: #f7f9fc;
}

.form-container {
  padding: 20px;
}

ion-card {
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
}

ion-card-title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.input-item {
  margin-top: 15px;
  --highlight-color-focused: #4caf50;
  --placeholder-color: #aaa;
  --placeholder-font-style: italic;
}

.submit-button {
  margin-top: 20px;
  --background: #4caf50;
  --background-hover: #45a049;
  --box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
  font-weight: bold;
}

.reset-button {
  margin-top: 10px;
  --background: #e0e0e0;
  --background-hover: #d6d6d6;
  --color: #555;
}
</style>
