import React, { useContext } from 'react'; 
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import Svg, { Path, Circle, Defs, ClipPath, G } from 'react-native-svg';
import { ChakraContext } from './ChakraContext'; 

const COLORS = {
  bgDark: '#01060A', surface: '#071018', textWhite: '#F8FAFC',    
  textGray: '#8A9BA8', textDarkGray: '#2D3F50', border: 'rgba(255, 255, 255, 0.06)', cardBg: '#050B14', 
};

export default function HomeScreen() {
  const navigation = useNavigation(); 
  
  const { chakras } = useContext(ChakraContext);

  const totalProgress = chakras.reduce((sum, chakra) => sum + chakra.progress, 0);
  const overallAura = Math.round(totalProgress / chakras.length);

  const handleChakraNavigate = (chakra) => {
    if (chakra.id === 1) navigation.navigate('RootChakraDetail');
    else if (chakra.id === 2) navigation.navigate('SacralChakraDetail');
    else if (chakra.id === 3) navigation.navigate('SolarPlexusDetail');
    else if (chakra.id === 4) navigation.navigate('HeartChakraDetail');
    else if (chakra.id === 5) navigation.navigate('ThroatChakraDetail');
    else if (chakra.id === 6) navigation.navigate('ThirdEyeChakraDetail');
    else if (chakra.id === 7) navigation.navigate('CrownChakraDetail');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mainContainer}>
        
        {/* HEADER */}
        <View style={styles.topGroup}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Merhaba,</Text>
              <Text style={styles.name}>Sinem</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.streakBadge}><Text style={styles.streakText}>🔥 3</Text></View>
              <TouchableOpacity style={styles.taskBtn} activeOpacity={0.7} onPress={() => navigation.navigate('DailyMission')}>
                <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.textWhite} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                  <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </Svg>
                <Text style={styles.taskBtnText}>Görev</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* SIVI DOLUMLU ÇAKRALAR */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ENERJİ AKIŞI</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.progressScroll}>
              {chakras.map((chakra) => {
                
                // Sıvı Dolum Y Ekseni Hesaplaması
                const size = 62; 
                const waterY = size - (size * (chakra.progress / 100));

                return (
                  <TouchableOpacity key={chakra.id} style={styles.chakraItem} activeOpacity={0.7} onPress={() => handleChakraNavigate(chakra)}>
                    <View style={[styles.progressRing, { borderColor: `${chakra.color}40`, shadowColor: chakra.color }]}>
                      
                      {/* Sıvı Maskeleme Alanı */}
                      <View style={styles.innerCircle}>
                        
                        {/* SVG SIVI ÇİZİMİ (Altta kalacak) */}
                        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute' }}>
                          <Defs>
                            <ClipPath id={`mask-${chakra.id}`}>
                              <Circle cx={size/2} cy={size/2} r={size/2} />
                            </ClipPath>
                          </Defs>
                          
                          <Circle cx={size/2} cy={size/2} r={size/2} fill={COLORS.surface} />
                          
                          {chakra.progress > 0 && (
                            <G clipPath={`url(#mask-${chakra.id})`}>
                              <Path 
                                d={`M 0 ${waterY} Q ${size/4} ${waterY - 4} ${size/2} ${waterY} T ${size} ${waterY} L ${size} ${size} L 0 ${size} Z`} 
                                fill={chakra.color} 
                                opacity={0.85} 
                              />
                            </G>
                          )}
                        </Svg>
                        
                        {/* YÜZDE YAZISI (Z-index ile en üstte, tam ortada) */}
                        <View style={styles.percentageOverlay}>
                          <Text style={[
                            styles.progressText, 
                            { 
                              // Sıvı %45'i geçerse yazı beyaz olur (Kontrast için)
                              color: chakra.progress > 45 ? '#FFFFFF' : chakra.color,
                            }
                          ]}>
                            %{chakra.progress}
                          </Text>
                        </View>
                        
                      </View>

                    </View>
                    <Text style={styles.chakraName}>{chakra.name}</Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>
        </View>

        {/* AURA FREKANSI */}
        <View style={styles.middleGroup}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 24 }]}>AURA DURUMU</Text>
          <View style={styles.frequencyContainer}>
            <View style={styles.frequencyHeader}>
              <Text style={styles.frequencyTitle}>Genel Frekans</Text>
              <Text style={styles.frequencyPercentage}>%{overallAura}</Text>
            </View>
            <View style={styles.multiColorBarContainer}>
              {chakras.map((chakra, index) => (
                <View key={`bar-${chakra.id}`} style={[styles.colorSegment, { backgroundColor: chakra.color, opacity: chakra.progress > 0 ? 1 : 0.2, borderTopLeftRadius: index === 0 ? 8 : 0, borderBottomLeftRadius: index === 0 ? 8 : 0, borderTopRightRadius: index === chakras.length - 1 ? 8 : 0, borderBottomRightRadius: index === chakras.length - 1 ? 8 : 0 }]} />
              ))}
            </View>
          </View>
        </View>

        {/* GÜNÜN REHBERİ */}
        <View style={styles.bottomGroup}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 24 }]}>GÜNÜN REHBERİ</Text>
          <View style={styles.dailyCard}>
            <View style={styles.cardGlowLine} />
            <View style={styles.energyTag}><Text style={styles.energyTagText}>🌕 DOLUNAY ENERJİSİ</Text></View>
            <View style={styles.cardContent}>
              <Text style={styles.quoteIcon}>"</Text>
              <Text style={styles.affirmationText}>İçimdeki potansiyel okyanuslar kadar derin. Karşıma çıkan her zorluğu bir basamak olarak görüyorum.</Text>
              <Text style={styles.cardFooter}>~ 3. Göz Çakrası</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgDark },
  mainContainer: { paddingTop: 20, paddingBottom: 50 },
  topGroup: { marginBottom: 35 }, middleGroup: { marginBottom: 35 }, bottomGroup: { marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 40 },
  greeting: { fontSize: 13, color: COLORS.textGray, fontWeight: '400', letterSpacing: 1, marginBottom: 4 },
  name: { fontSize: 26, fontWeight: '800', color: COLORS.textWhite, letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  streakBadge: { backgroundColor: 'rgba(255, 165, 0, 0.1)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 165, 0, 0.3)' },
  streakText: { fontSize: 12, fontWeight: '700', color: '#FFA500', letterSpacing: 0.5 },
  taskBtn: { flexDirection: 'row', backgroundColor: COLORS.surface, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 4 },
  taskBtnText: { color: COLORS.textWhite, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: COLORS.textGray, paddingHorizontal: 24, marginBottom: 16, letterSpacing: 3, opacity: 0.7 },
  progressScroll: { paddingHorizontal: 16, paddingTop: 15, paddingBottom: 25, overflow: 'visible' },
  chakraItem: { alignItems: 'center', marginHorizontal: 10 },
  progressRing: { width: 76, height: 76, borderRadius: 38, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: COLORS.bgDark, ...Platform.select({ ios: { shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 8 }, android: { elevation: 6 }}) },
  
  // Sıvı Efekti ve Yazı Kapsayıcısı
  innerCircle: { 
    width: 62, 
    height: 62, 
    borderRadius: 31, 
    overflow: 'hidden', 
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  percentageOverlay: { 
    position: 'absolute', 
    zIndex: 10, 
    elevation: 10,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  progressText: { fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] },
  chakraName: { fontSize: 11, color: COLORS.textWhite, fontWeight: '600', opacity: 0.9, letterSpacing: 0.5 },
  frequencyContainer: { marginHorizontal: 24, backgroundColor: COLORS.surface, padding: 24, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  frequencyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  frequencyTitle: { fontSize: 14, fontWeight: '500', color: COLORS.textWhite, opacity: 0.9 },
  frequencyPercentage: { fontSize: 32, fontWeight: '800', color: COLORS.textWhite, lineHeight: 36, letterSpacing: -1 },
  multiColorBarContainer: { flexDirection: 'row', height: 10, width: '100%', backgroundColor: COLORS.bgDark, borderRadius: 8, overflow: 'hidden' },
  colorSegment: { flex: 1, height: '100%', marginHorizontal: 1 },
  dailyCard: { marginHorizontal: 24, borderRadius: 24, minHeight: 140, justifyContent: 'center', paddingTop: 30, paddingBottom: 24, paddingHorizontal: 24, borderWidth: 1, backgroundColor: COLORS.cardBg, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8, position: 'relative', overflow: 'hidden' },
  cardGlowLine: { position: 'absolute', top: 0, left: 24, right: 24, height: 2, backgroundColor: '#7202C2', opacity: 0.6, shadowColor: '#7202C2', shadowOpacity: 1, shadowRadius: 10 },
  energyTag: { position: 'absolute', top: 16, left: 24, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  energyTagText: { color: COLORS.textGray, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  cardContent: { width: '100%', position: 'relative', marginTop: 10 },
  quoteIcon: { position: 'absolute', top: -35, left: -10, fontSize: 60, color: '#7202C2', fontWeight: '900', opacity: 0.15 },
  affirmationText: { fontSize: 15, color: COLORS.textWhite, fontWeight: '300', lineHeight: 26, marginVertical: 10, letterSpacing: 0.3, zIndex: 2 },
  cardFooter: { fontSize: 10, color: '#7202C2', fontWeight: '700', textAlign: 'right', letterSpacing: 1, marginTop: 10 }
});