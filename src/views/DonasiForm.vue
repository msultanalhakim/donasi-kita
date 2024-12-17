<template>
  <ion-page>
    <ion-content :fullscreen="true" scroll-assist="false" scroll-padding="false">
      <!-- header -->
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="router.push('/home')" fill="clear" color="dark">
              <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <!-- loading -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- main -->
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
            <ion-label position="stacked">Penerima Donasi</ion-label>
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

          <!-- Tipe Pengiriman -->
          <ion-item class="form-input">
            <ion-label position="stacked">Meotode Pengiriman</ion-label>
            <ion-select
              interface="alert"
              v-model="donationDetails.metodePengiriman"
              placeholder="Pilih Kategori Barang"
            >
              <ion-select-option value="Antar Sendiri"> Antar Sendiri </ion-select-option>
              <ion-select-option value="Pengiriman Pihak Ketiga">
                Pengiriman Pihak Ketiga
              </ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Barang yang didonasikan -->
          <ion-item class="form-input">
            <ion-label position="stacked">Barang Donasi</ion-label>
            <ion-textarea
              v-model="donationDetails.barang"
              placeholder="Barang yang didonasikan"
              @ionInput="(e) => (donationDetails.barang = e.target.value)"
              required
            ></ion-textarea>
          </ion-item>

          <!-- Jumlah Barang -->
          <ion-item class="form-input">
            <ion-label position="stacked">Jumlah Barang</ion-label>
            <ion-textarea
              v-model="donationDetails.jumlah"
              placeholder="Barang yang didonasikan"
              @ionInput="(e) => (donationDetails.jumlah = e.target.value)"
              required
            ></ion-textarea>
          </ion-item>

          <!-- Pesan Opsional -->
          <ion-item class="form-input">
            <ion-label position="stacked">Pesan (Opsional)</ion-label>
            <ion-textarea
              v-model="donationDetails.pesan"
              placeholder="Tulis pesan atau harapan Anda"
              @ionInput="(e) => (donationDetails.pesan = e.target.value)"
            />
          </ion-item>

          <!-- Tombol Kirim -->
          <ion-button expand="block" class="submit-button" @click="submitDonation">
            Kirim Donasi
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import formIcon from "@/components/icons/formIcon.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { arrowBack } from "ionicons/icons";
import { addDoc, collection, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { dataBase } from "@/firebase";
import { getAuth } from "firebase/auth";
import { useAuthStore } from "@/authStore";

const authStore = useAuthStore();

const loading = ref(true);
const user = ref();
// Ambil data dari router state
const router = useRouter();
// Data penerima donasi
const donationTargets = ref([]); // Array untuk menampung data dari Firestore
const categories = ref([]);

const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(dataBase, "categories"));
    categories.value = querySnapshot.docs.map((doc) => ({
      id: doc.id, // ID unik dari dokumen Firestore
      name: doc.data().name, // Nama penerima
    }));
  } catch (error) {
    console.error("Error fetching donation targets:", error);
  }
};

const fetchDonationTargets = async () => {
  try {
    const querySnapshot = await getDocs(collection(dataBase, "donation-targets"));
    donationTargets.value = querySnapshot.docs.map((doc) => ({
      id: doc.id, // ID unik dari dokumen Firestore
      name: doc.data().name, // Nama penerima
    }));
  } catch (error) {
    console.error("Error fetching donation targets:", error);
  }
};

// Data donasi
const donationDetails = ref({
  metodePengiriman: "",
  kategori: "",
  penerima: "",
  alamat: "",
  barang: "",
  jumlah: "",
  pesan: "",
});

// Fungsi untuk mengirim data donasi
// Fungsi untuk kirim donasi
const submitDonation = async () => {
  if (
    !donationDetails.value.penerima ||
    !donationDetails.value.barang ||
    !donationDetails.value.jumlah ||
    !donationDetails.value.kategori ||
    !donationDetails.value.metodePengiriman
  ) {
    alert("Harap isi semua form.");
    return;
  }

  try {
    // masalah waktu
    const now = new Date();
    now.setHours(now.getHours() + 7); // Menambahkan 7 jam untuk zona waktu WIB

    if (user.value) {
      loading.value = true;
      const docRef = await addDoc(collection(dataBase, "donations"), {
        id: now.toISOString(),
        status: false,
        kategori: donationDetails.value.kategori,
        metodePengiriman: donationDetails.value.metodePengiriman,
        pemberi: user.value.name,
        email: user.value.email,
        penerima: donationDetails.value.penerima,
        barang: donationDetails.value.barang,
        jumlah: donationDetails.value.jumlah,
        pesan: donationDetails.value.pesan || "", // Pesan opsional
        tanggal: now.toISOString().split("T")[0], // Menggunakan `now` yang sudah disesuaikan
        jam: now.toISOString().split("T")[1].slice(0, 5), // Menggunakan `now` yang sudah disesuaikan
      });
      loading.value = false;

      alert("Donasi Anda berhasil dikirim!");
      router.push("/riwayat");

      donationDetails.value = {
        penerima: "",
        barang: "",
        jumlah: "",
        pesan: "",
      }; // Reset form setelah kirim
    }
  } catch (error) {
    console.error("Gagal mengirim donasi:", error);
    alert("Terjadi kesalahan saat mengirim donasi. Silakan coba lagi.");
  }
};
onMounted(async () => {
  await authStore.loadUserFromLocalStorage();
  user.value = authStore.currentUser;

  await fetchDonationTargets();
  await fetchCategories();

  loading.value = false;

  // Reset form input
  donationDetails.value = {
    kategori: "",
    penerima: "",
    barang: "",
    jumlah: "",
    pesan: "",
  };
});
</script>

<style scoped>
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

/* Menghapus efek fokus */
ion-textarea {
  --background: transparent; /* Latar belakang transparan */
  --box-shadow: none; /* Menghapus bayangan */
  --border-color: transparent; /* Hilangkan border */
  --border-radius: 0; /* Samakan dengan ion-input */
  --padding-start: 0; /* Sesuaikan padding */
  --padding-end: 0;
}

/* Fokus dan aktif */
ion-textarea:focus {
  --background: #ffffff; /* Tetap sama saat fokus */
  --box-shadow: none;
  --border-color: #cccccc;
}
ion-content {
  --padding-bottom: 0; /* Hilangkan padding bawah */
}

/* Loading overlay */
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

/* Spinner for loading */
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
