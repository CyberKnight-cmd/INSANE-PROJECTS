import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import MapView, { Marker, Heatmap, Polyline } from 'react-native-maps';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function MapScreen() {
  const [searchText, setSearchText] = useState('');
  const [showRiskHeatmap, setShowRiskHeatmap] = useState(false);
  const [showSafeRoute, setShowSafeRoute] = useState(false);
  
  // Mock data for the heatmap (would come from backend in real app)
  const heatmapPoints = [
    { latitude: 37.78825, longitude: -122.4324, weight: 1 },
    { latitude: 37.78925, longitude: -122.4344, weight: 0.8 },
    { latitude: 37.78625, longitude: -122.4304, weight: 0.6 },
    { latitude: 37.78725, longitude: -122.4354, weight: 0.9 },
    { latitude: 37.78525, longitude: -122.4274, weight: 0.7 },
  ];
  
  // Mock data for safe route (would be calculated by backend)
  const safeRouteCoordinates = [
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.78725, longitude: -122.4314 },
    { latitude: 37.78625, longitude: -122.4294 },
    { latitude: 37.78525, longitude: -122.4274 },
  ];
  
  const toggleRiskHeatmap = () => {
    setShowRiskHeatmap(!showRiskHeatmap);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const toggleSafeRoute = () => {
    setShowSafeRoute(!showSafeRoute);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!showSafeRoute) {
      Alert.alert(
        'Safe Route Generated',
        'This route avoids high-risk areas based on recent incident reports and lighting conditions.',
        [{ text: 'OK', onPress: () => console.log('Safe route acknowledged') }]
      );
    }
  };
  
  const startSafeTrip = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Safe Trip Started',
      'We will check on you every 10 minutes. Your trusted contacts will be notified of your journey.',
      [{ text: 'OK', onPress: () => console.log('Safe trip started') }]
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a destination"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#0a7ea4" />
        </TouchableOpacity>
      </View>
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Current Location Marker */}
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Your Location"
          description="You are here"
        >
          <View style={styles.currentLocationMarker}>
            <Ionicons name="person" size={16} color="white" />
          </View>
        </Marker>
        
        {/* Destination Marker */}
        <Marker
          coordinate={{ latitude: 37.78525, longitude: -122.4274 }}
          title="Destination"
          description="Your destination"
        />
        
        {/* Risk Heatmap Layer */}
        {showRiskHeatmap && (
          <Heatmap
            points={heatmapPoints}
            radius={40}
            opacity={0.6}
            gradient={{
              colors: ['#00FF00', '#FFFF00', '#FF0000'],
              startPoints: [0.2, 0.5, 0.9],
              colorMapSize: 256,
            }}
          />
        )}
        
        {/* Safe Route Layer */}
        {showSafeRoute && (
          <Polyline
            coordinates={safeRouteCoordinates}
            strokeWidth={4}
            strokeColor="#0a7ea4"
            lineDashPattern={[1]}
          />
        )}
      </MapView>
      
      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={[styles.mapButton, showRiskHeatmap && styles.mapButtonActive]}
          onPress={toggleRiskHeatmap}
        >
          <Ionicons 
            name="warning-outline" 
            size={20} 
            color={showRiskHeatmap ? "white" : "#0a7ea4"} 
          />
          <ThemedText style={[styles.mapButtonText, showRiskHeatmap && styles.mapButtonTextActive]}>
            Risk Map
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.mapButton, showSafeRoute && styles.mapButtonActive]}
          onPress={toggleSafeRoute}
        >
          <Ionicons 
            name="shield-checkmark-outline" 
            size={20} 
            color={showSafeRoute ? "white" : "#0a7ea4"} 
          />
          <ThemedText style={[styles.mapButtonText, showSafeRoute && styles.mapButtonTextActive]}>
            Safe Route
          </ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Start Safe Trip Button */}
      <TouchableOpacity style={styles.startTripButton} onPress={startSafeTrip}>
        <Ionicons name="play-circle-outline" size={24} color="white" />
        <ThemedText style={styles.startTripButtonText}>Start Safe Trip</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  map: {
    flex: 1,
  },
  currentLocationMarker: {
    backgroundColor: '#0a7ea4',
    borderRadius: 50,
    padding: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  mapControls: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    backgroundColor: 'transparent',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  mapButtonActive: {
    backgroundColor: '#0a7ea4',
  },
  mapButtonText: {
    marginLeft: 5,
    fontSize: 14,
  },
  mapButtonTextActive: {
    color: 'white',
  },
  startTripButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#0a7ea4',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startTripButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});
