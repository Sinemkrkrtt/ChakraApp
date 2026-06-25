import React, { useState, useEffect, useContext } from 'react';
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
// Adım sayar modülü eklendi
import { Pedometer } from 'expo-sensors';
import { ChakraContext } from './ChakraContext';

const { width } = Dimensions.get('window');

const COLORS = {
  bgDark: '#111114',       
  surface: '#1A1A20',      
  surfaceBorder: '#2A2A33',
  primaryRed: '#D83B3B',   
  glowRed: '#FF6B6B',      
  darkRed: '#4A1C1C',      
  textWhite: '#FFFFFF',    
  textGray: '#8A8A93',     
  textDarkGray: '#55555C',
};

// --- YARDIMCI BİLEŞENLER ---

const MiniGauge = ({ value, labelTop, labelBottom }) => {
  const size = 60;
  const cx = size / 2;
  const cy = size / 2;
  const r = 22;
  const c = 2 * Math.PI * r;
  const arcLength = (240 / 360) * c; 
  const gapLength = c - arcLength;
  
  return (
    <View style={styles.miniGaugeContainer}>
      <Text style={styles.cardHeader}>{labelTop}</Text>
      <View style={styles.gaugeCenter}>
        <Svg width={size} height={size}>
          <Circle cx={cx} cy={cy} r={r} stroke={COLORS.darkRed} strokeWidth="4" fill="none" strokeDasharray={`${arcLength} ${gapLength}`} transform={`rotate(150 ${cx} ${cy})`} strokeLinecap="round" />
          <Circle cx={cx} cy={cy} r={r} stroke={COLORS.primaryRed} strokeWidth="4" fill="none" strokeDasharray={`${arcLength} ${gapLength}`} strokeDashoffset={arcLength * 0.3} transform={`rotate(150 ${cx} ${cy})`} strokeLinecap="round" />
        </Svg>
        <Text style={styles.gaugeValue}>{value}</Text>
      </View>
      <Text style={styles.cardFooter}>{labelBottom}</Text>
    </View>
  );
};

// Bar chart görsel olarak kalıyor ancak alttaki metin dinamik kaloriye göre güncellenecek
const MiniBarChart = ({ totalKcal }) => {
  const bars = [4, 6, 8, 5, 9, 7, 10, 8, 6, 7, 5, 8];
  return (
    <View style={styles.miniGaugeContainer}>
      <Text style={styles.cardHeader}>KCAL</Text>
      <View style={styles.barChartCenter}>
        {bars.map((h, i) => (
          <View key={i} style={[styles.bar, { height: h * 2.5 }]} />
        ))}
      </View>
      <Text style={styles.cardFooter}>{totalKcal}</Text>
    </View>
  );
};

