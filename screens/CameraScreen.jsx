import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraScreen({ navigation }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);

  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady || isCapturing) {
      return;
    }

    try {
      setIsCapturing(true);
      setCaptureError(null);

      const result = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        skipProcessing: true,
      });

      if (!result?.uri) {
        setCaptureError('Could not capture image. Please try again.');
        return;
      }

      setPhotoUri(result.uri);
      navigation.navigate('Preview', { photoUri: result.uri });
    } catch {
      setCaptureError('Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  if (permission === null) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => setCameraReady(true)}
      />
      {captureError ? <Text style={styles.captureError}>{captureError}</Text> : null}
      <View style={styles.captureContainer} testID={photoUri ? 'photo-captured' : 'photo-not-captured'}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Capture photo"
          disabled={!cameraReady || isCapturing}
          style={[
            styles.captureButton,
            (!cameraReady || isCapturing) && styles.captureButtonDisabled,
          ]}
          onPress={takePicture}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureError: {
    position: 'absolute',
    right: 24,
    bottom: 128,
    left: 24,
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  permissionText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});
