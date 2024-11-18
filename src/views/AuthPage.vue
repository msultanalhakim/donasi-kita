<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding custom-content">
      <ion-card class="custom-card">
        <h2 class="ion-text-center custom-title">{{ isRegistering ? "Register" : "Login" }}</h2>
        
        <!-- Email Input -->
        <ion-input
          v-model="userCredentials.email"
          label="Email"
          label-placement="floating"
          type="email"
          required
          class="custom-input"
        ></ion-input>

        <!-- Password Input -->
        <ion-input
          v-model="userCredentials.password"
          label="Password"
          label-placement="floating"
          type="password"
          required
          class="custom-input"
        ></ion-input>

        <!-- Confirm Password (Register Only) -->
        <ion-input
          v-if="isRegistering"
          v-model="userCredentials.confirmPassword"
          label="Confirm Password"
          label-placement="floating"
          type="password"
          required
          class="custom-input"
        ></ion-input>

        <!-- Error Message -->
        <ion-text v-if="errorMessage" class="error-message ion-text-center">
          {{ errorMessage }}
        </ion-text>

        <!-- Toggle Between Login/Register -->
        <ion-button fill="clear" @click="toggleAuthMode" class="toggle-button">
          {{ isRegistering ? "Already have an account? Login" : "Don't have an account? Register" }}
        </ion-button>

        <!-- Authenticate Button -->
        <ion-button expand="block" @click="authenticate" class="auth-button">
          {{ isRegistering ? "Register" : "Login" }}
        </ion-button>
      </ion-card>
    </ion-content>
  </ion-page>
</template>



<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

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
const validateInputs = (): boolean => {
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
    await router.push({ path: "/adm/home" });
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "An unexpected error occurred.";
  }
};

</script>

<style scoped>
/* Global content styling */
.custom-content {
  background: linear-gradient(135deg, #1e1e1e, #3c3c3c);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* Card styling */
.custom-card {
  background: #2c2c2c;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Title styling */
.custom-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16px;
}

/* Input field styling */
.custom-input {
  --background: transparent;
  --placeholder-color: #cccccc;
  --color: #ffffff;
  --highlight-color-focused: #888888;
  margin-bottom: 16px;
  font-size: 16px;
}

/* Error message styling */
.error-message {
  color: #ff4d4d;
  font-size: 14px;
  margin: 8px 0;
}

/* Toggle button styling */
.toggle-button {
  color: #888888;
  font-size: 14px;
  text-decoration: underline;
  margin: 12px 0;
}

/* Authenticate button styling */
.auth-button {
  --background: #444444;
  --background-hover: #666666;
  --color: #ffffff;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  margin-top: 12px;
}
</style>
