import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  Dimensions
} from 'react-native';
import Svg, { Circle, G, Line, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ChakraContext } from './ChakraContext';

const { width } = Dimensions.get('window');

// SOLAR PLEXUS SARI/ALTIN RENK PALETİ (Premium Tonlar)
const COLORS = {
  bgDark: '#0A0A08',       
  surface: '#141410',      
  surfaceBorder: '#2A281E',
  primaryYellow: '#F1C40F', 
  glowYellow: '#F39C12',    
  darkYellow: '#4A3F14',    
  textWhite: '#F4F4F5',    
  textGray: '#8A8A83',     
  textDarkGray: '#55554C',
};

// --- YARDIMCI BİLEŞEN: Çevresi Halkalı Mini Metrik Kartları ---
const RingMetricCard = ({ label, value, subLabel, progress, type }) => {
  const size = 56;
  const cx = size / 2;
  const r = 24;
  const c = 2 * Math.PI * r;
  const arcLength = (240 / 360) * c; 
  const gapLength = c - arcLength;

  const renderIcon = () => {
    switch(type) {
      case 'fire':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryYellow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 2c0 0-4 5-4 9a4 4 0 008 0c0-4-4-9-4-9z" fill={COLORS.primaryYellow} fillOpacity={0.3} />
          </Svg>
        );
      case 'bolt':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryYellow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={COLORS.primaryYellow} fillOpacity={0.3} />
          </Svg>
        );
      case 'timer':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.textGray} strokeWidth="2" strokeDasharray="3 3">
            <Circle cx="12" cy="12" r="8" />
            <Path d="M12 8v4l3 3" stroke={COLORS.textWhite} strokeDasharray="none" />
          </Svg>
        );
      default: return null;
    }
  };

  return (
    <View style={styles.metricCard}>
      <Text style={styles.cardHeader}>{label}</Text>
      
      <View style={styles.gaugeCenter}>
        <Svg width={size} height={size}>
          <Circle cx={cx} cy={cx} r={r} stroke={COLORS.darkYellow} strokeWidth="3" fill="none" strokeDasharray={`${arcLength} ${gapLength}`} transform={`rotate(150 ${cx} ${cx})`} strokeLinecap="round" />
          <Circle cx={cx} cy={cx} r={r} stroke={type === 'timer' ? COLORS.textGray : COLORS.glowYellow} strokeWidth="3" fill="none" strokeDasharray={`${arcLength} ${gapLength}`} strokeDashoffset={arcLength - (arcLength * progress)} transform={`rotate(150 ${cx} ${cx})`} strokeLinecap="round" />
        </Svg>
        <View style={styles.gaugeIconWrapper}>
          {renderIcon()}
        </View>
      </View>

      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.cardFooter}>{subLabel}</Text>
    </View>
  );
};

