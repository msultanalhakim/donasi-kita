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

          <!-- Nama Donatur -->
          <ion-item class="form-input">
            <ion-label position="stacked">Penerima Donasi</ion-label>
            <ion-input
              v-model="donationDetails.name"
              placeholder="Penerima Donasi"
              required
            ></ion-input>
          </ion-item>

          <!-- Kategori Barang -->
          <ion-item class="form-input">
            <ion-label position="stacked">Email</ion-label>
            <ion-input
              v-model="donationDetails.email"
              placeholder="Alamat Email"
              type="email"
              required
            >
            </ion-input>
          </ion-item>

          <!-- Jumlah Donasi -->
          <ion-item class="form-input">
            <ion-label position="stacked">Jumlah Donasi</ion-label>

            <ion-input
              v-model="donationDetails.amount"
              placeholder="Masukkan jumlah donasi (Rp)"
              type="number"
              required
            >
            </ion-input>
          </ion-item>

          <!-- Metode Pembayaran -->
          <ion-item class="form-input">
            <ion-label position="stacked">Metode Pembayaran</ion-label>
            <ion-select
              v-model="donationDetails.paymentMethod"
              placeholder="Pilih Metode Pembayaran"
            >
              <ion-select-option value="bank_transfer"
                >Transfer Bank</ion-select-option
              >
              <ion-select-option value="ewallet">E-Wallet</ion-select-option>
              <ion-select-option value="credit_card"
                >Kartu Kredit</ion-select-option
              >
            </ion-select>
          </ion-item>

          <!-- Pesan Opsional -->
          <ion-item class="form-input">
            <ion-label position="stacked">Pesan (Opsional)</ion-label>
            <ion-textarea
              auto-grow="true"
              v-model="donationDetails.message"
              placeholder="Tulis pesan atau harapan Anda"
              @ionInput="updateMessage"
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

// Ambil data dari router state
const route = useRoute();

const donation = ref({
  type: route.query.type || "Kategori",
  icon: route.query.icon,
});

// Data donasi
const donationDetails = ref({
  name: "",
  email: "",
  amount: null,
  paymentMethod: "",
  message: "",
});

const updateMessage = (event: any) => {
  donationDetails.value.message = event.target.value;
};

// Fungsi untuk mengirim data donasi
const submitDonation = () => {
  if (
    !donationDetails.value.name ||
    !donationDetails.value.email ||
    !donationDetails.value.amount ||
    !donationDetails.value.paymentMethod
  ) {
    alert("Harap isi semua bidang yang wajib.");
    return;
  }

  // Simpan data ke database (misalnya Firestore)

  console.log("Data donasi:", donationDetails.value);

  // Reset form setelah pengiriman
  donationDetails.value = {
    name: "",
    email: "",
    amount: null,
    paymentMethod: "",
    message: "",
  };

  alert("Terima kasih atas donasi Anda!");
};

onMounted(() => {
  // Reset data berdasarkan parameter query
  donation.value = {
    type: route.query.type,
    icon: route.query.icon,
  };

  // Reset form input
  donationDetails.value = {
    name: "",
    email: "",
    amount: null,
    paymentMethod: "",
    message: "",
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
</style>
