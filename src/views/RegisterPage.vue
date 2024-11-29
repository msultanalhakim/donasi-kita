<template>
    <ion-page>
      <ion-content :fullscreen="true">
        <div class="ion-padding register-page">
          <div class="form-container">
            <div class="header-image">
              <img src="/assets/images/register-illustration.png" alt="Register Illustration" />
            </div>
            <h1 class="title">Donasi Kita</h1>
            <p class="subtitle">Your journey to making a difference begins here!</p>
  
            <!-- Input untuk Nama Lengkap -->
            <ion-item class="form-input">
              <ion-icon :icon="personOutline" slot="start" class="input-icon"></ion-icon>
              <ion-input placeholder="Full Name" type="text" class="input-item" required></ion-input>
            </ion-item>
  
            <!-- Input untuk Email -->
            <ion-item class="form-input">
              <ion-icon :icon="mailOutline" slot="start" class="input-icon"></ion-icon>
              <ion-input placeholder="Email Address" type="email" class="input-item" required></ion-input>
            </ion-item>
  
            <ion-item class="form-input">
                <ion-icon :icon="lockClosedOutline" slot="start" class="input-icon"></ion-icon>
                <ion-input
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
                <ion-icon :icon="lockClosedOutline" slot="start" class="input-icon"></ion-icon>
                <ion-input
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
            <ion-button expand="block" class="submit-button">Register</ion-button>
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
import { ref } from "vue";
import { IonIcon } from '@ionic/vue';
import { mailOutline, personOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons'; // Jika diperlukan sebagai alternatif lokal

const passwordVisible = ref(false);
const passwordConfirmVisible = ref(false);

// Fungsi untuk toggle visibilitas password
function toggleVisibility(type: 'password' | 'confirmPassword') {
  if (type === 'password') {
    passwordVisible.value = !passwordVisible.value;
  } else if (type === 'confirmPassword') {
    passwordConfirmVisible.value = !passwordConfirmVisible.value;
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
    color: #4caf50;
    text-decoration: none;
}
</style>
  