<template>
  <ion-app>
    <ion-router-outlet />
    <TabsLayout />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import TabsLayout from '@/components/TabsLayout.vue';

</script>
