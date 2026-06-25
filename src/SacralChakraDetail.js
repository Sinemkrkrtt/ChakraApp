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
import Svg, { Circle, G, Line, Defs, LinearGradient, Stop, Path, ClipPath } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ChakraContext } from './ChakraContext';

const { width } = Dimensions.get('window');

// SAKRAL ÇAKRA TURUNCU RENK PALETİ
const COLORS = {
  bgDark: '#0D0D11',       
  surface: '#16161B',      
  surfaceBorder: '#272730',
  primaryOrange: '#E67E22', 
  glowOrange: '#F39C12',    
  darkOrange: '#4A2A14',    
  textWhite: '#F4F4F5',    
  textGray: '#8A8A93',     
  textDarkGray: '#55555C',
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
      case 'target':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryOrange} strokeWidth="2">
            <Circle cx="12" cy="12" r="8" strokeOpacity="0.5" />
            <Circle cx="12" cy="12" r="3" fill={COLORS.glowOrange} stroke="none" />
          </Svg>
        );
      case 'drop':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryOrange} strokeWidth="2">
            <Path d="M12 3l5 5a7 7 0 11-10 0z" fill={COLORS.primaryOrange} fillOpacity={0.3} />
          </Svg>
        );
      case 'remaining':
        return (
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.textGray} strokeWidth="2" strokeDasharray="3 3">
            <Circle cx="12" cy="12" r="8" />
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
          <Circle cx={cx} cy={cx} r={r} stroke={COLORS.darkOrange} strokeWidth="3" fill="none" strokeDasharray={`${arcLength} ${gapLength}`} transform={`rotate(150 ${cx} ${cx})`} strokeLinecap="round" />
          <Circle cx={cx} cy={cx} r={r} stroke={type === 'remaining' ? COLORS.textGray : COLORS.glowOrange} strokeWidth="3" fill="none" strokeDasharray={`${arcLength} ${gapLength}`} strokeDashoffset={arcLength - (arcLength * progress)} transform={`rotate(150 ${cx} ${cx})`} strokeLinecap="round" />
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
export default function SacralChakraDetail() {
  const navigation = useNavigation();
  
  // GLOBAL BAĞLANTI (Ana ekranla senkronizasyon için)
  const { chakras, updateChakraProgress } = useContext(ChakraContext);
  const goal = 2000; 

  // Başlangıç değerini statik "1250" yerine Global Hafızadan (Context) çekiyoruz.
  // Böylece sayfadan çıkıp tekrar girersen içtiğin sular kaybolmaz.
  const [currentWater, setCurrentWater] = useState(() => {
    const sacral = chakras.find(c => c.id === 2);
    return sacral ? (sacral.progress / 100) * goal : 0;
  });

  const progress = Math.min(currentWater / goal, 1);

  const addWater = (amount) => {
    setCurrentWater(prev => {
      const newWater = Math.min(prev + amount, goal + 1000); // 3000ml'ye kadar aşmaya izin ver
      
      // Global Sakral Çakra (ID: 2) yüzdesini maksimum %100 olacak şekilde anında güncelle
      const newProgress = Math.min(Math.floor((newWater / goal) * 100), 100);
      updateChakraProgress(2, newProgress); 
      
      return newWater;
    });
  };

  // İçi Dolan Küre (Liquid Fill) Hesaplamaları
  const size = width * 0.85;
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) - 35; // Kürenin yarıçapı
  
  // Su seviyesini Y ekseninde hesaplama (Alttan üste doğru)
  const waterLevelY = cy + radius - (2 * radius * progress);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* HEADER (Çıkış Oku) */}
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
            <Text style={[styles.headerTitle, styles.textGlow]}>SAKRAL ÇAKRA</Text>
            <Text style={styles.headerTitle}>SAKRAL ÇAKRA</Text>
          </View>
          <View style={styles.headerGlowLine} />
        </View>

        {/* --- HERO SECTION: İÇİ DOLAN SU KÜRESİ --- */}
        <View style={styles.hero}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="waterFlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={COLORS.glowOrange} stopOpacity="0.9" />
                <Stop offset="100%" stopColor={COLORS.primaryOrange} stopOpacity="1" />
              </LinearGradient>
              <LinearGradient id="waterFlowBack" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={COLORS.primaryOrange} stopOpacity="0.5" />
                <Stop offset="100%" stopColor={COLORS.darkOrange} stopOpacity="0.8" />
              </LinearGradient>
              
              {/* Küreyi Maskelemek İçin ClipPath */}
              <ClipPath id="circleMask">
                <Circle cx={cx} cy={cy} r={radius} />
              </ClipPath>
            </Defs>

            {/* Dış Bilimkurgu / Teknik Çizgiler */}
            <Circle cx={cx} cy={cy} r={radius + 15} stroke={COLORS.surfaceBorder} strokeWidth="1" strokeDasharray="4 8" fill="none" />
            <Circle cx={cx} cy={cy} r={radius + 25} stroke={COLORS.surfaceBorder} strokeWidth="1" opacity="0.5" fill="none" />

            {/* Arka Plan Boş Küre */}
            <Circle cx={cx} cy={cy} r={radius} fill="#110E0C" />

            {/* Su Dolum Efekti (Maskeli) */}
            <G clipPath="url(#circleMask)">
              {/* Arka Dalga (Derinlik Hissi) */}
              <Path 
                d={`M 0 ${waterLevelY} Q ${size/4} ${waterLevelY - 20} ${size/2} ${waterLevelY} T ${size} ${waterLevelY} L ${size} ${size} L 0 ${size} Z`} 
                fill="url(#waterFlowBack)" 
              />
              {/* Ön Dalga */}
              <Path 
                d={`M 0 ${waterLevelY} Q ${size/4} ${waterLevelY + 15} ${size/2} ${waterLevelY} T ${size} ${waterLevelY} L ${size} ${size} L 0 ${size} Z`} 
                fill="url(#waterFlow)" 
              />
            </G>

            {/* Kürenin Cam Hissi Veren Çerçevesi */}
            <Circle cx={cx} cy={cy} r={radius} stroke={COLORS.darkOrange} strokeWidth="4" fill="none" />
            <Circle cx={cx} cy={cy} r={radius} stroke={COLORS.glowOrange} strokeWidth="2" fill="none" opacity="0.3" />
          </Svg>
          
          {/* Merkez Tipografi (Sıvı üstünde okunması için güçlü gölgeler eklendi) */}
          <View style={styles.innerRingText}>
            <Text style={styles.stepLabelTop}>HACİM</Text>
            <Text style={styles.stepCount}>{(currentWater / 1000).toFixed(2)}</Text>
            <Text style={styles.stepLabelBottom}>TOPLAM LİTRE</Text>
            <Text style={styles.stepPercentage}>{(progress * 100).toFixed(1)}%</Text>
          </View>
        </View>

        {/* --- 2. BÖLÜM: ZARİF SIVI EKLEME PANELİ (Dalga + Yanyana İkonlar) --- */}
        <Text style={styles.sectionTitle}>SIVI EKLEME KONTROLLERİ</Text>
        <View style={styles.playerCard}>
          <Text style={styles.playerSubTitle}>SU TAKİP EKRANI</Text>
          <Text style={styles.playTitle}>Hidrasyonunu Artır</Text>
          
          {/* Arka Plan Kök Çakra Dalga Efekti */}
          <View style={styles.waveContainer}>
            <Svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
              {Array.from({length: 60}).map((_, i) => (
                <Line key={`b-${i}`} x1={i * 5} y1={30 - (Math.sin(i * 0.2) * 15)} x2={i * 5} y2={30 + (Math.sin(i * 0.2) * 15)} stroke={COLORS.textDarkGray} strokeWidth="1" opacity={0.2} />
              ))}
              <Path d="M 0 30 Q 50 10, 150 30 T 300 30" fill="none" stroke={COLORS.primaryOrange} strokeWidth="1.5" opacity="0.5" />
              <Path d="M 0 30 Q 70 50, 150 30 T 300 30" fill="none" stroke={COLORS.glowOrange} strokeWidth="2" opacity="0.8" />
              <Circle cx="90" cy="25" r="1.5" fill="#FFF" opacity="0.8"/>
              <Circle cx="210" cy="35" r="2" fill={COLORS.glowOrange} opacity="0.9"/>
            </Svg>
          </View>

          {/* İkonlu Estetik Butonlar (Yan Yana Düzgün Hizalı) */}
          <View style={styles.playerControls}>
            
            {/* Sol: Küçük Bardak (200ml) */}
            <TouchableOpacity onPress={() => addWater(200)} activeOpacity={0.6} style={styles.iconBtnSide}>
              <View style={styles.iconCircle}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.textGray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <Path d="M6 2l1.5 18a2 2 0 002 1.999h5a2 2 0 002-1.999L18 2z"/>
                </Svg>
              </View>
              <Text style={styles.iconBtnLabel}>200 ml</Text>
            </TouchableOpacity>
            
            {/* Orta: Şişe (500ml) */}
            <TouchableOpacity onPress={() => addWater(500)} style={styles.iconBtnMain} activeOpacity={0.8}>
              <View style={styles.playBtnInner}>
                <Svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={COLORS.bgDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <Path d="M10 2h4v4l3 4v10a2 2 0 01-2 2H9a2 2 0 01-2-2V10l3-4V2z"/>
                   <Path d="M8 6h8" strokeOpacity={0.5}/>
                </Svg>
              </View>
              <Text style={styles.iconBtnMainLabel}>500 ml</Text>
            </TouchableOpacity>

            {/* Sağ: Kupa (300ml) */}
            <TouchableOpacity onPress={() => addWater(300)} activeOpacity={0.6} style={styles.iconBtnSide}>
              <View style={styles.iconCircle}>
                <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.textGray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <Path d="M4 4h12v11a4 4 0 01-4 4H8a4 4 0 01-4-4V4z"/>
                   <Path d="M16 8h2a3 3 0 013 3v2a3 3 0 01-3 3h-2"/>
                </Svg>
              </View>
              <Text style={styles.iconBtnLabel}>300 ml</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* --- 3. BÖLÜM: GÜNLÜK DURUM (Halkalı Detaylı İkonlar) --- */}
        <Text style={styles.sectionTitle}>GÜNLÜK DURUM ÖZETİ</Text>
        <View style={styles.metricsRow}>
          <RingMetricCard label="HEDEF" value="2.0" subLabel="LİTRE" progress={1} type="target" />
          <RingMetricCard label="İÇİLEN" value={(currentWater / 1000).toFixed(1)} subLabel="LİTRE" progress={progress} type="drop" />
          <RingMetricCard label="KALAN" value={Math.max(0, (goal - currentWater) / 1000).toFixed(1)} subLabel="LİTRE" progress={1 - progress} type="remaining" />
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
  backButton: { position: 'absolute', left: 0, width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: COLORS.surfaceBorder, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  textGlowContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600', letterSpacing: 6 },
  textGlow: { position: 'absolute', color: COLORS.primaryOrange, opacity: 0.6, textShadowColor: COLORS.primaryOrange, textShadowRadius: 15 },
  headerGlowLine: { marginTop: 12, width: 80, height: 2, backgroundColor: COLORS.primaryOrange },
  hero: { alignItems: 'center', justifyContent: 'center', marginVertical: 10, height: 330 },
  innerRingText: { position: 'absolute', alignItems: 'center', top: '32%' },
  stepLabelTop: { color: COLORS.textWhite, fontSize: 11, letterSpacing: 2, marginBottom: 4, fontWeight: '600', textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 4 },
  stepCount: { color: COLORS.textWhite, fontSize: 56, fontWeight: '700', fontVariant: ['tabular-nums'], textShadowColor: 'rgba(0, 0, 0, 0.9)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 10 },
  stepLabelBottom: { color: COLORS.textWhite, fontSize: 10, letterSpacing: 1.5, marginTop: 4, fontWeight: '700', textShadowColor: 'rgba(0, 0, 0, 0.8)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 4 },
  stepPercentage: { color: COLORS.glowOrange, fontSize: 14, fontWeight: '800', marginTop: 6, textShadowColor: 'rgba(0, 0, 0, 0.9)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 4 },
  sectionTitle: { color: COLORS.textDarkGray, fontSize: 10, fontWeight: '800', letterSpacing: 2, textAlign: 'center', marginBottom: 12, marginTop: 15 },
  playerCard: { backgroundColor: COLORS.surface, paddingTop: 18, paddingBottom: 20, paddingHorizontal: 20, borderRadius: 24, borderWidth: 1, borderColor: COLORS.surfaceBorder, alignItems: 'center', marginBottom: 20 },
  playerSubTitle: { color: COLORS.textGray, fontSize: 9, letterSpacing: 1.5, marginBottom: 6, fontWeight: '600' },
  playTitle: { color: COLORS.textWhite, fontSize: 16, fontWeight: '600', marginBottom: 15 },
  waveContainer: { width: '100%', height: 60, marginBottom: 20 },
  playerControls: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '90%' },
  iconBtnSide: { alignItems: 'center', width: 60 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.bgDark, borderWidth: 1, borderColor: COLORS.surfaceBorder, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  iconBtnLabel: { color: COLORS.textGray, fontSize: 10, fontWeight: '600' },
  iconBtnMain: { alignItems: 'center', justifyContent: 'center', width: 80 },
  playBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.glowOrange, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primaryOrange, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8, marginBottom: 8 },
  iconBtnMainLabel: { color: COLORS.glowOrange, fontSize: 11, fontWeight: '800' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  metricCard: { width: (width - 55) / 3, aspectRatio: 0.85, backgroundColor: COLORS.surface, borderRadius: 18, borderWidth: 1, borderColor: COLORS.surfaceBorder, padding: 10, alignItems: 'center' },
  cardHeader: { color: COLORS.textWhite, fontSize: 10, fontWeight: '700', letterSpacing: 1, opacity: 0.9 },
  gaugeCenter: { height: 56, width: 56, justifyContent: 'center', alignItems: 'center', marginVertical: 10, position: 'relative' },
  gaugeIconWrapper: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  metricValue: { color: COLORS.textWhite, fontSize: 15, fontWeight: '800', marginBottom: 2 },
  cardFooter: { color: COLORS.textGray, fontSize: 9, fontWeight: '600', letterSpacing: 1.5 }
});