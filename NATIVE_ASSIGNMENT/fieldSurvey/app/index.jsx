import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// ─────────────────────────────────────────────
// Dummy data for Module 1
// ─────────────────────────────────────────────
const STUDENT = {
  name: 'Vishwa Patel',
  id: 'FS2024001',
  department: 'B.Tech CSE',
};

// Today's surveys (hardcoded for Module 1)
const TODAY_COUNT = 5;

const QUICK_ACTIONS = [
  { id: '1', label: 'New Survey',   icon: 'add-circle',       color: '#14b8a6' },
  { id: '2', label: 'Camera',       icon: 'camera',           color: '#34d399' },
  { id: '3', label: 'Location',     icon: 'location',         color: '#38bdf8' },
  { id: '4', label: 'Reports',      icon: 'document-text',    color: '#818cf8' },
  { id: '5', label: 'Contacts',     icon: 'people',           color: '#f472b6' },
];

// Recent survey summary (dummy)
const RECENT_SURVEYS = [
  { id: '1', site: 'Site A - Block 3',   date: '18 Jul 2026', status: 'Completed' },
  { id: '2', site: 'Site B - Roof',      date: '17 Jul 2026', status: 'Pending'   },
  { id: '3', site: 'Site C - Floor 2',   date: '16 Jul 2026', status: 'Completed' },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

// Custom App Header at the top of the Dashboard
function AppHeader() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Smart Field Survey</Text>
        <Text style={styles.headerSub}>Inspection App</Text>
      </View>
      {/* Notification bell icon */}
      <TouchableOpacity style={styles.bellBtn}>
        <Ionicons name="notifications-outline" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

// Card showing the logged-in student's details
function StudentCard() {
  return (
    <View style={styles.studentCard}>
      {/* Avatar circle with first letter of name */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{STUDENT.name[0]}</Text>
      </View>
      <View>
        <Text style={styles.studentName}>{STUDENT.name}</Text>
        <Text style={styles.studentDetail}>{STUDENT.department}  •  {STUDENT.id}</Text>
      </View>
    </View>
  );
}

// Shows today's survey count in a colourful banner
function SurveyCountBanner() {
  return (
    <View style={styles.countBanner}>
      <Ionicons name="clipboard" size={28} color="#fff" />
      <View style={styles.countTextWrap}>
        <Text style={styles.countNumber}>{TODAY_COUNT}</Text>
        <Text style={styles.countLabel}>Surveys Completed Today</Text>
      </View>
    </View>
  );
}

// Grid of quick action buttons
function QuickActions() {
  const router = useRouter();
  
  return (
    <View>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity 
            key={action.id} 
            style={styles.actionCard} 
            activeOpacity={0.8}
            onPress={() => {
              if (action.label === 'New Survey') {
                router.push('/create-survey');
              } else if (action.label === 'Camera') {
                router.push('/camera');
              } else if (action.label === 'Location') {
                router.push('/location');
              } else if (action.label === 'Contacts') {
                router.push('/contacts');
              }
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color + '22' }]}>
              <Ionicons name={action.icon} size={26} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Status badge — green for completed, yellow for pending
function StatusBadge({ status }) {
  const isComplete = status === 'Completed';
  return (
    <View style={[styles.badge, { backgroundColor: isComplete ? '#064e3b' : '#78350f' }]}>
      <Text style={[styles.badgeText, { color: isComplete ? '#10b981' : '#fbbf24' }]}>
        {status}
      </Text>
    </View>
  );
}

// List of recent survey entries
function RecentSurveys() {
  return (
    <View>
      <Text style={styles.sectionTitle}>Recent Survey Summary</Text>
      {RECENT_SURVEYS.map((survey) => (
        <View key={survey.id} style={styles.surveyRow}>
          <Ionicons name="location" size={20} color="#3b82f6" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.siteName}>{survey.site}</Text>
            <Text style={styles.surveyDate}>{survey.date}</Text>
          </View>
          <StatusBadge status={survey.status} />
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// Module 1 — Dashboard Screen
// ─────────────────────────────────────────────
export default function DashboardScreen() {
  return (
    // SafeAreaView prevents content from going under the phone's notch / status bar
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <StudentCard />
        <SurveyCountBanner />
        <QuickActions />
        <RecentSurveys />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },

  // Header
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  headerSub:   { fontSize: 12, color: '#ccfbf1', marginTop: 2 },
  bellBtn: { padding: 6 },

  // Scroll content
  scroll: { padding: 20 },

  // Student card
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  avatar:      { width: 52, height: 52, borderRadius: 26, backgroundColor: '#0d9488', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText:  { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  studentName: { fontSize: 17, fontWeight: '700', color: '#134e4a' },
  studentDetail: { fontSize: 13, color: '#0f766e', marginTop: 3 },

  // Survey count banner
  countBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#0d9488',
  },
  countTextWrap: { marginLeft: 16 },
  countNumber:   { fontSize: 36, fontWeight: 'bold', color: '#ffffff' },
  countLabel:    { fontSize: 13, color: '#ccfbf1', marginTop: 2 },

  // Section titles
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f766e', marginBottom: 12 },

  // Quick actions grid
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  actionCard:  { width: '46%', backgroundColor: '#f0fdfa', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#ccfbf1' },
  actionIcon:  { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionLabel: { fontSize: 13, color: '#134e4a', fontWeight: '600' },

  // Recent surveys
  surveyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdfa', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#ccfbf1' },
  siteName:  { fontSize: 14, color: '#134e4a', fontWeight: '600' },
  surveyDate:{ fontSize: 12, color: '#0f766e', marginTop: 2 },

  // Status badge
  badge:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
