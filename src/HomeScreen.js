import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
// Yönlendirmenin kesin çalışması için useNavigation eklendi
import { useNavigation } from '@react-navigation/native'; 

const COLORS = {
  background: '#070714', 
  surface: '#121226',    
  surfaceHighlight: '#1A1A36', 
  textPrimary: '#F8FAFC',
  textSecondary: '#8888A0',
  accent: '#A855F7',     
  border: '#2A2A40',
  cardBg: '#1E1B4B', 
};

// Senin belirlediğin saf çakra renkleri
const initialChakras = [
  { id: 1, name: 'Kök', color: '#FF0000', progress: 0 },
  { id: 2, name: 'Sakral', color: '#FFA500', progress: 0 },
  { id: 3, name: 'Solar Plexus', color: '#FFFF00', progress: 0 },
  { id: 4, name: 'Kalp', color: '#00C82B', progress: 0 },
  { id: 5, name: 'Boğaz', color: '#00BFFF', progress: 0 },
  { id: 6, name: 'Üçüncü Göz', color: '#7202C2', progress: 0 },
  { id: 7, name: 'Tepe', color: '#CF03CF', progress: 0 },
];

export default function HomeScreen() {
  const [chakras, setChakras] = useState(initialChakras);
  // Navigation objesi hook ile garantilendi
  const navigation = useNavigation(); 

  const totalProgress = chakras.reduce((sum, chakra) => sum + chakra.progress, 0);
  const overallAura = Math.round(totalProgress / chakras.length);

  // Çakralara tıklandığında yapılacak yönlendirme
  const handleChakraNavigate = (chakra) => {
    if (chakra.id === 1) {
      // 1 ID'li (Kırmızı) Kök çakraya basılınca doğrudan özel detay sayfasına git
      navigation.navigate('RootChakraDetail');
    } 
    else if (chakra.id === 2) {
      // 2 ID'li (Turuncu) Sakral çakraya basılınca doğrudan özel detay sayfasına git
      navigation.navigate('SacralChakraDetail');
    } 
     else if (chakra.id === 3) {
      // 3 ID'li (Sarı) Solar Plexus çakraya basılınca doğrudan özel detay sayfasına git
      navigation.navigate('SolarPlexusDetail');
    } 
     else if (chakra.id === 4) {
      // 4 ID'li (Yeşil) Kalp çakraya basılınca doğrudan özel detay sayfasına git
      navigation.navigate('HeartChakraDetail');
    } else if (chakra.id === 5) {
      // 5 ID'li (Mavi) Boğaz çakraya basılınca doğrudan özel detay sayfasına git
      navigation.navigate('ThroatChakraDetail');
    }else {
      // Diğerleri şimdilik genel bir sayfaya gitsin
      navigation.navigate('ChakraDetail', { 
        chakraId: chakra.id, 
        chakraName: chakra.name,
        chakraColor: chakra.color 
      });
    }
  };

  // Görev butonuna basınca DailyMission sayfasına yönlendirme
  const handleDailyTaskNavigate = () => {
    navigation.navigate('DailyMission');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.mainContainer}
        bounces={false}
      >
        
        {/* ÜST BLOK: HEADER & ENERJİ AKIŞI */}
        <View style={styles.topGroup}>
          
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Merhaba,</Text>
              <Text style={styles.name}>Sinem</Text>
            </View>
            <TouchableOpacity 
              style={styles.taskBtn} 
              activeOpacity={0.7}
              onPress={handleDailyTaskNavigate}
            >
              <Text style={styles.taskBtnText}>Görev</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enerji Akışı</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.progressScroll}
            >
              {chakras.map((chakra) => (
                <TouchableOpacity 
                  key={chakra.id} 
                  style={styles.chakraItem}
                  activeOpacity={0.7}
                  onPress={() => handleChakraNavigate(chakra)}
                >
                  <View style={[styles.progressRing, { borderColor: chakra.color }]}>
                    <View style={[styles.innerCircle, { 
                        backgroundColor: chakra.progress === 100 ? chakra.color : COLORS.surfaceHighlight 
                      }]}>
                      <Text style={[styles.progressText, { 
                          color: chakra.progress === 100 ? '#FFF' : chakra.color 
                        }]}>
                        %{chakra.progress}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.chakraName}>{chakra.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* ORTA BLOK: AURA FREKANSI */}
        <View style={styles.middleGroup}>
          <View style={styles.frequencyContainer}>
            <View style={styles.frequencyHeader}>
              <Text style={styles.frequencyTitle}>Aura Frekansı</Text>
              <Text style={styles.frequencyPercentage}>%{overallAura}</Text>
            </View>
            
            <View style={styles.multiColorBarContainer}>
              {chakras.map((chakra, index) => (
                <View 
                  key={`bar-${chakra.id}`} 
                  style={[
                    styles.colorSegment, 
                    { 
                      backgroundColor: chakra.color,
                      opacity: chakra.progress > 0 ? 1 : 0.15,
                      borderTopLeftRadius: index === 0 ? 8 : 0,
                      borderBottomLeftRadius: index === 0 ? 8 : 0,
                      borderTopRightRadius: index === chakras.length - 1 ? 8 : 0,
                      borderBottomRightRadius: index === chakras.length - 1 ? 8 : 0,
                    }
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>

        {/* ALT BLOK: GÜNÜN REHBERİ */}
        <View style={styles.bottomGroup}>
          <Text style={styles.sectionTitle}>Günün Rehberi</Text>
          <View style={styles.dailyCard}>
            <View style={styles.cardContent}>
              <Text style={styles.quoteIcon}>"</Text>
              <Text style={styles.affirmationText}>
                İçimdeki potansiyel okyanuslar kadar derin. Karşıma çıkan her zorluğu bir basamak olarak görüyorum.
              </Text>
              <Text style={styles.cardFooter}>~ 3. Göz Çakrası</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  mainContainer: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  topGroup: {
    marginBottom: 36,
  },
  middleGroup: {
    marginBottom: 36,
  },
  bottomGroup: {
    marginBottom: 10,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    marginBottom: 36, 
  },
  greeting: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  name: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: COLORS.textPrimary, 
    letterSpacing: -0.5,
  },
  taskBtn: { 
    backgroundColor: COLORS.surfaceHighlight, 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskBtnText: { 
    color: COLORS.textPrimary, 
    fontSize: 12, 
    fontWeight: '600' 
  },
  section: { 
    width: '100%',
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: COLORS.textSecondary, 
    paddingHorizontal: 24, 
    marginBottom: 16,
    textTransform: 'uppercase', 
    letterSpacing: 1,
  },
  progressScroll: {
    paddingHorizontal: 16,
  },
  chakraItem: {
    alignItems: 'center',
    marginHorizontal: 12, 
  },
  progressRing: {
    width: 76, 
    height: 76, 
    borderRadius: 38,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: COLORS.surface,
  },
  innerCircle: {
    width: 64, 
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14, 
    fontWeight: '700', 
  },
  chakraName: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  frequencyContainer: { 
    marginHorizontal: 24, 
    backgroundColor: COLORS.surface, 
    padding: 24, 
    borderRadius: 24, 
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  frequencyHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: 16 
  },
  frequencyTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: COLORS.textSecondary 
  },
  frequencyPercentage: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: COLORS.textPrimary, 
    lineHeight: 32 
  },
  multiColorBarContainer: {
    flexDirection: 'row',
    height: 12, 
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  colorSegment: {
    flex: 1, 
    height: '100%',
    marginHorizontal: 1, 
  },
  dailyCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    minHeight: 140, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderWidth: 1,
    backgroundColor: COLORS.cardBg, 
    borderColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardContent: {
    width: '100%',
  },
  quoteIcon: {
    fontSize: 42, 
    color: COLORS.accent,
    fontWeight: '900',
    opacity: 0.4,
    marginBottom: -20,
    marginLeft: -4,
  },
  affirmationText: {
    fontSize: 15, 
    color: COLORS.textPrimary,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
    marginVertical: 14,
    letterSpacing: 0.3,
  },
  cardFooter: {
    fontSize: 12,
    color: '#D8B4FE', 
    fontWeight: '600',
    textAlign: 'right',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});