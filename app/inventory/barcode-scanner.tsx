import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Camera, useCameraPermissions, CameraType } from 'expo-camera';
import { Animated } from 'react-native';
import Colors from '../../constants/colors';

export default function BarcodeScannerScreen() {
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = React.useState(false);
  const [cameraContainerDimensions, setCameraContainerDimensions] = React.useState({ width: 0, height: 0 });
  const [flashMode, setFlashMode] = React.useState(Camera.FlashMode.off);
  const scanLinePosition = new Animated.Value(0);

  useEffect(() => {
    (async () => {
      const { status } = await requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, [requestCameraPermission]);

  useEffect(() => {
    if (cameraContainerDimensions.width > 0 && cameraContainerDimensions.height > 0) {
      scanLinePosition.setValue(0);
      Animated.loop(
        Animated.timing(scanLinePosition, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        })
      ).start();
    }
  }, [cameraContainerDimensions.width, cameraContainerDimensions.height, scanLinePosition]);

  const handleGoBack = () => {
    router.back();
  };

  const toggleFlash = () => {
    setFlashMode(prev => {
      const next = prev === Camera.FlashMode.off ? Camera.FlashMode.on : Camera.FlashMode.off;
      return next;
    });
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

  // Calculate cutout dimensions if we have cameraContainerDimensions
  let cutoutWidth = 0;
  let cutoutHeight = 0;
  let cutoutLeft = 0;
  let cutoutTop = 0;
  if (cameraContainerDimensions.width > 0 && cameraContainerDimensions.height > 0) {
    cutoutWidth = cameraContainerDimensions.width * 0.8;
    cutoutHeight = cutoutWidth * 3 / 4;
    cutoutLeft = (cameraContainerDimensions.width - cutoutWidth) / 2;
    cutoutTop = (cameraContainerDimensions.height - cutoutHeight) / 2;
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
      <View 
        style={[styles.cameraContainer, { position: 'relative' }]} 
        onLayout={e => {
          const { width, height } = e.nativeEvent.layout;
          setCameraContainerDimensions({ width, height });
        }}
      >
        <Camera
          style={StyleSheet.absoluteFillObject}
          type={CameraType.back}
          isActive={true}
          flashMode={flashMode}
        />
        {/* Overlay and scan line */}
        {cameraContainerDimensions.width > 0 && cameraContainerDimensions.height > 0 ? (
          <>
            {/* Dark mask with cutout */}
            <View style={styles.overlay}>
              <View 
                style={[styles.overlayRect, { 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: cutoutTop 
                }]} 
              />
              <View 
                style={[styles.overlayRect, { 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  height: cameraContainerDimensions.height - (cutoutTop + cutoutHeight) 
                }]} 
              />
              <View 
                style={[styles.overlayRect, { 
                  top: cutoutTop, 
                  bottom: cutoutTop, 
                  left: 0, 
                  width: cutoutLeft 
                }]} 
              />
              <View 
                style={[styles.overlayRect, { 
                  top: cutoutTop, 
                  bottom: cutoutTop, 
                  right: 0, 
                  width: cutoutLeft 
                }]} 
              />

              {/* Scan line */}
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    position: 'absolute',
                    top: cutoutTop,
                    left: cutoutLeft,
                    width: cutoutWidth,
                    height: 2,
                    // We animate the top position within the cutout
                    // We want to animate from cutoutTop to cutoutTop+cutoutHeight
                    // We have scanLinePosition going from 0 to 1
                    top: cutoutTop + (scanLinePosition.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, cutoutHeight],
                    })),
                  }
                ]}
              />

              {/* Label */}
              <Text 
                style={[
                  styles.scanLabel,
                  {
                    position: 'absolute',
                    top: cutoutTop + cutoutHeight + 10, // 10 pixels below the cutout
                    left: cutoutLeft,
                    right: cutoutLeft,
                    textAlign: 'center',
                  }
                ]}
              >
                Align barcode within frame
              </Text>

              {/* Flash toggle button */}
              <MaterialIcons
                name="flashlight-on"
                size={24}
                color="white"
                style={styles.flashButton}
                onPress={toggleFlash}
              />
            </>
          ) : null}
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
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayRect: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanLine: {
    backgroundColor: Colors.secondaryContainer, // Amber color for scan line
  },
  scanLabel: {
    color: 'white',
    fontSize: 16,
  },
  flashButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10, // Ensure it's above the overlay
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