// --- ANA BİLEŞEN ---
export default function ExactChakraUI() {
  const navigation = useNavigation();
  
  // Sensör State'leri
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const { updateChakraProgress } = useContext(ChakraContext);

  // Güncel Adım ve Hedef
  const totalSteps = pastStepCount + currentStepCount;
  const goal = 10000;
  // Progress 1'i geçmesin diye Math.min kullanıldı (svg halkasının bozulmaması için)
  const progress = Math.min(totalSteps / goal, 1);

  // Bilimsel Hesaplamalar (Ortalama bir insan için)
  // 1 Adım = ~0.762 metre | 1 Adım = ~0.04 Kalori | 100 Adım = ~1 Dakika aktif süre
  const distanceKm = (totalSteps * 0.000762).toFixed(2);
  const totalKcal = Math.round(totalSteps * 0.04);
  const activeMinutes = Math.round(totalSteps / 100);

  useEffect(() => {
    let subscription;

    const subscribeToPedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        // Bugün gece yarısından şu ana kadar olan geçmiş adımları al
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        try {
          const pastStepResult = await Pedometer.getStepCountAsync(start, end);
          if (pastStepResult) {
            setPastStepCount(pastStepResult.steps);
          }
        } catch (error) {
          console.log("Geçmiş adımlar alınamadı:", error);
        }

        // Uygulama açıkken atılan anlık adımları dinle
        subscription = Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps);
        });
      }
    };

    subscribeToPedometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const size = width * 0.8;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = 24;
  const r = (size - strokeWidth) / 2 - 25; 
  
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
            <Text style={[styles.headerTitle, styles.textGlow]}>KÖK ÇAKRA</Text>
            <Text style={styles.headerTitle}>KÖK ÇAKRA</Text>
          </View>
          <View style={styles.headerGlowLine} />
        </View>

        {/* --- HERO SECTION --- */}
        <View style={styles.hero}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#7A1919" />
                <Stop offset="50%" stopColor="#B22727" />
                <Stop offset="100%" stopColor={COLORS.primaryRed} />
              </LinearGradient>
              <LinearGradient id="glowG" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={COLORS.glowRed} stopOpacity="0.8" />
                <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </LinearGradient>
            </Defs>

            {/* Arka Plan Halkası */}
            <Circle cx={cx} cy={cy} r={r} stroke={COLORS.darkRed} strokeWidth={strokeWidth} fill="none" strokeDasharray={`${arcLength} ${gapLength}`} transform={`rotate(${startAngle} ${cx} ${cy})`} strokeLinecap="round" />

            {/* İlerleme Halkası (Gerçek Veri) */}
            <Circle cx={cx} cy={cy} r={r} stroke="url(#heroGradient)" strokeWidth={strokeWidth} fill="none" strokeDasharray={`${arcLength} ${gapLength}`} strokeDashoffset={arcLength - progressLength} transform={`rotate(${startAngle} ${cx} ${cy})`} strokeLinecap="round" />

            {/* Tik Çizgileri */}
            <G origin={`${cx}, ${cy}`}>
              {Array.from({ length: 40 }).map((_, i) => {
                const angle = startAngle + (i * (sweepAngle / 39));
                const isMajor = i % 10 === 0 || i === 39;
                return (
                  <Line key={i} x1={cx + (r + 25) * Math.cos(angle * Math.PI / 180)} y1={cy + (r + 25) * Math.sin(angle * Math.PI / 180)} x2={cx + (r + (isMajor ? 35 : 30)) * Math.cos(angle * Math.PI / 180)} y2={cy + (r + (isMajor ? 35 : 30)) * Math.sin(angle * Math.PI / 180)} stroke={isMajor ? COLORS.glowRed : COLORS.textDarkGray} strokeWidth={isMajor ? 1.5 : 1} />
                );
              })}
            </G>

            {/* Sayılar */}
            <Text style={[styles.tickLabel, { left: cx - 10, top: cy - r - 55 }]}>0</Text>
            <Text style={[styles.tickLabel, { right: cx - r - 60, top: cy - 20 }]}>2500</Text>
            <Text style={[styles.tickLabel, { left: cx - r - 60, top: cy - 20 }]}>7500</Text>
            <Text style={[styles.tickLabel, { right: cx - r - 40, bottom: cy - r - 20 }]}>10000</Text>

            {/* Hareketli Nokta */}
            <Circle cx={dotX} cy={dotY} r={5} fill={COLORS.textWhite} />
            <Circle cx={dotX} cy={dotY} r={14} fill="url(#glowG)" opacity={0.6} />
          </Svg>
          
          <View style={styles.innerRingText}>
            <Text style={styles.stepLabelTop}>ADIM</Text>
            {/* Dinamik Adım Sayısı Formatlı (Örn: 1.234) */}
            <Text style={styles.stepCount}>
              {totalSteps.toLocaleString('tr-TR')}
            </Text>
            <Text style={styles.stepLabelBottom}>TOPLAM ADIM</Text>
            <Text style={styles.stepPercentage}>
              (%{((totalSteps / goal) * 100).toFixed(1)})
            </Text>
          </View>
        </View>

        {/* --- METRİKLER (GERÇEK HESAPLAMALAR) --- */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>GÜNLÜK İLERLEME</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <MiniGauge labelTop="KM" value={distanceKm} labelBottom="MESAFE" />
            </View>
            <View style={styles.metricCard}>
              {/* Kalori grafiği görsel olarak kalır, alt metin gerçektir */}
              <MiniBarChart totalKcal={totalKcal} />
            </View>
            <View style={styles.metricCard}>
              <MiniGauge labelTop="DAKİKA" value={activeMinutes} labelBottom="AKTİF" />
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- STİLLER (Hiç Değiştirilmedi) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40, justifyContent: 'space-between' },
  header: { alignItems: 'center', marginTop: 15, marginBottom: 40 },
  backButton: { position: 'absolute', left: 0, width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: COLORS.surfaceBorder, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  textGlowContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600', letterSpacing: 6 },
  textGlow: { position: 'absolute', color: COLORS.primaryRed, opacity: 0.6, textShadowColor: COLORS.primaryRed, textShadowRadius: 15 },
  headerGlowLine: { marginTop: 12, width: 80, height: 2, backgroundColor: COLORS.primaryRed },
  hero: { alignItems: 'center', justifyContent: 'center', marginVertical: 30, height: 320 },
  tickLabel: { position: 'absolute', color: COLORS.textGray, fontSize: 9, fontWeight: '600' },
  innerRingText: { position: 'absolute', alignItems: 'center', top: '32%' },
  stepLabelTop: { color: COLORS.textGray, fontSize: 11, letterSpacing: 1, marginBottom: 4 },
  stepCount: { color: COLORS.textWhite, fontSize: 48, fontWeight: '500', fontVariant: ['tabular-nums'] },
  stepLabelBottom: { color: COLORS.textGray, fontSize: 10, letterSpacing: 1, marginTop: 4 },
  stepPercentage: { color: COLORS.textDarkGray, fontSize: 11, fontWeight: '500', marginTop: 2 },
  metricsSection: { marginBottom: 20 },
  sectionTitle: { color: COLORS.textDarkGray, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textAlign: 'center', marginBottom: 20 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metricCard: { width: (width - 60) / 3, aspectRatio: 0.85, backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.surfaceBorder, padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  miniGaugeContainer: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
  cardHeader: { color: COLORS.textWhite, fontSize: 12, fontWeight: '500' },
  cardFooter: { color: COLORS.textGray, fontSize: 10, fontWeight: '500' },
  gaugeCenter: { alignItems: 'center', justifyContent: 'center', position: 'relative', height: 60 },
  gaugeValue: { position: 'absolute', color: COLORS.textWhite, fontSize: 14, fontWeight: '600' },
  barChartCenter: { flexDirection: 'row', alignItems: 'flex-end', height: 40, gap: 2 },
  bar: { width: 3.5, backgroundColor: COLORS.darkRed, borderRadius: 2 }
});