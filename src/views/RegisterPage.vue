<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="ion-padding register-page">
        <div class="form-container">
          <div class="header-image">
            <img
              src="/assets/images/register-illustration.png"
              alt="Register Illustration"
            />
          </div>
          <h1 class="title">Donasi Kita</h1>
          <p class="subtitle">Your journey to making a difference begins here!</p>

          <!-- Input untuk Nama Lengkap -->
          <ion-item class="form-input">
            <ion-icon :icon="personOutline" slot="start" class="input-icon"></ion-icon>
            <ion-input
              v-model="fullName"
              placeholder="Full Name"
              type="text"
              class="input-item"
              required
            ></ion-input>
          </ion-item>

          <!-- Input untuk Email -->
          <ion-item class="form-input">
            <ion-icon :icon="mailOutline" slot="start" class="input-icon"></ion-icon>
            <ion-input
              v-model="email"
              placeholder="Email Address"
              type="email"
              class="input-item"
              required
            ></ion-input>
          </ion-item>

          <ion-item class="form-input">
            <ion-icon
              :icon="lockClosedOutline"
              slot="start"
              class="input-icon"
            ></ion-icon>
            <ion-input
              v-model="password"
              :type="passwordVisible ? 'text' : 'password'"
              placeholder="Password"
              class="input-item"
              required
            ></ion-input>
            <ion-icon
              :icon="passwordVisible ? eyeOutline : eyeOffOutline"
              slot="end"
              class="visibility-icon"
              @click="toggleVisibility('password')"
            ></ion-icon>
          </ion-item>

          <ion-item class="form-input">
            <ion-icon
              :icon="lockClosedOutline"
              slot="start"
              class="input-icon"
            ></ion-icon>
            <ion-input
              v-model="confirmPassword"
              :type="passwordConfirmVisible ? 'text' : 'password'"
              placeholder="Confirm Password"
              class="input-item"
              required
            ></ion-input>
            <ion-icon
              :icon="passwordConfirmVisible ? eyeOutline : eyeOffOutline"
              slot="end"
              class="visibility-icon"
              @click="toggleVisibility('confirmPassword')"
            ></ion-icon>
          </ion-item>

          <!-- Tombol Register -->
          <ion-button expand="block" class="submit-button" @click="registerUser"
            >Register</ion-button
          >

          <p class="text-muted">
            Already have an account?
            <a href="/login" class="link">Login</a>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { IonIcon } from "@ionic/vue";
import {
  mailOutline,
  personOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  logoGoogle,
} from "ionicons/icons"; // Jika diperlukan sebagai alternatif lokal
import { dataBase, auth } from "@/firebase"; // Pastikan path benar
import { logout } from "@/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  where,
  collection,
  query,
} from "firebase/firestore";

const passwordVisible = ref(false);
const passwordConfirmVisible = ref(false);
const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// route
const router = useRouter();

// Fungsi untuk toggle visibilitas password
function toggleVisibility(type: "password" | "confirmPassword") {
  if (type === "password") {
    passwordVisible.value = !passwordVisible.value;
  } else if (type === "confirmPassword") {
    passwordConfirmVisible.value = !passwordConfirmVisible.value;
  }
}

// Register user
async function registerUser() {
  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
    alert("Please fill in all fields.");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match.");
    return;
  }

  try {
    // 1. Periksa apakah email sudah terdaftar
    const usersCollection = collection(dataBase, "users"); // Referensi ke koleksi `users`
    const q = query(usersCollection, where("email", "==", email.value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Jika query menemukan dokumen
      alert("This email is already registered. Please login.");
      router.push("/login"); // Redirect ke halaman login
      return;
    }

    // 2. Jika email belum terdaftar, lanjutkan proses registrasi
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    console.log("register:", user);
    // 3. Simpan informasi pengguna ke Firestore
    await setDoc(doc(dataBase, "users", user.uid), {
      uid: user.uid,
      name: fullName.value,
      email: user.email,
      role: "user",
      createdAt: new Date(),
    });

    //agar tetap masih logout
    await logout();

    alert("Registration successful!");
    router.push("/login"); // Redirect ke halaman login
  } catch (error: any) {
    console.error("Error during registration:", error);
    alert(`Error: ${error.message}`);
  }
}
</script>

<style scoped>
.register-page {
  --background: #f9faff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.header-image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.header-image img {
  width: 80%;
  max-width: 300px;
}

.form-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-top: -6px;
  margin-bottom: 20px;
  text-align: center;
}

.form-input {
  position: relative;
  margin-bottom: 15px;
  border-radius: 8px;
}

.input-icon {
  position: absolute;
  display: flex;
  align-items: center;
  height: 40%;
}

.input-item {
  margin-left: 40px;
}

.visibility-icon {
  color: #6c757d;
  cursor: pointer;
  font-size: 20px;
  transition: color 0.3s ease;
}

.visibility-icon:hover {
  color: #85a98f;
}

.submit-button {
  margin-top: 24px;

  --background: #85a98f;
  --background-hover: #5a6c57;
  --background-activated: #525b44;
  --border-radius: 26px;
  transition: background-color 0.5s ease-in-out;
}

.text-muted {
  margin-top: 16px;
  font-size: 14px;
  color: #6c757d;
  text-align: center;
}

.link {
  color: #4caf50;
  text-decoration: none;
}

.google-button {
  --border-radius: 26px;
  --background: #ffffff;
  --background-hover: #5a6c57;
  --background-activated: #5a6c57;
  --border-color: #85a98f; /* Google Red */
  --color: #85a98f;
}

.google-button ion-icon {
  color: #85a98f;
}

.or-divider {
  margin: 14px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.or-divider::before,
.or-divider::after {
  content: "";
  flex: 1;
  border-top: 1px solid #85a98f;
  margin: 0 10px;
}

.or-divider span {
  font-size: 14px;
  color: #85a98f;
  font-weight: bold;
}
</style>
