import React from 'react';
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
import Svg, { Circle, G, Line, Defs, LinearGradient, Stop, Path, Polygon } from 'react-native-svg';

const { width } = Dimensions.get('window');

// GÖRSELDEKİ TAM RENK PALETİ
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
          <Circle
            cx={cx} cy={cy} r={r}
            stroke={COLORS.darkRed} strokeWidth="4" fill="none"
            strokeDasharray={`${arcLength} ${gapLength}`}
            transform={`rotate(150 ${cx} ${cy})`}
            strokeLinecap="round"
          />
          <Circle
            cx={cx} cy={cy} r={r}
            stroke={COLORS.primaryRed} strokeWidth="4" fill="none"
            strokeDasharray={`${arcLength} ${gapLength}`}
            strokeDashoffset={arcLength * 0.3} 
            transform={`rotate(150 ${cx} ${cy})`}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.gaugeValue}>{value}</Text>
      </View>
      <Text style={styles.cardFooter}>{labelBottom}</Text>
    </View>
  );
};

const MiniBarChart = () => {
  const bars = [4, 6, 8, 5, 9, 7, 10, 8, 6, 7, 5, 8];
  return (
    <View style={styles.miniGaugeContainer}>
      <Text style={styles.cardHeader}>KCAL</Text>
      <View style={styles.barChartCenter}>
        {bars.map((h, i) => (
          <View key={i} style={[styles.bar, { height: h * 2.5 }]} />
        ))}
      </View>
      <Text style={styles.cardFooter}>KCAL</Text>
    </View>
  );
};

