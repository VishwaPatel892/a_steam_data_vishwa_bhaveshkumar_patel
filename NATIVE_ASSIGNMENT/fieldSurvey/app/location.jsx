import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocationScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setLoading(false);
      return;
    }

    try {
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      setLocation(loc);
    } catch (error) {
      setErrorMsg('Failed to get location. Make sure GPS is enabled.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleCopyLocation = async () => {
    if (location) {
      const text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', 'Location copied to clipboard.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Location Info</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#0d9488" />
            <Text style={styles.loadingText}>Fetching Location...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.centerBox}>
            <Ionicons name="warning" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.btn} onPress={fetchLocation}>
              <Text style={styles.btnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : location ? (
          <View style={styles.card}>
            <View style={styles.row}>
              <Ionicons name="map" size={24} color="#0d9488" style={styles.rowIcon} />
              <View>
                <Text style={styles.label}>Latitude</Text>
                <Text style={styles.value}>{location.coords.latitude}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Ionicons name="map-outline" size={24} color="#0d9488" style={styles.rowIcon} />
              <View>
                <Text style={styles.label}>Longitude</Text>
                <Text style={styles.value}>{location.coords.longitude}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Ionicons name="locate" size={24} color="#0d9488" style={styles.rowIcon} />
              <View>
                <Text style={styles.label}>Accuracy</Text>
                <Text style={styles.value}>{Math.round(location.coords.accuracy)} meters</Text>
              </View>
            </View>
          </View>
        ) : null}

        {!loading && location && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={[styles.actionBtn, styles.refreshBtn]} onPress={fetchLocation}>
              <Ionicons name="refresh" size={20} color="#fff" style={styles.btnIcon} />
              <Text style={styles.btnText}>Refresh</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionBtn, styles.copyBtn]} onPress={handleCopyLocation}>
              <Ionicons name="copy" size={20} color="#fff" style={styles.btnIcon} />
              <Text style={styles.btnText}>Copy Location</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#0f766e',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  iconBtn: { padding: 8 },
  content: { flex: 1, padding: 20 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#0f766e', marginTop: 12, fontSize: 16 },
  errorText: { color: '#ef4444', fontSize: 16, textAlign: 'center', marginTop: 12, marginBottom: 20 },
  btn: { backgroundColor: '#0d9488', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  card: {
    backgroundColor: '#f0fdfa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowIcon: { marginRight: 16 },
  label: { color: '#0f766e', fontSize: 13, marginBottom: 2 },
  value: { color: '#134e4a', fontSize: 18, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#ccfbf1', marginVertical: 8 },
  actionContainer: { gap: 12 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  refreshBtn: { backgroundColor: '#115e59' },
  copyBtn: { backgroundColor: '#0d9488' },
  btnIcon: { marginRight: 8 },
});
