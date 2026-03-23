import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.titan.app',
  appName: 'Titan',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
