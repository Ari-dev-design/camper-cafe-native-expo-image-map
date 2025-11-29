export default {
  expo: {
    name: "camper-cafe-native-expo",
    slug: "camper-cafe-native-expo",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "campercafe",
    android: {
      networkSecurityConfig: "./network_security_config.xml",
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      package: "com.campercafe.app"
    },
    ios: {
      bundleIdentifier: "com.campercafe.app",
      infoPlist: {
        NSCameraUsageDescription: "Esta aplicación necesita acceso a la cámara para tomar fotos de las categorías.",
        NSPhotoLibraryUsageDescription: "Esta aplicación necesita acceso a tu galería para seleccionar imágenes de las categorías.",
        NSLocationWhenInUseUsageDescription: "Esta aplicación necesita acceso a tu ubicación para mostrar el mapa de la cafetería."
      }
    },

    plugins: [
      "expo-router",
      [
        "expo-image-picker",
        {
          photosPermission: "La aplicación accede a tus fotos para añadir imágenes a las categorías."
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: "La aplicación necesita acceso a la cámara para tomar fotos de las categorías."
        }
      ]
    ],

    extra: {
      eas: {
        projectId: "597371ee-0275-4192-8744-a8e7811e1da6"
      }
    }
  }
};
