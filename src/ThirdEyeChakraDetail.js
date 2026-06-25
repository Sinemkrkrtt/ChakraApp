import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import Svg, { Path, Circle, Line, Polygon } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ChakraContext } from './ChakraContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WAVE_CONTAINER_WIDTH = SCREEN_WIDTH - 40; 

// ÜÇÜNCÜ GÖZ ÇAKRASI (Ajna)
const COLORS = {
  bgDark: '#05000A',       
  surface: '#0B0014',      
  surfaceBorder: 'rgba(114, 2, 194, 0.2)', 
  primaryPurple: '#7202C2', 
  glowPurple: '#9D4EDD',    
  lightPurple: '#E0AAFF',   
  textWhite: '#F0E6FF',    
  textGray: '#8A73A6',     
  textDarkGray: '#3A205E', 
};

// Hedef: 10 Dakika = 600 Saniye
const MEDITATION_TIME = 600; 

export default function ThirdEyeChakraDetail() {
  const navigation = useNavigation();
  const { chakras, updateChakraProgress } = useContext(ChakraContext);

  // Başlangıç süresini Context'ten al
  const [timeLeft, setTimeLeft] = useState(() => {
    const thirdEye = chakras.find(c => c.id === 6);
    if (thirdEye) {
      const remainingSeconds = MEDITATION_TIME - (MEDITATION_TIME * (thirdEye.progress / 100));
      return Math.round(remainingSeconds);
    }
    return MEDITATION_TIME;
  });

  const [isActive, setIsActive] = useState(false);

  // 🧠 SENIOR DOKUNUŞ: React uyarılarını önlemek için süreyi referansta da tutuyoruz
  const timeRef = useRef(timeLeft);
  useEffect(() => {
    timeRef.current = timeLeft;
  }, [timeLeft]);

  // Dalga Animasyonu için Referans
  const waveScroll = useRef(new Animated.Value(0)).current;

  // Dalga Hareketi
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.timing(waveScroll, {
          toValue: 1,
          duration: 3500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      waveScroll.stopAnimation();
      waveScroll.setValue(0);
    }
  }, [isActive, waveScroll]);

  const waveTranslate = waveScroll.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -WAVE_CONTAINER_WIDTH]
  });

  // 🎯 DÜZELTİLEN ZAMANLAYICI MANTIĞI
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        // En güncel süreyi state'den değil, ref üzerinden okuyoruz
        if (timeRef.current > 0) {
          const newTime = timeRef.current - 1;
          
          // 1. Kendi görselimizi güncelliyoruz
          setTimeLeft(newTime);
          
          // 2. State Updater (prev=>{}) İÇİNDE DEĞİL, dışarıda Global'i güncelliyoruz (HATA BURADA ÇÖZÜLDÜ)
          const timeSpent = MEDITATION_TIME - newTime;
          const progress = Math.min(Math.floor((timeSpent / MEDITATION_TIME) * 100), 100);
          updateChakraProgress(6, progress); 
          
          // Süre dolduysa otomatik durdur
          if (newTime === 0) {
            setIsActive(false);
            clearInterval(interval);
          }
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive]); // Bağımlılıklar temizlendi, sadece isActive dinleniyor

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePlayPause = () => {
    if (timeLeft === 0) {
      setTimeLeft(MEDITATION_TIME);
      updateChakraProgress(6, 0); 
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.textGray} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </TouchableOpacity>

        <View style={styles.textGlowContainer}>
          <Text style={[styles.headerTitle, styles.textGlow]}>ÜÇÜNCÜ GÖZ ÇAKRASI</Text>
          <Text style={styles.headerTitle}>ÜÇÜNCÜ GÖZ ÇAKRASI</Text>
        </View>
        <View style={styles.headerGlowLine} />
      </View>

      <View style={styles.fullScreenPlayer}>
        <View style={styles.playerTopSection}>
          <Text style={styles.playerSubTitle}>FREKANS OYNATICI</Text>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>
            {isActive ? 'ZİHNİNİ SUSTUR...' : (timeLeft === MEDITATION_TIME ? 'ODAKLANMAYA HAZIR OL' : (timeLeft === 0 ? 'FARKINDALIĞA ULAŞTIN' : 'DURAKLATILDI'))}
          </Text>
        </View>

        <View style={styles.playerMiddleSection}>
          <View style={styles.waveContainer}>
            <Animated.View style={[styles.animatedWaveWrapper, { transform: [{ translateX: waveTranslate }] }]}>
              <Svg width="100%" height="100%" viewBox="0 0 600 60" preserveAspectRatio="none">
                {Array.from({length: 160}).map((_, i) => (
                  <Line key={`b-${i}`} x1={i * (600 / 160)} y1={30 - (Math.sin(i * 0.15) * Math.sin(i * 0.05) * 20)} x2={i * (600 / 160)} y2={30 + (Math.sin(i * 0.15) * Math.sin(i * 0.05) * 20)} stroke={COLORS.textDarkGray} strokeWidth="1" opacity={0.3} />
                ))}
                <Path d="M 0 30 Q 37.5 15, 75 30 T 150 30 T 225 30 T 300 30 T 375 30 T 450 30 T 525 30 T 600 30" fill="none" stroke={COLORS.primaryPurple} strokeWidth="1.5" opacity="0.6" />
                <Path d="M 0 30 Q 50 45, 100 30 T 200 30 T 300 30 T 400 30 T 500 30 T 600 30" fill="none" stroke={COLORS.glowPurple} strokeWidth="2" opacity="0.8" />
                <Path d="M 0 30 Q 75 10, 150 30 T 300 30 T 450 30 T 600 30" fill="none" stroke={COLORS.lightPurple} strokeWidth="1" opacity="0.9" />
                <Circle cx="80" cy="20" r="1.5" fill="#FFF" opacity="0.8"/><Circle cx="160" cy="40" r="1" fill="#FFF" opacity="0.5"/><Circle cx="220" cy="15" r="2" fill={COLORS.glowPurple} opacity="0.7"/><Circle cx="380" cy="20" r="1.5" fill="#FFF" opacity="0.8"/><Circle cx="460" cy="40" r="1" fill="#FFF" opacity="0.5"/><Circle cx="520" cy="15" r="2" fill={COLORS.glowPurple} opacity="0.7"/>
              </Svg>
            </Animated.View>
          </View>
        </View>

        <View style={styles.playerBottomSection}>
          <Text style={styles.playTitle}>852 Hz Sezgi Uyanışı</Text>
          <Text style={styles.instructionText}>Gözlerini kapat, iki kaşının arasına odaklan ve içsel bilgeliğine bağlan.</Text>
          <View style={styles.playerControls}>
            <TouchableOpacity activeOpacity={0.6}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill={COLORS.textWhite}><Polygon points="19 20 9 12 19 4 19 20" /><Line x1="5" y1="19" x2="5" y2="5" stroke={COLORS.textWhite} strokeWidth="3" strokeLinecap="round" /></Svg>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.musicPlayBtn, isActive && styles.musicPlayBtnActive]} activeOpacity={0.8} onPress={handlePlayPause}>
              <View style={styles.musicPlayBtnInner}>
                {isActive ? (
                  <Svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.textWhite}><Path d="M6 4h4v16H6zm8 0h4v16h-4z" /></Svg>
                ) : (
                  <Svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.textWhite} style={{ marginLeft: 4 }}><Polygon points="5 3 19 12 5 21 5 3" /></Svg>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill={COLORS.textWhite}><Polygon points="5 4 15 12 5 20 5 4" /><Line x1="19" y1="5" x2="19" y2="19" stroke={COLORS.textWhite} strokeWidth="3" strokeLinecap="round" /></Svg>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, position: 'relative', width: '100%', paddingHorizontal: 20 },
  backButton: { position: 'absolute', left: 20, width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: COLORS.surfaceBorder, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  textGlowContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.textWhite, fontSize: 13, fontWeight: '700', letterSpacing: 8, opacity: 0.9 },
  textGlow: { position: 'absolute', color: COLORS.primaryPurple, opacity: 0.5, textShadowColor: COLORS.primaryPurple, textShadowRadius: 15 },
  headerGlowLine: { position: 'absolute', bottom: -12, width: 60, height: 2, backgroundColor: COLORS.primaryPurple, shadowColor: COLORS.primaryPurple, shadowOpacity: 0.8, shadowRadius: 10 },
  fullScreenPlayer: { flex: 1, paddingTop: 30, paddingBottom: 40, paddingHorizontal: 20 },
  playerTopSection: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  playerSubTitle: { color: COLORS.primaryPurple, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 15 },
  timerText: { color: COLORS.textWhite, fontSize: 72, fontWeight: '300', fontVariant: ['tabular-nums'], letterSpacing: -2 },
  timerLabel: { color: COLORS.textGray, fontSize: 11, fontWeight: '600', letterSpacing: 4, marginTop: 5 },
  playerMiddleSection: { flex: 1.2, justifyContent: 'center', alignItems: 'center', width: '100%' },
  waveContainer: { width: '100%', height: 120, overflow: 'hidden' },
  animatedWaveWrapper: { width: WAVE_CONTAINER_WIDTH * 2, height: '100%', flexDirection: 'row' },
  playerBottomSection: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', width: '100%' },
  playTitle: { color: COLORS.textWhite, fontSize: 18, fontWeight: '700', marginBottom: 12, letterSpacing: 0.5 },
  instructionText: { color: COLORS.textGray, fontSize: 12, fontWeight: '400', textAlign: 'center', paddingHorizontal: 30, lineHeight: 20, opacity: 0.8, marginBottom: 35 },
  playerControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50, width: '100%' },
  musicPlayBtn: { width: 76, height: 76, borderRadius: 38, backgroundColor: 'rgba(114, 2, 194, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.primaryPurple, shadowColor: COLORS.primaryPurple, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  musicPlayBtnActive: { backgroundColor: 'rgba(114, 2, 194, 0.3)', shadowOpacity: 0.6, shadowRadius: 15 },
  musicPlayBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryPurple, justifyContent: 'center', alignItems: 'center' },
});