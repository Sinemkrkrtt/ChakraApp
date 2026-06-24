import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence, 
  Easing,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const CHAKRA_DATA = [
  { id: 1, name: 'Kök Çakra', color: '#FF3B30', quest: '10 dakika boyunca çıplak ayakla toprağa bas.' },
  { id: 2, name: 'Sakral Çakra', color: '#FF9500', quest: 'Yaratıcı bir aktiviteye vakit ayır, müzik dinle veya resim çiz.' },
  { id: 3, name: 'Solar Pleksus', color: '#FFCC00', quest: 'Seni yoran bir konuya bugün net bir sınır çiz.' },
  { id: 4, name: 'Kalp Çakrası', color: '#34C759', quest: 'Uzun süredir konuşmadığın birine içten bir mesaj at.' },
  { id: 5, name: 'Boğaz Çakrası', color: '#32ADE6', quest: 'İçine attığın bir düşünceyi bugün çekinmeden ifade et.' },
  { id: 6, name: 'Üçüncü Göz', color: '#5856D6', quest: 'Uyumadan önce 10 dakika sadece zihnini dinle.' },
  { id: 7, name: 'Tepe Çakra', color: '#AF52DE', quest: 'Bugün hayatında minnettar olduğun 3 şeyi not et.' }
];

