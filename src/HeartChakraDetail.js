import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ChakraContext } from './ChakraContext';

const { width } = Dimensions.get('window');

// KALP ÇAKRASI YEŞİL RENK PALETİ
const COLORS = {
  bgDark: '#050D09',       
  surface: '#0A1710',      
  surfaceBorder: '#162C1F',
  primaryGreen: '#2ECC71', 
  glowGreen: '#1ABC9C',    
  darkGreen: '#145A32',    
  textWhite: '#F0F8F4',    
  textGray: '#8D9F94',     
  textDarkGray: '#4B6355',
};

// --- YARDIMCI BİLEŞEN ---
const ZenMetricCard = ({ label, value, unit, icon }) => (
  <View style={styles.metricCard}>
    <View style={styles.metricIconBox}>
      {icon}
    </View>
    <Text style={styles.metricValue}>
      {value} <Text style={styles.metricUnit}>{unit}</Text>
    </Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

// --- ANA BİLEŞEN ---
export default function HeartChakraDetail() {
  const navigation = useNavigation();
  const { chakras, updateChakraProgress } = useContext(ChakraContext);

  // GÜNLÜK HEDEF: Tam 5 Dakika (300 Saniye)
  const GOAL_SECONDS = 300; 

  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  // 🧠 SENIOR DOKUNUŞ: Evre ve Süreyi Tek Obje (Motor) Haline Getirdik
  const [breathState, setBreathState] = useState({ phase: 'idle', timeLeft: 0 });

  // Animasyon Değerleri
  const breathAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  // 1. İLK YÜKLEMEDE GEÇMİŞ VERİYİ ÇEK
  useEffect(() => {
    const heart = chakras.find(c => c.id === 4);
    if (heart) {
      setTotalSeconds((heart.progress / 100) * GOAL_SECONDS);
    }
  }, []); // Sadece ilk girişte çalışır

  // 2. ANA ZAMANLAYICI VE NEFES MOTORU
  useEffect(() => {
    let timer;
    if (isActive) {
      // Egzersiz ilk başladığında hemen "Nefes Al" moduna geç
      setBreathState(prev => prev.phase === 'idle' ? { phase: 'inhale', timeLeft: 4 } : prev);

      timer = setInterval(() => {
        // A) TOPLAM SÜRE VE HOME SCREEN GÜNCELLEMESİ (Sen durdurana kadar devam eder)
        setTotalSeconds(prevTotal => {
          const newTotal = prevTotal + 1;
          // %100'ü geçmesini engelliyoruz (5 dk dolduğunda %100'de kalır)
          const progress = Math.min(Math.floor((newTotal / GOAL_SECONDS) * 100), 100);
          updateChakraProgress(4, progress); // Kalp Çakrası ID: 4
          return newTotal;
        });

        // B) NEFES EVRELERİ (4-7-8) DÖNGÜSÜ
        setBreathState(prev => {
          if (prev.timeLeft > 1) {
            return { ...prev, timeLeft: prev.timeLeft - 1 };
          }
          
          // Süre 0'a ulaştığında diğer evreye geçiş yap
          if (prev.phase === 'inhale') return { phase: 'hold', timeLeft: 7 };
          if (prev.phase === 'hold') return { phase: 'exhale', timeLeft: 8 };
          if (prev.phase === 'exhale') {
            setCycles(c => c + 1); // Döngü bitti, sayacı artır
            return { phase: 'inhale', timeLeft: 4 }; // Tekrar nefes al
          }
          return { phase: 'inhale', timeLeft: 4 }; // Güvenlik kalkanı
        });

      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, updateChakraProgress]); 

  // 3. ANİMASYONLARI EVRELERE GÖRE TETİKLE
  useEffect(() => {
    if (breathState.phase === 'inhale') {
      Animated.parallel([
        Animated.timing(breathAnim, { toValue: 1.4, duration: 4000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.8, duration: 4000, useNativeDriver: true })
      ]).start();
    } else if (breathState.phase === 'exhale') {
      Animated.parallel([
        Animated.timing(breathAnim, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.2, duration: 8000, useNativeDriver: true })
      ]).start();
    } else if (breathState.phase === 'idle') {
      Animated.parallel([
        Animated.timing(breathAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.2, duration: 1000, useNativeDriver: true })
      ]).start();
    }
  }, [breathState.phase]);

  // UI İÇİN EVRE DETAYLARI
  const getPhaseDetails = () => {
    switch(breathState.phase) {
      case 'inhale': return { text: 'NEFES AL', subText: 'Burnundan derin ve yavaş', color: COLORS.glowGreen };
      case 'hold': return { text: 'TUT', subText: 'İçindeki enerjiyi hisset', color: COLORS.textWhite };
      case 'exhale': return { text: 'NEFES VER', subText: 'Ağzından tamamen boşalt', color: COLORS.primaryGreen };
      default: return { text: 'ZİHNİNİ BOŞALT', subText: 'Başlamak için butona dokun', color: COLORS.textGray };
    }
  };

  const currentPhase = getPhaseDetails();
  
  // Toplam süreyi hesapla (Dakika ve Saniye olarak gösterebiliriz ama dakika tutalım)
  const totalMinutes = Math.floor(totalSeconds / 60);

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
            <Text style={[styles.headerTitle, styles.textGlow]}>KALP ÇAKRASI</Text>
            <Text style={styles.headerTitle}>KALP ÇAKRASI</Text>
          </View>
          <View style={styles.headerGlowLine} />
        </View>
        
        {/* HERO SECTION: ORGANİK NEFES AURASI */}
        <View style={styles.heroBreathing}>
          
          <Animated.View style={[styles.breathingOrb, { transform: [{ scale: breathAnim }], opacity: opacityAnim }]} />
          <Animated.View style={[styles.breathingOrbCore, { transform: [{ scale: breathAnim }] }]} />

          <View style={styles.breathContent}>
            <Text style={[styles.phaseText, { color: currentPhase.color }]}>
              {currentPhase.text}
            </Text>
            
            <Text style={[styles.timerText, !isActive && { fontSize: 72, marginTop: -5 }]}>
              {isActive ? breathState.timeLeft : '∞'}
            </Text>
            
            <Text style={styles.phaseSubText}>
              {currentPhase.subText}
            </Text>
          </View>

        </View>

        {/* KONTROL BUTONU */}
        <View style={styles.controlCenter}>
          <TouchableOpacity 
            onPress={() => setIsActive(!isActive)} 
            activeOpacity={0.8}
            style={[styles.mainBtn, isActive ? styles.btnActive : styles.btnIdle]}
          >
            <Text style={[styles.mainBtnText, isActive && { color: COLORS.glowGreen }]}>
              {isActive ? 'EGZERSİZİ DURDUR' : 'EGZERSİZE BAŞLA'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3'LÜ METRİK KARTLARI */}
        <Text style={styles.sectionTitle}>EGZERSİZ DURUMU</Text>
        
        <View style={styles.metricsContainer}>
          
          <ZenMetricCard 
            label="TEKNİK" 
            value="4-7-8" 
            unit=""
            icon={
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4" opacity={0.8} />
              </Svg>
            }
          />
          
          <ZenMetricCard 
            label="DÖNGÜ" 
            value={cycles} 
            unit=""
            icon={
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Path d="M21.5 2v6h-6M2.13 15.57a9 9 0 103.87-11.2l-4 3" opacity={0.8} />
              </Svg>
            }
          />

          <ZenMetricCard 
            label="TOPLAM" 
            value={totalMinutes} 
            unit=" DK"
            icon={
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryGreen} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Circle cx="12" cy="12" r="10" opacity={0.8} />
                <Path d="M12 6v6l4 2" opacity={0.8} />
              </Svg>
            }
          />

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 60 },
  header: { alignItems: 'center', marginTop: 15, marginBottom: 30, position: 'relative', justifyContent: 'center', width: '100%' },
  backButton: { position: 'absolute', left: 0, width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: COLORS.surfaceBorder, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  textGlowContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600', letterSpacing: 6 },
  textGlow: { position: 'absolute', color: COLORS.primaryGreen, opacity: 0.6, textShadowColor: COLORS.primaryGreen, textShadowRadius: 15 },
  headerGlowLine: { marginTop: 12, width: 80, height: 2, backgroundColor: COLORS.primaryGreen },

  heroBreathing: { alignItems: 'center', justifyContent: 'center', height: 350, position: 'relative' },
  breathingOrb: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: COLORS.glowGreen, shadowColor: COLORS.glowGreen, shadowOpacity: 1, shadowRadius: 40, elevation: 20 },
  breathingOrbCore: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: COLORS.bgDark, borderWidth: 1.5, borderColor: COLORS.primaryGreen, opacity: 0.6 },
  breathContent: { alignItems: 'center', justifyContent: 'center', zIndex: 10, width: 200 },
  phaseText: { fontSize: 12, fontWeight: '800', letterSpacing: 5, marginBottom: 5, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  timerText: { color: COLORS.textWhite, fontSize: 86, fontWeight: '200', fontVariant: ['tabular-nums'], textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 8, includeFontPadding: false },
  phaseSubText: { color: COLORS.textGray, fontSize: 11, fontWeight: '500', marginTop: 5, letterSpacing: 1, textAlign: 'center', paddingHorizontal: 10 },

  controlCenter: { alignItems: 'center', marginVertical: 30 },
  mainBtn: { width: '85%', paddingVertical: 18, borderRadius: 100, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  btnIdle: { backgroundColor: 'rgba(46, 204, 113, 0.08)', borderColor: 'rgba(46, 204, 113, 0.3)' },
  btnActive: { backgroundColor: COLORS.surface, borderColor: COLORS.surfaceBorder },
  mainBtnText: { color: COLORS.primaryGreen, fontSize: 13, fontWeight: '800', letterSpacing: 3 },

  sectionTitle: { color: COLORS.textDarkGray, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 15, textAlign: 'center' },
  metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metricCard: { width: (width - 60) / 3, backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.surfaceBorder, paddingVertical: 20, alignItems: 'center' },
  metricIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.bgDark, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  metricValue: { color: COLORS.textWhite, fontSize: 20, fontWeight: '700', marginBottom: 4 },
  metricUnit: { color: COLORS.primaryGreen, fontSize: 11, fontWeight: '600' },
  metricLabel: { color: COLORS.textGray, fontSize: 9, fontWeight: '700', letterSpacing: 1.5 },
});