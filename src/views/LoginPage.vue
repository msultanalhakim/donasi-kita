<template>
  <ion-page>
    <ion-content :fullscreen="true" style="--background: #85A98F;">
      <div class="ion-padding login-page">
        <div class="form-container">
          <div class="header-image">
            <img src="/assets/images/login-illustration.png" alt="Login Illustration" />
          </div>
          <h1 class="title">Donasi Kita</h1>
          <p class="subtitle">Ready to make your next donation?</p>
          <ion-item class="form-input">
            <ion-icon :icon="personOutline" slot="start" class="input-icon"></ion-icon>
            <ion-input placeholder="Username" type="text" class="input-item" required></ion-input>
          </ion-item>
    
          <ion-item class="form-input">
            <ion-icon :icon="lockClosedOutline" slot="start" class="input-icon"></ion-icon>
            <ion-input placeholder="Password" type="password" class="input-item" required></ion-input>
          </ion-item>
    
          <ion-item lines="none">
            <ion-checkbox slot="start" class="custom-checkbox"></ion-checkbox>
            <ion-label>Remind me next time</ion-label>
          </ion-item>
    
          <ion-button expand="block" class="submit-button">Sign in</ion-button>
          <div class="or-divider">
            <span>OR</span>
          </div>
          <ion-button expand="block" fill="outline" class="google-button">
            <ion-icon :icon="logoGoogle" slot="start"></ion-icon>
            Login with Google
          </ion-button>
          <p class="text-muted">
            Don't have an account?
            <a href="/register" class="link">Register</a>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { logoIonic, personOutline, lockClosedOutline, logoGoogle } from 'ionicons/icons'; // Jika diperlukan sebagai alternatif lokal


// Reactive Variables
const userCredentials = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

const isRegistering = ref(false);
const errorMessage = ref("");
const authStore = useAuthStore();
const router = useRouter();

// Toggle Between Login and Register Mode
const toggleAuthMode = () => {
  isRegistering.value = !isRegistering.value;
  errorMessage.value = ""; // Clear errors when switching modes
};

// Validate Inputs
const validateInputs = () => {
  const { email, password, confirmPassword } = userCredentials.value;

  if (!email || !email.includes("@")) {
    errorMessage.value = "Please enter a valid email.";
    return false;
  }

  if (password.length < 6) {
    errorMessage.value = "Password must be at least 6 characters long.";
    return false;
  }

  if (isRegistering.value && password !== confirmPassword) {
    errorMessage.value = "Passwords do not match.";
    return false;
  }

  return true;
};


// Authenticate User
const authenticate = async () => {
  if (!validateInputs()) return;

  try {
    if (isRegistering.value) {
      await authStore.register(userCredentials.value);
    } else {
      await authStore.login(userCredentials.value);
    }

    // Tunggu hingga navigasi selesai
    await router.push({ path: "/beranda" });
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "An unexpected error occurred.";
  }
};
</script>

<style scoped>
.login-page {
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

.google-button {
  --border-radius: 26px;
  --background: #ffffff;
  --background-hover: #5A6C57;
  --background-activated: #5A6C57;
  --border-color: #85A98F; /* Google Red */
  --color: #85A98F;
}

.google-button ion-icon {
  color: #85A98F;
}

.or-divider {
  margin:14px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.or-divider::before,
.or-divider::after {
  content: "";
  flex: 1;
  border-top: 1px solid #85A98F;
  margin: 0 10px;
}

.or-divider span {
  font-size: 14px;
  color: #85A98F;
  font-weight: bold;
}

.custom-checkbox {
    --border-color-checked: #5A6C57; /* Warna border baru */
    --checkbox-background-checked: #5A6C57; /* Warna background baru */
}

.submit-button {
  --background: #85A98F;
  --background-hover: #5A6C57;
  --background-activated: #525B44;
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
  color: #85A98F;
  text-decoration: none;
}
</style>