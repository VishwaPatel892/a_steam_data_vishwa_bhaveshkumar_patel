import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ContactsScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        fetchContacts();
      } else {
        setLoading(false);
      }
    })();
  }, []);

  const fetchContacts = async () => {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
      sort: Contacts.SortTypes.FirstName,
    });
    setContacts(data);
    setFilteredContacts(data);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (hasPermission) {
      await fetchContacts();
    }
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const newData = contacts.filter(item => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredContacts(newData);
    } else {
      setFilteredContacts(contacts);
    }
  };

  const copyToClipboard = async (number) => {
    if (number) {
      await Clipboard.setStringAsync(number);
      // Optional: Add a small alert or toast
      // Alert.alert('Copied', 'Phone number copied to clipboard', [{ text: 'OK' }]);
    }
  };

  const renderItem = ({ item }) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : null;
    
    return (
      <View style={styles.contactCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name ? item.name[0].toUpperCase() : '?'}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.contactNumber}>{phoneNumber || 'No Number'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.copyBtn} 
          onPress={() => copyToClipboard(phoneNumber)}
          disabled={!phoneNumber}
        >
          <Ionicons name="copy-outline" size={20} color={phoneNumber ? "#14b8a6" : "#0f766e"} />
        </TouchableOpacity>
      </View>
    );
  };

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contacts</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#0f766e" />
          <Text style={styles.errorText}>Permission to access contacts was denied</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contacts</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#0f766e" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor="#0f766e"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {filteredContacts.length} {filteredContacts.length === 1 ? 'Contact' : 'Contacts'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0d9488" />
        </View>
      ) : filteredContacts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="people-outline" size={60} color="#0f766e" />
          <Text style={styles.emptyText}>No Contacts Found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0d9488"
              colors={['#0d9488']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0f766e',
    borderBottomWidth: 1,
    borderBottomColor: '#0f766e',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#134e4a',
    fontSize: 16,
  },
  
  counterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  counterText: { color: '#0f766e', fontSize: 14, fontWeight: '600' },
  
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0d9488',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '700', color: '#134e4a', marginBottom: 4 },
  contactNumber: { fontSize: 13, color: '#0f766e' },
  
  copyBtn: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: { color: '#134e4a', fontSize: 16, marginTop: 16, textAlign: 'center' },
  emptyText: { color: '#0f766e', fontSize: 16, marginTop: 16, fontWeight: '600' },
});
