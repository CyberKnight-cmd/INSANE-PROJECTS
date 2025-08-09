import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Switch, Image, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [settings, setSettings] = useState({
    locationTracking: true,
    voiceSentiment: true,
    autoRecording: true,
    dataRetention: false,
    anonymousAnalytics: true
  });

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const emergencyContacts = [
    { id: 1, name: 'Mom', phone: '+1 (555) 123-4567', relation: 'Family' },
    { id: 2, name: 'Jane Smith', phone: '+1 (555) 987-6543', relation: 'Friend' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={50} color="#0a7ea4" />
            </View>
          </View>
          <ThemedText type="title" style={styles.profileName}>Your Profile</ThemedText>
          <ThemedText style={styles.profileInfo}>Manage your safety settings</ThemedText>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Emergency Contacts</ThemedText>
          
          {emergencyContacts.map(contact => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <ThemedText type="defaultSemiBold">{contact.name}</ThemedText>
                <ThemedText>{contact.phone}</ThemedText>
                <ThemedText style={styles.relationText}>{contact.relation}</ThemedText>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="create-outline" size={20} color="#0a7ea4" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={20} color="#0a7ea4" />
            <ThemedText style={styles.addButtonText}>Add Emergency Contact</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Privacy & Safety Settings */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Privacy & Safety Settings</ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <ThemedText type="defaultSemiBold">Location Tracking</ThemedText>
              <ThemedText style={styles.settingDescription}>Allow continuous location tracking for safety features</ThemedText>
            </View>
            <Switch
              value={settings.locationTracking}
              onValueChange={() => toggleSetting('locationTracking')}
              trackColor={{ false: '#767577', true: '#0a7ea4' }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <ThemedText type="defaultSemiBold">Voice Sentiment Analysis</ThemedText>
              <ThemedText style={styles.settingDescription}>Detect stress in your voice to trigger automatic alerts</ThemedText>
            </View>
            <Switch
              value={settings.voiceSentiment}
              onValueChange={() => toggleSetting('voiceSentiment')}
              trackColor={{ false: '#767577', true: '#0a7ea4' }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <ThemedText type="defaultSemiBold">Automatic Recording</ThemedText>
              <ThemedText style={styles.settingDescription}>Record audio and video when SOS is triggered</ThemedText>
            </View>
            <Switch
              value={settings.autoRecording}
              onValueChange={() => toggleSetting('autoRecording')}
              trackColor={{ false: '#767577', true: '#0a7ea4' }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <ThemedText type="defaultSemiBold">Extended Data Retention</ThemedText>
              <ThemedText style={styles.settingDescription}>Keep recordings for 90 days instead of 30</ThemedText>
            </View>
            <Switch
              value={settings.dataRetention}
              onValueChange={() => toggleSetting('dataRetention')}
              trackColor={{ false: '#767577', true: '#0a7ea4' }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <ThemedText type="defaultSemiBold">Anonymous Analytics</ThemedText>
              <ThemedText style={styles.settingDescription}>Share anonymous usage data to improve the app</ThemedText>
            </View>
            <Switch
              value={settings.anonymousAnalytics}
              onValueChange={() => toggleSetting('anonymousAnalytics')}
              trackColor={{ false: '#767577', true: '#0a7ea4' }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>

        {/* About & Help */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>About & Help</ThemedText>
          
          <TouchableOpacity style={styles.helpItem}>
            <Ionicons name="help-circle-outline" size={24} color="#0a7ea4" />
            <ThemedText style={styles.helpItemText}>How to Use AI Guardian</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <Ionicons name="shield-outline" size={24} color="#0a7ea4" />
            <ThemedText style={styles.helpItemText}>Privacy Policy</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <Ionicons name="information-circle-outline" size={24} color="#0a7ea4" />
            <ThemedText style={styles.helpItemText}>About AI Guardian</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    marginBottom: 5,
  },
  profileInfo: {
    color: '#687076',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  relationText: {
    color: '#687076',
    fontSize: 14,
    marginTop: 2,
  },
  editButton: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  addButtonText: {
    color: '#0a7ea4',
    marginLeft: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingDescription: {
    fontSize: 14,
    color: '#687076',
    marginTop: 2,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  helpItemText: {
    marginLeft: 10,
  },
});