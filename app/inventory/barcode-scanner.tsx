import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Camera, useCameraPermissions, CameraType } from 'expo-camera';
import Colors from '../../constants/colors';

export default function BarcodeScannerScreen() {
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = React.useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, [requestCameraPermission]);

  const handleGoBack = () => {
    router.back();
  };

  if (hasPermission === null) {
    return <View style={styles.container}>Requesting camera permission...</View>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionDeniedText}>
          Camera permission is required to scan barcodes
        </Text>
        <View style={styles.permissionDeniedButtonContainer}>
          <Text
            style={styles.permissionDeniedButtonText}
            onPress={() => {
              requestCameraPermission();
            }}
          >
            Try Again
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="arrow-back" size={24} color="white" onPress={handleGoBack} />
        <Text style={styles.headerTitle}>Barcode Scanner</Text>
        <View style={{ width: 24 }} /> /* Spacer to align back button */
      </View>

      {/* Camera Viewfinder */}
      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFillObject}
          type={CameraType.back}
          isActive={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  cameraContainer: {
    height: '55%', // Approximately 55% of the screen height
  },
  permissionDeniedText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 40,
  },
  permissionDeniedButtonContainer: {
    marginTop: 24,
  },
  permissionDeniedButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});