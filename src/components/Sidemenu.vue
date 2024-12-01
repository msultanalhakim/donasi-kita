    <!-- Side Menu -->
    <ion-menu side="start" menu-id="first" content-id="main-content">
        <ion-header>
          <ion-toolbar>
            <ion-title>Menu</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item button @click="navigateTo('manage-categories')">
              <ion-icon slot="start" :icon="addOutline"></ion-icon>
              Manage Categories
            </ion-item>
            <ion-item button @click="navigateTo('settings')">
              <ion-icon slot="start" :icon="settingsOutline"></ion-icon>
              Settings
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>