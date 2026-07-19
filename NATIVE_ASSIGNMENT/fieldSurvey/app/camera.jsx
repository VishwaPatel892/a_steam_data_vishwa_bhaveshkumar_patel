import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0d9488" />
        <Text style={styles.loadingText}>Opening Camera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => router.back()}>
          <Text style={styles.btnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setPhoto(data.uri);
        setCaptureTime(new Date().toLocaleString());
      } catch (error) {
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setPhoto(null) },
      ]
    );
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preview</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.previewImage} />
          {captureTime && (
            <View style={styles.timeOverlay}>
              <Text style={styles.timeText}>Captured: {captureTime}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.retakeBtn]} onPress={handleRetake}>
            <Ionicons name="refresh" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete}>
            <Ionicons name="trash" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Camera</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.cameraContainer}>
        {!isCameraReady && (
          <View style={styles.cameraLoading}>
            <ActivityIndicator size="large" color="#0d9488" />
            <Text style={styles.loadingText}>Initializing Camera...</Text>
          </View>
        )}
        <CameraView
          style={styles.camera}
          facing="back"
          ref={cameraRef}
          onCameraReady={() => setIsCameraReady(true)}
        >
          <View style={styles.cameraBottomBar}>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <View style={styles.captureInnerBtn} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#0f766e',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  iconBtn: { padding: 8 },
  message: { textAlign: 'center', color: '#134e4a', marginBottom: 20, fontSize: 16 },
  btn: { backgroundColor: '#0d9488', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginBottom: 12 },
  btnSecondary: { backgroundColor: '#115e59' },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  loadingText: { color: '#0f766e', marginTop: 12, fontSize: 16 },
  cameraContainer: { flex: 1, position: 'relative' },
  cameraLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  camera: { flex: 1 },
  cameraBottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInnerBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  previewContainer: { flex: 1, position: 'relative' },
  previewImage: { flex: 1, width: '100%', resizeMode: 'contain' },
  timeOverlay: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeText: { color: '#134e4a', fontSize: 14, fontWeight: '500' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ccfbf1',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retakeBtn: { backgroundColor: '#0d9488' },
  deleteBtn: { backgroundColor: '#ef4444' },
  btnIcon: { marginRight: 8 },
});
