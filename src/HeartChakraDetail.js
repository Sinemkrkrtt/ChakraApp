import React, { useState, useEffect, useRef } from 'react';
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

const { width } = Dimensions.get('window');

// KALP ÇAKRASI YEŞİL RENK PALETİ (Huzur, Şifa ve Zen)
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

// --- YARDIMCI BİLEŞEN: Senior Seviye 3'lü Metrik Kartı ---
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
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('idle'); 
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);

  // Animasyon Değerleri
  const breathAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  // 4-7-8 Nefes Döngüsü Mantığı
  useEffect(() => {
    let timer;
    if (isActive) {
      if (timeLeft > 0) {
        timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      } else {
        if (phase === 'idle' || phase === 'exhale') {
          if (phase === 'exhale') setCycles(c => c + 1); 
          setPhase('inhale');
          setTimeLeft(4);
        } else if (phase === 'inhale') {
          setPhase('hold');
          setTimeLeft(7);
        } else if (phase === 'hold') {
          setPhase('exhale');
          setTimeLeft(8);
        }
      }
    } else {
      setPhase('idle');
      setTimeLeft(0);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, phase]);

  // Nefes Animasyonları (Yumuşatılmış Easing ve Optimize Edilmiş Scale ile)
  useEffect(() => {
    if (phase === 'inhale') {
      // Çember büyüdüğü için scale oranını 1.4'te tuttuk ki ekrandan taşmasın
      Animated.parallel([
        Animated.timing(breathAnim, { toValue: 1.4, duration: 4000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.8, duration: 4000, useNativeDriver: true })
      ]).start();
    } else if (phase === 'exhale') {
      Animated.parallel([
        Animated.timing(breathAnim, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.2, duration: 8000, useNativeDriver: true })
      ]).start();
    } else if (phase === 'idle') {
      Animated.parallel([
        Animated.timing(breathAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.2, duration: 1000, useNativeDriver: true })
      ]).start();
    }
  }, [phase]);

  // Duruma Göre Metin ve Renk Belirleme
  const getPhaseDetails = () => {
    switch(phase) {
      case 'inhale': return { text: 'NEFES AL', subText: 'Burnundan derin ve yavaş', color: COLORS.glowGreen };
      case 'hold': return { text: 'TUT', subText: 'İçindeki enerjiyi hisset', color: COLORS.textWhite };
      case 'exhale': return { text: 'NEFES VER', subText: 'Ağzından tamamen boşalt', color: COLORS.primaryGreen };
      default: return { text: 'ZİHNİNİ BOŞALT', subText: 'Başlamak için butona dokun', color: COLORS.textGray };
    }
  };

  const currentPhase = getPhaseDetails();
  
  // Toplam süreyi dakika olarak hesapla
  const totalMinutes = Math.floor((cycles * 19) / 60);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
         <View style={styles.header}>
                                 <View style={styles.textGlowContainer}>
                                   <Text style={[styles.headerTitle, styles.textGlow]}>SAKRAL ÇAKRA</Text>
                                   <Text style={styles.headerTitle}>SAKRAL ÇAKRA</Text>
                                 </View>
                                 <View style={styles.headerGlowLine} />
                               </View>
        

        {/* --- HERO SECTION: ORGANİK NEFES AURASI --- */}
        <View style={styles.heroBreathing}>
          
          <Animated.View style={[styles.breathingOrb, { transform: [{ scale: breathAnim }], opacity: opacityAnim }]} />
          <Animated.View style={[styles.breathingOrbCore, { transform: [{ scale: breathAnim }] }]} />

          {/* İçerik: Egzersiz Komutları */}
          <View style={styles.breathContent}>
            <Text style={[styles.phaseText, { color: currentPhase.color }]}>
              {currentPhase.text}
            </Text>
            
            <Text style={[styles.timerText, !isActive && { fontSize: 72, marginTop: -5 }]}>
              {isActive ? timeLeft : '∞'}
            </Text>
            
            <Text style={styles.phaseSubText}>
              {currentPhase.subText}
            </Text>
          </View>

        </View>

        {/* --- KONTROL BUTONU --- */}
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

        {/* --- 3'LÜ METRİK KARTLARI --- */}
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

// --- STİLLER ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 60 },
   header: { alignItems: 'center', marginTop: 15, marginBottom: 30 },
  textGlowContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600', letterSpacing: 6 },
  textGlow: { position: 'absolute', color: COLORS.primaryGreen, opacity: 0.6, textShadowColor: COLORS.primaryGreen, textShadowRadius: 15 },
  headerGlowLine: { marginTop: 12, width: 80, height: 2, backgroundColor: COLORS.primaryGreen },

  // ORGANİK NEFES AURASI (Ferahlatılmış Boyutlar)
  heroBreathing: { alignItems: 'center', justifyContent: 'center', height: 350, position: 'relative' },
  
  breathingOrb: {
    position: 'absolute',
    width: 260, // Ferah dış aura
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.glowGreen,
    shadowColor: COLORS.glowGreen,
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  breathingOrbCore: {
    position: 'absolute',
    width: 240, // Ferah iç çerçeve
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.bgDark, 
    borderWidth: 1.5,
    borderColor: COLORS.primaryGreen,
    opacity: 0.6,
  },

  breathContent: { alignItems: 'center', justifyContent: 'center', zIndex: 10, width: 200 },
  phaseText: { fontSize: 12, fontWeight: '800', letterSpacing: 5, marginBottom: 5, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 },
  timerText: { color: COLORS.textWhite, fontSize: 86, fontWeight: '200', fontVariant: ['tabular-nums'], textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 8, includeFontPadding: false },
  phaseSubText: { color: COLORS.textGray, fontSize: 11, fontWeight: '500', marginTop: 5, letterSpacing: 1, textAlign: 'center', paddingHorizontal: 10 },

  // KONTROL BUTONU
  controlCenter: { alignItems: 'center', marginVertical: 30 },
  mainBtn: { width: '85%', paddingVertical: 18, borderRadius: 100, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  btnIdle: { backgroundColor: 'rgba(46, 204, 113, 0.08)', borderColor: 'rgba(46, 204, 113, 0.3)' },
  btnActive: { backgroundColor: COLORS.surface, borderColor: COLORS.surfaceBorder },
  mainBtnText: { color: COLORS.primaryGreen, fontSize: 13, fontWeight: '800', letterSpacing: 3 },

  sectionTitle: { color: COLORS.textDarkGray, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 15, textAlign: 'center' },

  // METRİK KARTLARI
  metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metricCard: { width: (width - 60) / 3, backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.surfaceBorder, paddingVertical: 20, alignItems: 'center' },
  metricIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.bgDark, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  metricValue: { color: COLORS.textWhite, fontSize: 20, fontWeight: '700', marginBottom: 4 },
  metricUnit: { color: COLORS.primaryGreen, fontSize: 11, fontWeight: '600' },
  metricLabel: { color: COLORS.textGray, fontSize: 9, fontWeight: '700', letterSpacing: 1.5 },
});