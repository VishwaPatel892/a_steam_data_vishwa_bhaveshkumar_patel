import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CreateSurveyScreen() {
  const router = useRouter();

  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});

  const priorities = ['Low', 'Medium', 'High'];

  const handleValidation = () => {
    let valid = true;
    let newErrors = {};

    if (!siteName.trim()) {
      newErrors.siteName = 'Site Name is required';
      valid = false;
    }
    if (!clientName.trim()) {
      newErrors.clientName = 'Client Name is required';
      valid = false;
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }
    if (!date.trim()) {
      newErrors.date = 'Date is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (handleValidation()) {
      Alert.alert('Success', 'Survey created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Survey</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Site Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.siteName && styles.inputError]}
            placeholder="Enter site name"
            placeholderTextColor="#99f6e4"
            value={siteName}
            onChangeText={setSiteName}
          />
          {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.clientName && styles.inputError]}
            placeholder="Enter client name"
            placeholderTextColor="#99f6e4"
            value={clientName}
            onChangeText={setClientName}
          />
          {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            placeholder="Enter description"
            placeholderTextColor="#99f6e4"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority <Text style={styles.required}>*</Text></Text>
          <View style={styles.priorityContainer}>
            {priorities.map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityBtn,
                  priority === p && styles.priorityBtnActive
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    priority === p && styles.priorityTextActive
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.date && styles.inputError]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#99f6e4"
            value={date}
            onChangeText={setDate}
          />
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Survey</Text>
        </TouchableOpacity>

      </ScrollView>
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
  scroll: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#0f766e', marginBottom: 8 },
  required: { color: '#ef4444' },
  input: {
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#ccfbf1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#134e4a',
    fontSize: 15,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  priorityBtnActive: {
    backgroundColor: '#0d9488',
    borderColor: '#0d9488',
  },
  priorityText: {
    color: '#0f766e',
    fontWeight: '600',
    fontSize: 14,
  },
  priorityTextActive: {
    color: '#ffffff',
  },
  submitBtn: {
    backgroundColor: '#0d9488',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
