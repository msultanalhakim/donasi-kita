<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/manage-user"></ion-back-button>
        </ion-buttons>
        <ion-title>Add User</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="form-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Create New User</ion-card-title>
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
                  placeholder="Enter user password"
                  required
                ></ion-input>
              </ion-item>

              <!-- Role Selection -->
              <ion-item class="input-item">
                <ion-label position="stacked">Role</ion-label>
                <ion-select v-model="form.role" placeholder="Select a role" required>
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
                Submit
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
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

// Inisialisasi Firebase Auth dan Firestore
const auth = getAuth();
const db = getFirestore();
const router = useRouter();

const form = ref({
  name: '',
  email: '',
  password: '',
  role: '',
});

const isSubmitting = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    // Mendaftar pengguna menggunakan Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.value.email,
      form.value.password
    );
    const user = userCredential.user;

    // Menambahkan data pengguna ke Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
      createdAt: new Date(),
    });

    alert('User successfully added!');
    resetForm();
    router.push('/manage-user'); // Redirect ke halaman daftar pengguna
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to add user. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

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
  --background: #f2f5f9;
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
