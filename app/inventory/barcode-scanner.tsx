import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Colors from '../../constants/colors';

export default function BarcodeScannerScreen() {
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const [cameraContainerDimensions, setCameraContainerDimensions] = React.useState({ width: 0, height: 0 });
  const [flashMode, setFlashMode] = React.useState<'off' | 'on'>('off');
  const scanLinePosition = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const result = await requestCameraPermission();
      setHasPermission(result.granted);
    })();
  }, []);

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
  }, [cameraContainerDimensions.width, cameraContainerDimensions.height]);

  const handleGoBack = () => {
    router.back();
  };

  const toggleFlash = () => {
    setFlashMode((prev: 'off' | 'on') => (prev === 'off' ? 'on' : 'off'));
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionDeniedText}>Requesting camera permission...</Text>
      </View>
    );
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
            onPress={() => requestCameraPermission()}
          >
            Try Again
          </Text>
        </View>
      </View>
    );
  }

  // Calculate cutout dimensions
  let cutoutWidth = 0;
  let cutoutHeight = 0;
  let cutoutLeft = 0;
  let cutoutTop = 0;
  if (cameraContainerDimensions.width > 0 && cameraContainerDimensions.height > 0) {
    cutoutWidth = cameraContainerDimensions.width * 0.8;
    cutoutHeight = (cutoutWidth * 3) / 4;
    cutoutLeft = (cameraContainerDimensions.width - cutoutWidth) / 2;
    cutoutTop = (cameraContainerDimensions.height - cutoutHeight) / 2;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="arrow-back" size={24} color="white" onPress={handleGoBack} />
        <Text style={styles.headerTitle}>Barcode Scanner</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Camera Viewfinder */}
      <View
        style={styles.cameraContainer}
        onLayout={e => {
          const { width, height } = e.nativeEvent.layout;
          setCameraContainerDimensions({ width, height });
        }}
      >
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          flash={flashMode}
        />

        {cameraContainerDimensions.width > 0 && cameraContainerDimensions.height > 0 ? (
          <>
            {/* Dark overlay masks around the cutout */}
            <View style={styles.overlay}>
              {/* Top */}
              <View style={[styles.overlayRect, { top: 0, left: 0, right: 0, height: cutoutTop }]} />
              {/* Bottom */}
              <View
                style={[
                  styles.overlayRect,
                  {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: cameraContainerDimensions.height - (cutoutTop + cutoutHeight),
                  },
                ]}
              />
              {/* Left */}
              <View
                style={[
                  styles.overlayRect,
                  { top: cutoutTop, height: cutoutHeight, left: 0, width: cutoutLeft },
                ]}
              />
              {/* Right */}
              <View
                style={[
                  styles.overlayRect,
                  { top: cutoutTop, height: cutoutHeight, right: 0, width: cutoutLeft },
                ]}
              />
            </View>

            {/* Animated scan line — sibling of overlay, sits above it */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  position: 'absolute',
                  left: cutoutLeft,
                  width: cutoutWidth,
                  height: 2,
                  top: scanLinePosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [cutoutTop, cutoutTop + cutoutHeight],
                  }),
                },
              ]}
            />

            {/* Label below cutout */}
            <Text
              style={[
                styles.scanLabel,
                {
                  position: 'absolute',
                  top: cutoutTop + cutoutHeight + 10,
                  left: cutoutLeft,
                  right: cutoutLeft,
                  textAlign: 'center',
                },
              ]}
            >
              Align barcode within frame
            </Text>

            {/* Flash toggle */}
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
    height: '55%',
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
    backgroundColor: Colors.secondaryContainer,
  },
  scanLabel: {
    color: 'white',
    fontSize: 16,
  },
  flashButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
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