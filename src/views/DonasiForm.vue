<template>
  <ion-page>
    <ion-content
      :fullscreen="true"
      scroll-assist="false"
      scroll-padding="false"
    >
      <div class="ion-padding donation-page">
        <div class="form-container">
          <div class="icon-box">
            <div class="icon-container">
              <ion-icon :icon="donation.icon" class="category-icon"></ion-icon>
            </div>
          </div>
          <h1 class="title">{{ donation.type }}</h1>
          <p class="subtitle">Isi data berikut untuk melakukan donasi</p>

          <!-- Penerima Donasi -->
          <ion-item class="form-input">
            <ion-label position="stacked">Penerima Donasi</ion-label>
            <ion-select
              interface="popover"
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
          <ion-button
            expand="block"
            class="submit-button"
            @click="submitDonation"
          >
            Kirim Donasi
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  shirt,
  phonePortrait,
  bicycle,
  book,
  gameController,
  bag,
  newspaper,
} from "ionicons/icons";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { dataBase } from "@/firebase";
import { getAuth } from "firebase/auth";
import { useAuth } from "@/auth"; // Mengimpor useAuth untuk cek status login

// Ambil data dari router state
const route = useRoute();

// Data penerima donasi
const donationTargets = ref([]); // Array untuk menampung data dari Firestore
const fetchDonationTargets = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(dataBase, "donation-targets")
    );
    donationTargets.value = querySnapshot.docs.map((doc) => ({
      id: doc.id, // ID unik dari dokumen Firestore
      name: doc.data().name, // Nama penerima
    }));
  } catch (error) {
    console.error("Error fetching donation targets:", error);
  }
};

const donation = ref({
  type: route.query.type || "Kategori",
  icon: route.query.icon,
});

// Data donasi
const donationDetails = ref({
  penerima: "",
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
    !donationDetails.value.jumlah
  ) {
    alert("Harap isi semua form.");
    return;
  }

  if (!isAuthenticated()) {
    alert("Anda harus login untuk melakukan donasi.");
    return;
  }

  try {
    if (currentUser.value) {
      await addDoc(collection(dataBase, "donation"), {
        penerima: donationDetails.value.penerima,
        barang: donationDetails.value.barang,
        jumlah: donationDetails.value.jumlah,
        pesan: donationDetails.value.pesan || "", // Pesan opsional
        pemberi: {
          uid: currentUser.value.uid,
          email: currentUser.value.email || "Tidak diketahui",
          displayName: currentUser.value.displayName || "Anonim",
        },
        createdAt: new Date().toISOString(),
      });

      alert("Donasi Anda berhasil dikirim!");
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
onMounted(() => {
  console.log("donasi form", currentUser);
  fetchDonationTargets(); // Ambil data saat komponen dimuat
  // Reset data berdasarkan parameter query
  donation.value = {
    type: route.query.type,
    icon: route.query.icon,
  };

  // Reset form input
  donationDetails.value = {
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
</style>
