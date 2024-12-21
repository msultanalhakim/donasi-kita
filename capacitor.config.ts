import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'donasi-kita',
  webDir: 'dist', // Make sure this points to the correct output folder for your Vue app
  bundledWebRuntime: false,
};

export default config;