// --- ANA BİLEŞEN ---
export default function SolarPlexusDetail() {
  const navigation = useNavigation();
  
  // GLOBAL BAĞLANTI (Ana ekranla senkronizasyon için)
  const { chakras, updateChakraProgress } = useContext(ChakraContext);
  const goal = 30; // 30 Dakika Hedef

  // Başlangıç değerini statik bir rakam yerine Global Hafızadan çekiyoruz
  const [currentMins, setCurrentMins] = useState(() => {
    const solar = chakras.find(c => c.id === 3);
    return solar ? (solar.progress / 100) * goal : 0;
  });

  const progress = Math.min(currentMins / goal, 1);

  // 🧠 EŞZAMANLI GÜNCELLEME (Local + Global)
  const addWorkout = (mins) => {
    // 1. Yeni dakikayı hesapla (Tasarımı bozmamak için makul bir sınır koy)
    const newMins = Math.min(currentMins + mins, goal + 60); 
    
    // 2. Bu sayfanın görseli için yerel state'i güncelle
    setCurrentMins(newMins);
    
    // 3. Ana ekran (Home Screen) için Solar Plexus (ID: 3) yüzdesini güncelle
    const newProgress = Math.min(Math.floor((newMins / goal) * 100), 100);
    updateChakraProgress(3, newProgress);
  };

  // Kök Çakra Stilindeki Milimetrik Arc (Yay) Hesaplamaları
  const size = width * 0.85;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = 26;
  const r = (size - strokeWidth) / 2 - 30; 
  
  const c = 2 * Math.PI * r;
  const startAngle = 135; 
  const sweepAngle = 270; 
  const arcLength = (sweepAngle / 360) * c;
  const gapLength = c - arcLength;
  const progressLength = arcLength * progress;

  const dotAngleRad = (startAngle + (sweepAngle * progress)) * (Math.PI / 180);
  const dotX = cx + r * Math.cos(dotAngleRad);
  const dotY = cy + r * Math.sin(dotAngleRad);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()} 
            activeOpacity={0.7}
          >
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.textGray} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <Path d="M19 12H5M12 19l-7-7 7-7" />
            </Svg>
          </TouchableOpacity>

          <View style={styles.textGlowContainer}>
            <Text style={[styles.headerTitle, styles.textGlow]}>SOLAR PLEKSUS ÇAKRA</Text>
            <Text style={styles.headerTitle}>SOLAR PLEKSUS ÇAKRA</Text>
          </View>
          <View style={styles.headerGlowLine} />
        </View>
       
        {/* --- HERO SECTION: ENERJİ ARK TASARIMI --- */}
        <View style={styles.hero}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#8A7A19" />
                <Stop offset="50%" stopColor="#C9B21A" />
                <Stop offset="100%" stopColor={COLORS.primaryYellow} />
              </LinearGradient>
              <LinearGradient id="glowDot" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FFF" />
                <Stop offset="100%" stopColor={COLORS.primaryYellow} />
              </LinearGradient>
            </Defs>

            {/* Dış Kesik Çizgili Teknik Çerçeve */}
            <Circle cx={cx} cy={cy} r={r + 42} stroke={COLORS.surfaceBorder} strokeWidth="1" strokeDasharray="3 6" fill="none" />

            {/* Arka Plan Koyu İz */}
            <Circle
              cx={cx} cy={cy} r={r}
              stroke={COLORS.darkYellow} strokeWidth={strokeWidth} fill="none"
              strokeDasharray={`${arcLength} ${gapLength}`}
              transform={`rotate(${startAngle} ${cx} ${cy})`}
              strokeLinecap="round"
            />

            {/* Renkli İlerleme Barı */}
            <Circle
              cx={cx} cy={cy} r={r}
              stroke="url(#heroGradient)" strokeWidth={strokeWidth} fill="none"
              strokeDasharray={`${arcLength} ${gapLength}`}
              strokeDashoffset={arcLength - progressLength}
              transform={`rotate(${startAngle} ${cx} ${cy})`}
              strokeLinecap="round"
            />

            {/* Dış Tırtıklar (Ticks) ve Geometrik Ölçekler */}
            <G origin={`${cx}, ${cy}`}>
              {Array.from({ length: 60 }).map((_, i) => {
                if (i > 45) return null; 
                const angle = startAngle + (i * (sweepAngle / 45));
                const isMajor = i % 15 === 0;
                const isMedium = i % 5 === 0 && !isMajor;
                
                const tickLen = isMajor ? 36 : (isMedium ? 30 : 26);
                const strokeC = isMajor ? COLORS.glowYellow : (isMedium ? COLORS.textGray : COLORS.textDarkGray);
                const strokeW = isMajor ? 2 : 1;

                return (
                  <Line
                    key={i}
                    x1={cx + (r + 20) * Math.cos(angle * Math.PI / 180)}
                    y1={cy + (r + 20) * Math.sin(angle * Math.PI / 180)}
                    x2={cx + (r + tickLen) * Math.cos(angle * Math.PI / 180)}
                    y2={cy + (r + tickLen) * Math.sin(angle * Math.PI / 180)}
                    stroke={strokeC}
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                  />
                );
              })}
            </G>

            {/* Uçtaki Parlayan Nokta (Thumb) */}
            <Circle cx={dotX} cy={dotY} r={6} fill="url(#glowDot)" />
            <Circle cx={dotX} cy={dotY} r={16} fill={COLORS.glowYellow} opacity={0.4} />
          </Svg>
          
          {/* Merkez Tipografi */}
          <View style={styles.innerRingText}>
            <Text style={styles.stepLabelTop}>AKTİVİTE</Text>
            <Text style={styles.stepCount}>{currentMins}</Text>
            <Text style={styles.stepLabelBottom}>TOPLAM DAKİKA</Text>
            <Text style={styles.stepPercentage}>{(progress * 100).toFixed(0)}%</Text>
          </View>
        </View>

        {/* --- 2. BÖLÜM: ANTRENMAN EKLEME PANELİ (Pulse/Enerji Çizgileri) --- */}
        <Text style={styles.sectionTitle}>ANTRENMAN KONTROLLERİ</Text>
        <View style={styles.playerCard}>
          <Text style={styles.playerSubTitle}>İRADENİ GÖSTER</Text>
          <Text style={styles.playTitle}>Aktivite Süresi Ekle</Text>
          
          {/* Arka Plan Enerji EKG / Pulse Efekti */}
          <View style={styles.waveContainer}>
            <Svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
              {Array.from({length: 60}).map((_, i) => (
                <Line key={`b-${i}`} x1={i * 5} y1={10} x2={i * 5} y2={50} stroke={COLORS.textDarkGray} strokeWidth="1" opacity={0.15} />
              ))}
              {/* Enerji Çizgisi (EKG benzeri zigzag) */}
              <Path 
                d="M 0 30 L 40 30 L 50 15 L 60 45 L 75 10 L 90 50 L 105 20 L 115 30 L 185 30 L 195 15 L 210 55 L 225 5 L 240 40 L 250 30 L 300 30" 
                fill="none" stroke={COLORS.primaryYellow} strokeWidth="2" opacity="0.8" strokeLinecap="round" strokeLinejoin="round"
              />
              <Path 
                d="M 0 30 L 40 30 L 50 15 L 60 45 L 75 10 L 90 50 L 105 20 L 115 30 L 185 30 L 195 15 L 210 55 L 225 5 L 240 40 L 250 30 L 300 30" 
                fill="none" stroke={COLORS.glowYellow} strokeWidth="4" opacity="0.3" strokeLinecap="round" strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* İkonlu Estetik Butonlar */}
          <View style={styles.playerControls}>
            
            {/* Esneme / Yoga (10 Dk) */}
            <TouchableOpacity onPress={() => addWorkout(10)} activeOpacity={0.6} style={styles.iconBtnSide}>
              <View style={styles.iconCircle}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.textGray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <Circle cx="12" cy="5" r="2"/>
                   <Path d="M12 7v8M8 11h8M10 20l2-5 2 5"/>
                </Svg>
              </View>
              <Text style={styles.iconBtnLabel}>10 Dk</Text>
            </TouchableOpacity>
            
            {/* Ana Egzersiz (30 Dk) Orta İkon */}
            <TouchableOpacity onPress={() => addWorkout(30)} style={styles.iconBtnMain} activeOpacity={0.8}>
              <View style={styles.playBtnInner}>
                <Svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={COLORS.bgDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <Path d="M6.5 6.5h11v11h-11z" />
                   <Path d="M21 12h-3M6 12H3M12 3v3M12 21v-3" strokeOpacity={0.5}/>
                </Svg>
              </View>
              <Text style={styles.iconBtnMainLabel}>30 Dk</Text>
            </TouchableOpacity>

            {/* Kısa Egzersiz / Ağırlık (15 Dk) */}
            <TouchableOpacity onPress={() => addWorkout(15)} activeOpacity={0.6} style={styles.iconBtnSide}>
              <View style={styles.iconCircle}>
                <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.textGray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <Path d="M6 5v14M18 5v14M4 8h4M4 16h4M16 8h4M16 16h4M10 12h4"/>
                </Svg>
              </View>
              <Text style={styles.iconBtnLabel}>15 Dk</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* --- 3. BÖLÜM: GÜNLÜK DURUM (Halkalı İkonlar) --- */}
        <Text style={styles.sectionTitle}>ANTRENMAN ÖZETİ</Text>
        <View style={styles.metricsRow}>
          <RingMetricCard label="ENERJİ" value={Math.floor(currentMins * 6.5)} subLabel="KCAL" progress={progress} type="fire" />
          <RingMetricCard label="GÜÇ" value="85" subLabel="BPM" progress={0.85} type="bolt" />
          <RingMetricCard label="KALAN" value={Math.max(0, goal - currentMins)} subLabel="DAKİKA" progress={1 - progress} type="timer" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.bgDark 
  },
  scroll: { 
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 60,
  },
  header: { alignItems: 'center', marginTop: 15, marginBottom: 30 },
  backButton: { position: 'absolute', left: 0, width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: COLORS.surfaceBorder, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  textGlowContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600', letterSpacing: 6 },
  textGlow: { position: 'absolute', color: COLORS.primaryYellow, opacity: 0.6, textShadowColor: COLORS.primaryYellow, textShadowRadius: 15 },
  headerGlowLine: { marginTop: 12, width: 80, height: 2, backgroundColor: COLORS.primaryYellow },
  
  hero: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 10,
    height: 330, 
  },
  innerRingText: { 
    position: 'absolute', 
    alignItems: 'center',
    top: '32%',
  },
  stepLabelTop: {
    color: COLORS.textGray,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 4,
    fontWeight: '500',
  },
  stepCount: { 
    color: COLORS.textWhite, 
    fontSize: 56, 
    fontWeight: '700', 
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(241, 196, 15, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
  },
  stepLabelBottom: { 
    color: COLORS.textDarkGray, 
    fontSize: 10, 
    letterSpacing: 1.5, 
    marginTop: 4,
    fontWeight: '600'
  },
  stepPercentage: {
    color: COLORS.glowYellow,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
  },

  sectionTitle: {
    color: COLORS.textDarkGray,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 15,
  },

  playerCard: { 
    backgroundColor: COLORS.surface, 
    paddingTop: 18,
    paddingBottom: 20, 
    paddingHorizontal: 20,
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: COLORS.surfaceBorder,
    alignItems: 'center',
    marginBottom: 20,
  },
  playerSubTitle: {
    color: COLORS.textGray,
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 6,
    fontWeight: '600',
  },
  playTitle: { 
    color: COLORS.textWhite, 
    fontSize: 16, 
    fontWeight: '600',
    marginBottom: 15,
  },
  waveContainer: {
    width: '100%',
    height: 60,
    marginBottom: 20,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '90%',
  },
  iconBtnSide: {
    alignItems: 'center',
    width: 60,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconBtnLabel: {
    color: COLORS.textGray,
    fontSize: 10,
    fontWeight: '600',
  },
  iconBtnMain: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  playBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.glowYellow,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primaryYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 8,
  },
  iconBtnMainLabel: {
    color: COLORS.glowYellow,
    fontSize: 11,
    fontWeight: '800',
  },

  metricsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20,
  },
  metricCard: { 
    width: (width - 55) / 3, 
    aspectRatio: 0.85, 
    backgroundColor: COLORS.surface, 
    borderRadius: 18, 
    borderWidth: 1, 
    borderColor: COLORS.surfaceBorder,
    padding: 10,
    alignItems: 'center',
  },
  cardHeader: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    opacity: 0.9,
  },
  gaugeCenter: {
    height: 56,
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  gaugeIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  cardFooter: {
    color: COLORS.textGray,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
});