// --- ANA BİLEŞEN ---
export default function ExactChakraUI() {
  const currentStepCount = 9122; 
  const goal = 10000;
  const progress = currentStepCount / goal;

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
        
          <View style={styles.header}>
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

            <Circle
              cx={cx} cy={cy} r={r}
              stroke={COLORS.darkRed} strokeWidth={strokeWidth} fill="none"
              strokeDasharray={`${arcLength} ${gapLength}`}
              transform={`rotate(${startAngle} ${cx} ${cy})`}
              strokeLinecap="round"
            />

            <Circle
              cx={cx} cy={cy} r={r}
              stroke="url(#heroGradient)" strokeWidth={strokeWidth} fill="none"
              strokeDasharray={`${arcLength} ${gapLength}`}
              strokeDashoffset={arcLength - progressLength}
              transform={`rotate(${startAngle} ${cx} ${cy})`}
              strokeLinecap="round"
            />

            <G origin={`${cx}, ${cy}`}>
              {Array.from({ length: 40 }).map((_, i) => {
                const angle = startAngle + (i * (sweepAngle / 39));
                const isMajor = i % 10 === 0 || i === 39;
                return (
                  <Line
                    key={i}
                    x1={cx + (r + 25) * Math.cos(angle * Math.PI / 180)}
                    y1={cy + (r + 25) * Math.sin(angle * Math.PI / 180)}
                    x2={cx + (r + (isMajor ? 35 : 30)) * Math.cos(angle * Math.PI / 180)}
                    y2={cy + (r + (isMajor ? 35 : 30)) * Math.sin(angle * Math.PI / 180)}
                    stroke={isMajor ? COLORS.glowRed : COLORS.textDarkGray}
                    strokeWidth={isMajor ? 1.5 : 1}
                  />
                );
              })}
            </G>

            <Text style={[styles.tickLabel, { left: cx - 10, top: cy - r - 55 }]}>0</Text>
            <Text style={[styles.tickLabel, { right: cx - r - 60, top: cy - 20 }]}>2500</Text>
            <Text style={[styles.tickLabel, { left: cx - r - 60, top: cy - 20 }]}>7500</Text>
            <Text style={[styles.tickLabel, { right: cx - r - 40, bottom: cy - r - 20 }]}>10000</Text>
            <Text style={[styles.tickLabel, { left: cx - r - 35, bottom: cy - r - 20 }]}>7500</Text> 

            <Circle cx={dotX} cy={dotY} r={5} fill={COLORS.textWhite} />
            <Circle cx={dotX} cy={dotY} r={14} fill="url(#glowG)" opacity={0.6} />
          </Svg>
          
          <View style={styles.innerRingText}>
            <Text style={styles.stepLabelTop}>ADIM</Text>
            <Text style={styles.stepCount}>9.122</Text>
            <Text style={styles.stepLabelBottom}>TOPLAM ADIM</Text>
            <Text style={styles.stepPercentage}>(%91.22)</Text>
          </View>
        </View>

        {/* --- METRİKLER (TÜRKÇE) --- */}
        <Text style={styles.sectionTitle}>HAFTALIK İLERLEME</Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <MiniGauge labelTop="KM" value="3.5" labelBottom="KM" />
          </View>
          <View style={styles.metricCard}>
            <MiniBarChart />
          </View>
          <View style={styles.metricCard}>
            <MiniGauge labelTop="DAKİKA" value="80" labelBottom="DAK" />
          </View>
        </View>

        <View style={styles.playerCard}>
          <Text style={styles.playerSubTitle}>MEDİTASYON OYNATICI</Text>
          <Text style={styles.playTitle}>396 Hz Topraklanma</Text>
          
          <View style={styles.waveContainer}>
            <Svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
              {Array.from({length: 80}).map((_, i) => (
                <Line 
                  key={`b-${i}`}
                  x1={i * 4} y1={30 - (Math.sin(i * 0.15) * Math.sin(i * 0.05) * 20)}
                  x2={i * 4} y2={30 + (Math.sin(i * 0.15) * Math.sin(i * 0.05) * 20)}
                  stroke={COLORS.textDarkGray} strokeWidth="1" opacity={0.4}
                />
              ))}
              <Path 
                d="M 0 30 Q 30 15, 75 30 T 150 30 T 225 30 T 300 30" 
                fill="none" stroke={COLORS.primaryRed} strokeWidth="1.5" opacity="0.6"
              />
              <Path 
                d="M 0 30 Q 40 45, 90 30 T 180 30 T 270 30 T 300 30" 
                fill="none" stroke={COLORS.glowRed} strokeWidth="2" opacity="0.8"
              />
              <Path 
                d="M 0 30 C 50 10, 100 50, 150 30 C 200 10, 250 50, 300 30" 
                fill="none" stroke="#FFAAAA" strokeWidth="1" opacity="0.9"
              />
              <Circle cx="80" cy="20" r="1.5" fill="#FFF" opacity="0.8"/>
              <Circle cx="160" cy="40" r="1" fill="#FFF" opacity="0.5"/>
              <Circle cx="220" cy="15" r="2" fill={COLORS.glowRed} opacity="0.7"/>
            </Svg>
          </View>

          {/* Düzeltilmiş Müzik Kontrolleri (SVG ile Çizildi) */}
          <View style={styles.playerControls}>
            
            {/* Geri Sarma İkonu */}
            <TouchableOpacity activeOpacity={0.6}>
              <Svg width="20" height="20" viewBox="0 0 24 24" fill={COLORS.textGray}>
                <Polygon points="19 20 9 12 19 4 19 20" />
                <Line x1="5" y1="19" x2="5" y2="5" stroke={COLORS.textGray} strokeWidth="3" strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
            
            {/* Oynat İkonu */}
            <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}>
              <View style={styles.playBtnInner}>
                <Svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.textGray} style={{ marginLeft: 3 }}>
                  <Polygon points="5 3 19 12 5 21 5 3" />
                </Svg>
              </View>
            </TouchableOpacity>

            {/* İleri Sarma İkonu */}
            <TouchableOpacity activeOpacity={0.6}>
              <Svg width="20" height="20" viewBox="0 0 24 24" fill={COLORS.textGray}>
                <Polygon points="5 4 15 12 5 20 5 4" />
                <Line x1="19" y1="5" x2="19" y2="19" stroke={COLORS.textGray} strokeWidth="3" strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- STİLLER ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.bgDark 
  },
  scroll: { 
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  
  header: { alignItems: 'center', marginTop: 15, marginBottom: 30 },
  textGlowContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600', letterSpacing: 6 },
  textGlow: { position: 'absolute', color: COLORS.primaryRed, opacity: 0.6, textShadowColor: COLORS.primaryRed, textShadowRadius: 15 },
  headerGlowLine: { marginTop: 12, width: 80, height: 2, backgroundColor: COLORS.primaryRed },
  hero: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 10,
    height: 320,
  },
  tickLabel: {
    position: 'absolute',
    color: COLORS.textGray,
    fontSize: 9,
    fontWeight: '600',
  },
  innerRingText: { 
    position: 'absolute', 
    alignItems: 'center',
    top: '32%',
  },
  stepLabelTop: {
    color: COLORS.textGray,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 4,
  },
  stepCount: { 
    color: COLORS.textWhite, 
    fontSize: 48, 
    fontWeight: '500', 
    fontVariant: ['tabular-nums'],
  },
  stepLabelBottom: { 
    color: COLORS.textGray, 
    fontSize: 10, 
    letterSpacing: 1, 
    marginTop: 4 
  },
  stepPercentage: {
    color: COLORS.textDarkGray,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2
  },

  sectionTitle: {
    color: COLORS.textDarkGray,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },

  metricsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20,
  },
  metricCard: { 
    width: (width - 60) / 3, 
    aspectRatio: 0.85, 
    backgroundColor: COLORS.surface, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: COLORS.surfaceBorder,
    padding: 10,
  },
  miniGaugeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeader: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '500',
  },
  cardFooter: {
    color: COLORS.textGray,
    fontSize: 10,
    fontWeight: '500',
  },
  gaugeCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 60,
  },
  gaugeValue: {
    position: 'absolute',
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  barChartCenter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    gap: 2,
  },
  bar: {
    width: 3.5,
    backgroundColor: COLORS.darkRed,
    borderRadius: 2,
  },

  playerCard: { 
    backgroundColor: COLORS.surface, 
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: COLORS.surfaceBorder,
    alignItems: 'center',
  },
  playerSubTitle: {
    color: COLORS.textGray,
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 6,
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  playBtn: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: COLORS.bgDark, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkRed,
  },
  playBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
});