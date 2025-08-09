import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  
  const triggerSOS = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      Alert.alert(
        'SOS Activated',
        'Your emergency contacts have been notified with your location. Audio and video recording started.',
        [{ text: 'OK', onPress: () => console.log('SOS acknowledged') }]
      );
    } else {
      Alert.alert(
        'SOS Deactivated',
        'Emergency mode has been turned off.',
        [{ text: 'OK', onPress: () => console.log('SOS deactivated') }]
      );
    }
  };
  
  const navigateToSafety = () => {
    router.push('/(tabs)/safety');
  };
  
  const navigateToMaps = () => {
    router.push('/(tabs)/maps');
  };
  
  const navigateToProfile = () => {
    router.push('/(tabs)/profile');
  };
  
  const startSafeTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Safe Timer Started',
      'We will check on you in 30 minutes. If you don\'t respond, we\'ll alert your emergency contacts.',
      [{ text: 'OK', onPress: () => console.log('Timer started') }]
    );
  };
  
  const startSafeRide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Safe Ride Mode',
      'Please scan your driver\'s ID or license plate to verify your ride.',
      [{ text: 'OK', onPress: () => console.log('Safe ride mode') }]
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>AI Guardian</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>Women's Safety Edition</ThemedText>
        </View>
        
        {/* SOS Button */}
        <TouchableOpacity 
          style={[styles.sosButton, isRecording && styles.sosButtonActive]} 
          onPress={triggerSOS}
          activeOpacity={0.7}
        >
          <Ionicons name="alert-circle" size={30} color="white" />
          <ThemedText style={styles.sosButtonText}>
            {isRecording ? 'STOP SOS' : 'EMERGENCY SOS'}
          </ThemedText>
        </TouchableOpacity>
        
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Quick Actions</ThemedText>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton} onPress={navigateToSafety}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#0a7ea4" />
              </View>
              <ThemedText style={styles.quickActionText}>Safety Features</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton} onPress={startSafeTimer}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="timer-outline" size={24} color="#0a7ea4" />
              </View>
              <ThemedText style={styles.quickActionText}>Safe Timer</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton} onPress={navigateToMaps}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="map-outline" size={24} color="#0a7ea4" />
              </View>
              <ThemedText style={styles.quickActionText}>Safe Route</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton} onPress={startSafeRide}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="car-outline" size={24} color="#0a7ea4" />
              </View>
              <ThemedText style={styles.quickActionText}>Safe Ride</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Safety Status */}
        <View style={styles.safetyStatusContainer}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Safety Status</ThemedText>
          
          <View style={styles.safetyStatusCard}>
            <View style={styles.safetyStatusHeader}>
              <View style={styles.safetyStatusIndicator}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
              <ThemedText type="defaultSemiBold">You're Safe</ThemedText>
            </View>
            
            <View style={styles.safetyStatusDetails}>
              <View style={styles.safetyStatusItem}>
                <Ionicons name="location-outline" size={20} color="#687076" />
                <ThemedText style={styles.safetyStatusText}>Current Area: Low Risk</ThemedText>
              </View>
              
              <View style={styles.safetyStatusItem}>
                <Ionicons name="people-outline" size={20} color="#687076" />
                <ThemedText style={styles.safetyStatusText}>3 Helpers Nearby</ThemedText>
              </View>
              
              <View style={styles.safetyStatusItem}>
                <Ionicons name="flashlight-outline" size={20} color="#687076" />
                <ThemedText style={styles.safetyStatusText}>Well-lit Area</ThemedText>
              </View>
            </View>
          </View>
        </View>
        
        {/* AI Companion */}
        <View style={styles.aiCompanionContainer}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>AI Companion</ThemedText>
          
          <TouchableOpacity style={styles.aiCompanionCard}>
            <View style={styles.aiCompanionIcon}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#0a7ea4" />
            </View>
            <View style={styles.aiCompanionContent}>
              <ThemedText type="defaultSemiBold">Talk to Guardian AI</ThemedText>
              <ThemedText style={styles.aiCompanionText}>"I can keep you company while you walk or help with safety advice."</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Recent Incidents */}
        <View style={styles.recentIncidentsContainer}>
          <View style={styles.sectionTitleRow}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Recent Incidents Nearby</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.incidentCard}>
            <View style={styles.incidentIcon}>
              <Ionicons name="warning-outline" size={24} color="#FFC107" />
            </View>
            <View style={styles.incidentContent}>
              <ThemedText type="defaultSemiBold">Street Harassment</ThemedText>
              <ThemedText style={styles.incidentText}>0.5 miles away • 2 days ago</ThemedText>
              <ThemedText style={styles.incidentDescription}>Verbal harassment reported near Main St & 5th Ave.</ThemedText>
            </View>
          </View>
          
          <View style={styles.incidentCard}>
            <View style={styles.incidentIcon}>
              <Ionicons name="warning-outline" size={24} color="#FFC107" />
            </View>
            <View style={styles.incidentContent}>
              <ThemedText type="defaultSemiBold">Suspicious Activity</ThemedText>
              <ThemedText style={styles.incidentText}>0.8 miles away • 3 days ago</ThemedText>
              <ThemedText style={styles.incidentDescription}>Suspicious person following pedestrians reported near Park Ave.</ThemedText>
            </View>
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 5,
  },
  subtitle: {
    color: '#0a7ea4',
  },
  sosButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
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
    fontSize: 16,
    marginLeft: 10,
  },
  quickActionsContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  quickActionIcon: {
    marginBottom: 10,
  },
  quickActionText: {
    textAlign: 'center',
  },
  safetyStatusContainer: {
    marginBottom: 25,
  },
  safetyStatusCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  safetyStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  safetyStatusIndicator: {
    marginRight: 10,
  },
  safetyStatusDetails: {},
  safetyStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  safetyStatusText: {
    marginLeft: 10,
    color: '#687076',
  },
  aiCompanionContainer: {
    marginBottom: 25,
  },
  aiCompanionCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  aiCompanionIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  aiCompanionContent: {
    flex: 1,
  },
  aiCompanionText: {
    color: '#687076',
    marginTop: 5,
  },
  recentIncidentsContainer: {
    marginBottom: 25,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#0a7ea4',
  },
  incidentCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  incidentIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  incidentContent: {
    flex: 1,
  },
  incidentText: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 5,
  },
  incidentDescription: {
    color: '#11181C',
  },
});
