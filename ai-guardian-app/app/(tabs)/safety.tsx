import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function SafetyScreen() {
  const [isSafeTimerActive, setSafeTimerActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const triggerSOS = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'SOS Activated',
      'Your emergency contacts would be notified with your location and a situation summary.',
      [{ text: 'OK', onPress: () => console.log('SOS acknowledged') }]
    );
    // In a real app, this would:
    // 1. Start recording audio/video
    // 2. Send location to emergency contacts
    // 3. Generate AI summary of the situation
    setIsRecording(true);
  };

  const toggleSafeTimer = () => {
    setSafeTimerActive(!isSafeTimerActive);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!isSafeTimerActive) {
      Alert.alert(
        'Safe Timer Activated',
        'We will check on you in 30 minutes. If you don\'t respond, we\'ll alert your emergency contacts.',
        [{ text: 'OK', onPress: () => console.log('Timer acknowledged') }]
      );
    } else {
      Alert.alert(
        'Safe Timer Deactivated',
        'Timer has been cancelled.',
        [{ text: 'OK', onPress: () => console.log('Timer cancelled') }]
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>AI Guardian</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Women's Safety Edition</ThemedText>
        
        {/* SOS Button */}
        <TouchableOpacity 
          style={[styles.sosButton, isRecording && styles.sosButtonActive]} 
          onPress={triggerSOS}
          activeOpacity={0.7}
        >
          <Ionicons name="alert-circle" size={40} color="white" />
          <ThemedText style={styles.sosButtonText}>
            {isRecording ? 'SOS ACTIVE' : 'EMERGENCY SOS'}
          </ThemedText>
        </TouchableOpacity>

        {/* Safety Features */}
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Safety Features</ThemedText>
        
        {/* Safe Timer */}
        <TouchableOpacity 
          style={[styles.featureButton, isSafeTimerActive && styles.featureButtonActive]} 
          onPress={toggleSafeTimer}
        >
          <Ionicons 
            name="timer-outline" 
            size={24} 
            color={isSafeTimerActive ? "#fff" : "#0a7ea4"} 
          />
          <ThemedText 
            style={[styles.featureText, isSafeTimerActive && styles.featureTextActive]}
          >
            Safe Timer
          </ThemedText>
        </TouchableOpacity>

        {/* Safe Route */}
        <TouchableOpacity style={styles.featureButton}>
          <Ionicons name="map-outline" size={24} color="#0a7ea4" />
          <ThemedText style={styles.featureText}>Safe Route Planning</ThemedText>
        </TouchableOpacity>

        {/* Voice Shield */}
        <TouchableOpacity style={styles.featureButton}>
          <Ionicons name="mic-outline" size={24} color="#0a7ea4" />
          <ThemedText style={styles.featureText}>Voice Shield</ThemedText>
        </TouchableOpacity>

        {/* Safe Ride */}
        <TouchableOpacity style={styles.featureButton}>
          <Ionicons name="car-outline" size={24} color="#0a7ea4" />
          <ThemedText style={styles.featureText}>Safe Ride Verification</ThemedText>
        </TouchableOpacity>

        {/* Nearby Helpers */}
        <TouchableOpacity style={styles.featureButton}>
          <Ionicons name="people-outline" size={24} color="#0a7ea4" />
          <ThemedText style={styles.featureText}>Nearby Helpers</ThemedText>
        </TouchableOpacity>

        {/* Training Mode */}
        <TouchableOpacity style={styles.featureButton}>
          <Ionicons name="school-outline" size={24} color="#0a7ea4" />
          <ThemedText style={styles.featureText}>Safety Training</ThemedText>
        </TouchableOpacity>
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
  title: {
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
    color: '#0a7ea4',
  },
  sosButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 50,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    flexDirection: 'row',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sosButtonActive: {
    backgroundColor: '#c0392b',
  },
  sosButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  featureButtonActive: {
    backgroundColor: '#0a7ea4',
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
  },
  featureTextActive: {
    color: '#fff',
  },
});