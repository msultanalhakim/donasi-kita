<template>
  <ion-page>
    <ion-content :fullscreen="true" scroll-assist="false" scroll-padding="false">
      <!-- Header -->
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="router.push('/home')" fill="clear" color="dark">
              <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <!-- Loading -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- Main -->
      <div class="ion-padding donation-page">
        <div class="form-container">
          <div class="icon-box">
            <div class="icon-container">
              <formIcon height="50px" />
            </div>
          </div>
          <h1 class="title">Sedikit bantuan Anda, dampak besar bagi mereka.</h1>
          <p class="subtitle">Isi data berikut untuk melakukan donasi</p>

          <!-- Penerima Donasi -->
          <ion-item class="form-input">
            <ion-label position="stacked">Penerima Donasi</ion-label>
            <ion-select
              interface="alert"
              v-model="donationDetails.penerima"
              placeholder="Pilih Penerima Donasi"
            >
              <ion-select-option
                v-for="target in donationTargets"
                :key="target.id"
                :value="target.name"
              >
                {{ target.name }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Kategori Donasi -->
          <ion-item class="form-input">
            <ion-label position="stacked">Kategori Barang</ion-label>
            <ion-select
              interface="popover"
              v-model="donationDetails.kategori"
              placeholder="Pilih Kategori Barang"
            >
              <ion-select-option
                v-for="kategori in categories"
                :key="kategori.id"
                :value="kategori.name"
              >
                {{ kategori.name }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Barang Donasi -->
          <ion-item class="form-input">
            <ion-label position="stacked">Barang Donasi</ion-label>
            <ion-textarea
              v-model="donationDetails.barang"
              placeholder="Barang yang didonasikan"
            ></ion-textarea>
          </ion-item>

          <!-- Jumlah Barang -->
          <ion-item class="form-input">
            <ion-label position="stacked">Jumlah Barang</ion-label>
            <ion-input
              type="text"
              v-model="donationDetails.jumlah"
              @input="validateInput"
              placeholder="Jumlah Barang"
            ></ion-input>
            <ion-text v-if="errorMessage" color="danger" class="warning-text">
              {{ errorMessage }}
            </ion-text>
          </ion-item>

          <!-- Tipe Pengiriman -->
          <ion-item class="form-input">
            <ion-label position="stacked">Metode Pengiriman</ion-label>
            <ion-select
              interface="alert"
              v-model="donationDetails.metodePengiriman"
              @ionChange="handleMetodePengirimanChange"
              placeholder="Pilih Metode Pengiriman"
            >
              <ion-select-option value="Pickup">Pickup</ion-select-option>
              <ion-select-option value="Delivery">Delivery</ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Alamat -->
          <div v-if="donationDetails.metodePengiriman === 'Pickup'">
            <ion-item class="form-input">
              <ion-label position="stacked">Alamat Pickup</ion-label>
              <ion-input
                v-model="donationDetails.alamat"
                placeholder="Masukkan Alamat Pickup"
              ></ion-input>
            </ion-item>
          </div>


          <div v-if="donationDetails.metodePengiriman === 'Delivery'" style="padding: 0 16px;line-height: 25px;">
            <p><b>Alamat Pengiriman:</b><br>Jl. Mawar, Dusun 1, Kalimanah Wetan, Kec. Kalimanah, Kabupaten Purbalingga, Jawa Tengah 53371</p>
          </div>

          <!-- Pesan Opsional -->
          <ion-item class="form-input">
            <ion-label position="stacked">Pesan (Opsional)</ion-label>
            <ion-textarea
              v-model="donationDetails.pesan"
              placeholder="Tulis pesan atau harapan Anda"
            ></ion-textarea>
          </ion-item>

          <!-- Submit Button -->
          <ion-button expand="block" class="submit-button" @click="submitDonation">
            Kirim Donasi
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { arrowBack } from "ionicons/icons";

import formIcon from "@/components/icons/formIcon.vue";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { dataBase } from "@/firebase";
import { useAuthStore } from "@/authStore";

// Define types
interface DonationTarget {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface DonationDetails {
  kategori: string;
  penerima: string;
  barang: string;
  jumlah: string;
  pesan: string;
  metodePengiriman: string;
  alamat: string;
  status: boolean;
}

// Refs and stores
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const user = ref(authStore.currentUser);
const donationTargets = ref<DonationTarget[]>([]);
const categories = ref<Category[]>([]);
const donationDetails = ref<DonationDetails>({
  kategori: "",
  penerima: "",
  barang: "",
  jumlah: "",
  pesan: "",
  metodePengiriman: "",
  alamat: "",
  status: false,
});
const errorMessage = ref("");

const fetchDonationTargets = async () => {
  try {
    const snapshot = await getDocs(collection(dataBase, "donation-targets"));
    snapshot.forEach((doc) => {
      console.log(doc.id, doc.data()); // Mengakses ID dan data dari dokumen
      donationTargets.value.push({ id: doc.id, name: doc.data().name });
    });
  } catch (error) {
    console.error("Error fetching donation targets:", error);
  }
};

const fetchCategories = async () => {
  try {
    const snapshot = await getDocs(collection(dataBase, "categories"));
    categories.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const fetchUserAddress = async (): Promise<string | null> => {
  if (!user.value || !user.value.email) {
    console.error("User is not logged in or email is not available.");
    return null; // Return null if user is not logged in or email is not available
  }

  try {
    // Query the Firestore collection to find the user by email
    const userQuery = query(collection(dataBase, "users"), where("email", "==", user.value.email));
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0]; // Get the first document
      const userData = userDoc.data();
      const userId = userDoc.id; // Get the document ID

      // Ensure the address is available in the user's data
      if (userData && userData.alamat) {
        donationDetails.value.alamat = userData.alamat;
      } else {
        donationDetails.value.alamat = ""; // Set default if no address
      }

      return userId; // Return the userId to be used later
    } else {
      console.error("User address not available.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user address:", error);
    return null; // Return null in case of an error
  }
};




// Handle metode pengiriman change
const handleMetodePengirimanChange = () => {
  if (donationDetails.value.metodePengiriman === "Pickup") {
    fetchUserAddress();
  }
};

// Validate input
const validateInput = () => {
  const input = donationDetails.value.jumlah;
  if (!/^\d*$/.test(input)) {
    errorMessage.value = "Jumlah harus berupa angka!";
    donationDetails.value.jumlah = input.replace(/\D/g, "");
  } else {
    errorMessage.value = "";
  }
};

// Submit donation
const submitDonation = async () => {
  if (
    !donationDetails.value.kategori ||
    !donationDetails.value.penerima ||
    !donationDetails.value.barang ||
    !donationDetails.value.jumlah ||
    !donationDetails.value.metodePengiriman
  ) {
    alert("Harap isi semua form.");
    return;
  }

  if (donationDetails.value.metodePengiriman === "Pickup" && !donationDetails.value.alamat.trim()) {
    alert("Alamat Pickup harus diisi.");
    return;
  }

  try {
    loading.value = true;
    const alamat_lama = donationDetails.value.alamat;
    const userId = await fetchUserAddress();
    if (!userId) return;

    if (donationDetails.value.metodePengiriman == "Pickup"){
      const docRef = await addDoc(collection(dataBase, "donations"), {
        id: new Date().toISOString(),
        status: false,
        email: user.value.email,
        kategori: donationDetails.value.kategori,
        metodePengiriman: donationDetails.value.metodePengiriman,
        penerima: donationDetails.value.penerima,
        barang: donationDetails.value.barang,
        alamat: alamat_lama,
        jumlah: donationDetails.value.jumlah,
        pesan: donationDetails.value.pesan,
        timestamp: new Date(),
        userId: userId,
      });
    } else {
      const docRef = await addDoc(collection(dataBase, "donations"), {
        id: new Date().toISOString(),
        status: false,
        email: user.value.email,
        kategori: donationDetails.value.kategori,
        metodePengiriman: donationDetails.value.metodePengiriman,
        penerima: donationDetails.value.penerima,
        barang: donationDetails.value.barang,
        jumlah: donationDetails.value.jumlah,
        pesan: donationDetails.value.pesan,
        timestamp: new Date(),
        userId: userId,
      });

    }

    const userDoc = doc(dataBase, "users", userId);
  const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        // Add or update the address field
        if (!userData.alamat || userData.alamat.trim() === "") {
          await updateDoc(userDoc, {
            alamat: alamat_lama,
          });
          console.log("New address added.");
        } else {
          await updateDoc(userDoc, {
            alamat: alamat_lama,
          });
          console.log("Address updated.");
        }
      } else {
        console.log("User not found.");
      }

    alert("Donasi berhasil dikirim!");
    router.push("/home");
  } catch (error) {
    console.error("Error submitting donation:", error);
    alert("Terjadi kesalahan, silakan coba lagi.");
  } finally {
    loading.value = false;
  }
};



// Initialize on mount
onMounted(async () => {
  await fetchDonationTargets();
  await fetchCategories();
  await authStore.loadUserFromLocalStorage();
  console.log(authStore.currentUser);
  user.value = authStore.currentUser;
await fetchUserAddress();
});
</script>

<style scoped>
/* Add your styles here */
.donation-page {
  display: flex;
  justify-content: center;
  height: 100%;
  background-color: #f9faff;
}

.form-container {
  margin-top: 0px;
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
  margin-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: #6c757d;
  text-align: center;
  margin-bottom: 20px;
}

.form-input {
  margin-bottom: 15px;
}

.submit-button {
  --background: #85a98f;
  --background-hover: #5a6c57;
  --background-activated: #525b44;
  --border-radius: 26px;
  transition: background-color 0.5s ease-in-out;
}

.icon-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #85a98f, #5a6c57);
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 2rem;
  color: #ffffff;
}

.warning-text {
  font-size: 14px;
  margin-top: 5px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #85a98f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
