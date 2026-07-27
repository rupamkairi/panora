import type { ExpoConfig } from 'expo/config'

const appName = 'Panora'

const { APP_VARIANT = 'development' } = process.env

if (
  APP_VARIANT !== 'production' &&
  APP_VARIANT !== 'preview' &&
  APP_VARIANT !== 'development'
) {
  throw new Error(`Invalid APP_VARIANT: ${APP_VARIANT}`)
}

const getBundleId = () => {
  // Each channel needs a stable, unique application id so Android can install
  // development, preview, and production builds side-by-side.
  if (APP_VARIANT === 'development') {
    return 'com.panora.app.dev'
  } else if (APP_VARIANT === 'preview') {
    return 'com.panora.app.preview'
  }
  return 'com.panora.app'
}

const getAppIcon = () => {
  return './assets/icon.png'
}

const version = '0.0.1'

export default {
  expo: {
    name: `${appName}${(() => {
      switch (APP_VARIANT) {
        case 'development':
          return ' (Dev)'
        case 'preview':
          return ' (Preview)'
        case 'production':
          return ''
      }
    })()}`,
    slug: 'panora',
    scheme: 'panora',
    version,
    runtimeVersion: version, // must be set to use hot-updater "appVersion" update strategy
    platforms: ['ios', 'android', 'web'],
    userInterfaceStyle: 'light',
    icon: getAppIcon(),
    ios: {
      supportsTablet: false,
      bundleIdentifier: getBundleId(),
      icon: getAppIcon(),
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        NSCameraUsageDescription:
          'Panora uses the camera when you choose to add a photo to a conversation.',
        NSMicrophoneUsageDescription:
          'Panora uses the microphone while you hold the voice button to dictate a message.',
        NSPhotoLibraryUsageDescription:
          'Panora accesses selected photos when you add them as conversation context.',
        NSPhotoLibraryAddUsageDescription:
          '$(PRODUCT_NAME) saves generated AI artwork and edited profile photos to your photo library so you can keep and share your creations.',
        NSAppleMusicUsageDescription:
          'Allow $(PRODUCT_NAME) to access your music library',
        UIBackgroundModes: ['fetch', 'remote-notification'],
      },
    },
    android: {
      package: getBundleId().replaceAll('-', '_'),
      icon: getAppIcon(),
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#F8E8E4',
      },
      softwareKeyboardLayoutMode: 'resize',
      permissions: ['android.permission.RECORD_AUDIO'],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    primaryColor: '#9B3D46',
    plugins: [
      'vxrn/expo-plugin',
      'expo-asset',
      'expo-web-browser',
      'expo-font',
      'expo-audio',
      'expo-image-picker',
      'react-native-bottom-tabs',
      [
        'expo-build-properties',
        {
          ios: {
            deploymentTarget: '17.0',
          },
        },
      ],
      [
        'react-native-permissions',
        {
          iosPermissions: [
            'Camera',
            'FaceID',
            'MediaLibrary',
            'Microphone',
            'Notifications',
            'PhotoLibrary',
          ],
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#F8E8E4',
          image: './assets/logo.png',
          imageWidth: 80,
          imageHeight: 80,
        },
      ],
      // hot-updater for OTA updates - uncomment and configure if needed
      // [
      //   '@hot-updater/react-native',
      //   {
      //     channel: APP_VARIANT,
      //   },
      // ],
    ],
  } satisfies ExpoConfig,
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
}