export default function DailyMission() {
  const [isReady, setIsReady] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeChakraIndex, setActiveChakraIndex] = useState(-1);
  const [sessionResult, setSessionResult] = useState(null);
  
  // Günlük Limit State'leri
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [todayQuest, setTodayQuest] = useState(null);

  const timerRef = useRef(null);
  const hapticIntervalRef = useRef(null);

  // Animasyon Değerleri
  const pulseScale = useSharedValue(1);
  const auraOpacity = useSharedValue(0.15);
  const ringRotation = useSharedValue(0);
  const backdropDim = useSharedValue(0);

  // Kart Animasyonları
  const cardTranslateY = useSharedValue(100);
  const cardScale = useSharedValue(0.85);
  const cardOpacity = useSharedValue(0);
  const hintOpacity = useSharedValue(1);

  // --- UYGULAMA AÇILIŞI VE KONTROLLER ---
  useEffect(() => {
    const checkDailyStatus = async () => {
      try {
        const savedDate = await AsyncStorage.getItem('@last_session_date');
        const savedQuest = await AsyncStorage.getItem('@last_quest');
        const today = new Date().toDateString();

        if (savedDate === today && savedQuest) {
          const parsedQuest = JSON.parse(savedQuest);
          setHasCompletedToday(true);
          setTodayQuest(parsedQuest);
          setActiveChakraIndex(CHAKRA_DATA.findIndex(c => c.name === parsedQuest.name));
        }
      } catch (error) {
        console.log("Veri okuma hatası:", error);
      }
      setIsReady(true);
    };

    checkDailyStatus();

    // Mistik animasyon döngüleri
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, true
    );

    ringRotation.value = withRepeat(
      withTiming(360, { duration: 25000, easing: Easing.linear }),
      -1, false
    );
  }, []);

  // --- ETKİLEŞİM YÖNETİMİ ---
  const handlePressIn = () => {
    if (hasCompletedToday) return; 

    setIsHolding(true);
    setSessionResult(null);
    setProgress(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    auraOpacity.value = withTiming(0.4, { duration: 500 });
    hintOpacity.value = withTiming(0, { duration: 300 });

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          handleSessionComplete();
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    hapticIntervalRef.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 1500);
  };

  const handlePressOut = () => {
    if (progress < 100 && !sessionResult) {
      clearInterval(timerRef.current);
      clearInterval(hapticIntervalRef.current);
      setIsHolding(false);
      setProgress(0);
      setActiveChakraIndex(-1);
      
      auraOpacity.value = withTiming(0.15, { duration: 500 });
      hintOpacity.value = withTiming(1, { duration: 300 });
    }
  };

  useEffect(() => {
    if (isHolding && !sessionResult) {
      const currentChakra = Math.floor((progress / 100) * CHAKRA_DATA.length);
      if (currentChakra < CHAKRA_DATA.length) {
        setActiveChakraIndex(currentChakra);
      }
    }
  }, [progress, isHolding]);

  const handleSessionComplete = () => {
    clearInterval(hapticIntervalRef.current);
    setIsHolding(false);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const randomIndex = Math.floor(Math.random() * CHAKRA_DATA.length);
    const selectedQuest = CHAKRA_DATA[randomIndex];
    
    setSessionResult(selectedQuest);
    setActiveChakraIndex(randomIndex);

    backdropDim.value = withTiming(0.7, { duration: 600 });
    auraOpacity.value = withTiming(0, { duration: 500 });

    cardOpacity.value = withTiming(1, { duration: 500 });
    cardTranslateY.value = withSpring(0, { damping: 14, stiffness: 100 });
    cardScale.value = withSpring(1, { damping: 14, stiffness: 100 });
  };

  const handleAcceptQuest = async () => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem('@last_session_date', today);
      await AsyncStorage.setItem('@last_quest', JSON.stringify(sessionResult));
      
      setTodayQuest(sessionResult);
      
      cardOpacity.value = withTiming(0, { duration: 500 });
      cardTranslateY.value = withTiming(40, { duration: 500 });
      cardScale.value = withTiming(0.95, { duration: 500 });
      backdropDim.value = withTiming(0, { duration: 600 });
      
      setTimeout(() => {
        setSessionResult(null);
        setHasCompletedToday(true); 
        auraOpacity.value = withTiming(0.2, { duration: 1000 });
        hintOpacity.value = withTiming(1, { duration: 800 });
      }, 500);

    } catch (error) {
      console.log("Kaydetme hatası:", error);
    }
  };

  // --- STİLLER ---
  const auraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: auraOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropDim.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { translateY: cardTranslateY.value },
      { scale: cardScale.value }
    ]
  }));

  const hintAnimatedStyle = useAnimatedStyle(() => ({
    opacity: hintOpacity.value,
  }));

  if (!isReady) return null; 

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={hasCompletedToday ? ['#0A0A12', '#0A0A12', '#05050A'] : ['#05050A', '#131120', '#05050A']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.header, isHolding && styles.dimmed]}>
          <Text style={styles.welcomeText}>
            {hasCompletedToday ? 'Hizalandın' : 'Zihnini Dinlendir'}
          </Text>
          <Text style={styles.subtitleText}>
            {hasCompletedToday 
              ? 'Bugünkü enerjin dengede akıyor.' 
              : 'Frekansını dengelemek için merkezlen.'}
          </Text>
        </Animated.View>

        <View style={styles.centerStage}>
          <Animated.View style={[
            styles.glowBackdrop, 
            auraStyle, 
            hasCompletedToday && { backgroundColor: todayQuest?.color || '#FFFFFF', filter: 'blur(70px)' }
          ]} />

          <View style={styles.alignmentWrapper}>
            <Animated.View style={[StyleSheet.absoluteFillObject, styles.ringContainer, ringStyle, hasCompletedToday && { opacity: 0.3 }]}>
              <Svg height="300" width="300" viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r="48" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.5" fill="none" strokeDasharray="1 6" />
                <Circle cx="50" cy="50" r="40" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.2" fill="none" />
              </Svg>
            </Animated.View>

            <View style={styles.chakraSpine}>
              {CHAKRA_DATA.map((chakra, index) => {
                const isActive = index === activeChakraIndex;
                return (
                  <View key={chakra.id} style={styles.chakraContainer}>
                    <Animated.View 
                      style={[
                        styles.chakraDot, 
                        { backgroundColor: isActive ? chakra.color : 'rgba(255,255,255,0.06)' },
                        isActive && {
                          shadowColor: chakra.color,
                          shadowRadius: 15,
                          shadowOpacity: 1,
                          elevation: 15,
                          transform: [{ scale: hasCompletedToday ? 1.5 : 1.3 }]
                        }
                      ]} 
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          {sessionResult ? (
            <Animated.View style={[styles.resultContainer, cardAnimatedStyle]}>
              <BlurView intensity={80} tint="dark" style={styles.glassCard}>
                <View style={[styles.resultGlowBackdrop, { backgroundColor: sessionResult.color }]} />
                
                <Text style={styles.resultTitle}>Enerjin Dengelendi</Text>
                
                <View style={styles.badgeWrapper}>
                  <View style={[styles.dot, { backgroundColor: sessionResult.color }]} />
                  <Text style={[styles.chakraBadge, { color: sessionResult.color }]}>
                    {sessionResult.name}
                  </Text>
                </View>
                
                <Text style={styles.questText}>{sessionResult.quest}</Text>
                
                <Pressable style={styles.acceptButton} onPress={handleAcceptQuest}>
                  <Text style={styles.acceptButtonText}>Görevi Kabul Et</Text>
                </Pressable>
              </BlurView>
            </Animated.View>
          ) : hasCompletedToday ? (
            <Animated.View style={[styles.actionContainer, hintAnimatedStyle]}>
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>GÖREV ALINDI</Text>
              </View>
              <Text style={styles.zenText}>Yarın tekrar görüşmek üzere.</Text>
            </Animated.View>
          ) : (
            <View style={styles.actionContainer}>
              <Animated.Text style={[styles.progressHint, hintAnimatedStyle]}>
                Başlamak için çembere dokun
              </Animated.Text>
              
              <Pressable 
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.touchArea}
              >
                {({ pressed }) => (
                  <View style={[styles.fingerprintRing, pressed && styles.fingerprintRingPressed]}>
                    <View style={styles.innerCore} />
                  </View>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>

      <Animated.View style={[styles.backdropPerde, backdropAnimatedStyle]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05050A' },
  safeArea: { flex: 1, alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
  header: { marginTop: height * 0.05, alignItems: 'center' },
  dimmed: { opacity: 0.05 },
  welcomeText: { color: '#FFFFFF', fontSize: 24, fontWeight: '400', letterSpacing: 2 },
  subtitleText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8, letterSpacing: 0.5, fontWeight: '300' },
  centerStage: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  glowBackdrop: { position: 'absolute', width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, backgroundColor: 'rgba(88, 86, 214, 0.3)', filter: 'blur(60px)', shadowColor: '#5856D6', shadowOffset: { width: 0, height: 0 }, shadowRadius: 60, shadowOpacity: 0.5 },
  alignmentWrapper: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center' },
  ringContainer: { justifyContent: 'center', alignItems: 'center' },
  chakraSpine: { height: 200, justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  chakraContainer: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  chakraDot: { width: 8, height: 8, borderRadius: 4 },
  bottomSection: { width: '100%', minHeight: 220, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: height * 0.05, zIndex: 100 },
  resultContainer: { width: width * 0.88, borderRadius: 32, overflow: 'hidden', position: 'absolute', bottom: height * 0.05, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  glassCard: { padding: 32, alignItems: 'center', backgroundColor: 'rgba(15, 15, 20, 0.55)' },
  resultGlowBackdrop: { position: 'absolute', top: -50, width: 200, height: 200, opacity: 0.06, borderRadius: 100, filter: 'blur(30px)' },
  resultTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', letterSpacing: 1, marginBottom: 16 },
  badgeWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 10 },
  chakraBadge: { fontSize: 13, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' },
  questText: { color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 26, textAlign: 'center', fontWeight: '300', marginBottom: 32 },
  acceptButton: { paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, backgroundColor: '#FFFFFF' },
  acceptButtonText: { color: '#000000', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  actionContainer: { alignItems: 'center', justifyContent: 'center', height: 140 },
  progressHint: { color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: 1.5, marginBottom: 24, textTransform: 'uppercase' },
  touchArea: { padding: 10 },
  fingerprintRing: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)' },
  fingerprintRingPressed: { transform: [{ scale: 0.85 }], borderColor: 'rgba(255, 255, 255, 0.4)', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  innerCore: { width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.3)' },
  backdropPerde: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000000', zIndex: 5 },
  completedBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 12 },
  completedText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  zenText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '300', letterSpacing: 0.5 }
});