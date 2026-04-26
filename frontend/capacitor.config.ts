import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sunnahumrah.app',
  appName: 'Sunnah Umrah',
  webDir: 'build',
  // Bundled mode: the React build is shipped INSIDE the native app and
  // makes API calls to the production backend. Override REACT_APP_BACKEND_URL
  // in .env.production before running `yarn build` for store releases.
  bundledWebRuntime: false,
  ios: {
    contentInset: 'always',
    backgroundColor: '#F8F6F0',
  },
  android: {
    backgroundColor: '#F8F6F0',
    allowMixedContent: false,
    captureInput: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#F8F6F0',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#F8F6F0',
    },
  },
};

export default config;
