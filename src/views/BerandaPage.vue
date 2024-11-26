<!-- eslint-disable vue/no-parsing-error -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Donasi Kita</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <img
          alt="Silhouette of mountains"
          src="/src/components/images/posterdonasi.png"
        />
      </ion-card>

      <ion-card class="Menu">
        <ion-grid fixed>
          <ion-row>
            <ion-col>
              <a href="">
                <div>
                  <Donasi />
                </div>
                <div>Donasi Sekarang</div>
              </a>
            </ion-col>

            <ion-col>
              <a href="">
                <div><Yayasan /></div>
                <div>Yayasan</div>
              </a>
            </ion-col>

            <ion-col>
              <a href="">
                <div>
                  <Riwayat />
                </div>
                <div>Riwayat Donasi</div>
              </a>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col>
              <a href="">
                <div>
                  <Laporan />
                </div>
                <div>Laporan</div>
              </a>
            </ion-col>
            <ion-col>
              <a href="">
                <div>
                  <Bantuan />
                </div>
                <div>Bantuan</div>
              </a>
            </ion-col>

            <ion-col>
              <a href="">
                <div><Aboutus /></div>
                <div>Tentang Donasi Kita</div>
              </a>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<style lang="scss" scoped>
ion-card {
  text-align: center;
}
ion-card.Menu {
  ion-grid {
    ion-row {
      display: flex;
      justify-content: center; /* Memusatkan kolom secara horizontal */
      /* Memusatkan kolom secara vertikal */
    }

    ion-col {
      transition: background-color 0.3s ease, transform 0.3s ease;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: white;
      height: 75px;
      width: 10px; /* Atur lebar kolom */
      margin: 10px;
      padding: 1px;

      a {
        text-decoration: none;
        color: black;

        div {
          text-align: center;
        }
      }
    }
  }
}
</style>

<script setup>
import { IonPage } from "@ionic/vue";
import Donasi from "@/components/icons/Donasi.vue";
import Laporan from "@/components/icons/laporan.vue";
import Yayasan from "@/components/icons/Yayasan.vue";
import Bantuan from "@/components/icons/Bantuan.vue";
import Aboutus from "@/components/icons/Aboutus.vue";
import Riwayat from "@/components/icons/Riwayat.vue";
</script>
