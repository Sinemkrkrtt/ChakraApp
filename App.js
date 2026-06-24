import 'react-native-gesture-handler'; // Mutlaka en üstte olmalı!
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/HomeScreen';

import SacralChakraDetail from './src/SacralChakraDetail'; // Sakral çakra detay sayfası
import RootChakraDetail from './src/RootChakraDetail';
import SolarPlexusDetail from './src/SolarPlexusDetail'; // Solar Plexus çakra detay sayfası
import HeartChakraDetail from './src/HeartChakraDetail'; // Kalp çakra detay sayfası
import ThroatChakraDetail from './src/ThroatChakraDetail'; // Boğaz çakra detay sayfası

const ChakraDetailPlaceholder = ({ route }) => {
  const { chakraName, chakraColor } = route.params || {};
  return (
    <View style={[styles.placeholderContainer, { backgroundColor: chakraColor || '#070714' }]}>
      <Text style={styles.placeholderText}>{chakraName} Çakrası Detay Sayfası</Text>
      <Text style={styles.placeholderSubText}>Çok yakında tasarlanacak...</Text>
    </View>
  );
};

const DailyMissionPlaceholder = () => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>Günlük Görevler</Text>
    <Text style={styles.placeholderSubText}>Çok yakında tasarlanacak...</Text>
  </View>
);
// ------------------------------------------------------------------

// Stack Navigator oluşturuyoruz
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // NavigationContainer tüm uygulamayı sarmalamalıdır
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Kendi özel header'larımızı yaptığımız için varsayılan üst çubuğu gizliyoruz
          animation: 'fade',  // Premium bir geçiş efekti
        }}
      >
        {/* ANA SAYFA */}
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* DETAY SAYFALARI */}
        <Stack.Screen name="RootChakraDetail" component={RootChakraDetail} />
        <Stack.Screen name="SacralChakraDetail" component={SacralChakraDetail} />
         <Stack.Screen name="SolarPlexusDetail" component={SolarPlexusDetail} />
        <Stack.Screen name="HeartChakraDetail" component={HeartChakraDetail} />
        <Stack.Screen name="ThroatChakraDetail" component={ThroatChakraDetail} />
        <Stack.Screen name="ChakraDetail" component={ChakraDetailPlaceholder} />
        <Stack.Screen name="DailyMission" component={DailyMissionPlaceholder} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#070714',
  },
  placeholderText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholderSubText: {
    color: '#8888A0',
    fontSize: 16,
  }
});