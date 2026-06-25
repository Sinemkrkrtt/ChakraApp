import React, { useState, useRef, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ChakraContext } from './ChakraContext';

const { width } = Dimensions.get('window');

const COLORS = {
  bgDark: '#0A000A',       
  surface: '#140014',      
  surfaceBorder: 'rgba(207, 3, 207, 0.25)', 
  primaryMagenta: '#CF03CF', 
  textWhite: '#FDF0FD',    
  textGray: '#A68CA6',     
  textDarkGray: '#4A2B4A', 
  deleteRed: '#E74C3C',
  deleteBg: 'rgba(231, 76, 60, 0.15)'
};

const INITIAL_AFFIRMATIONS = [
  { id: '1', text: 'Evrenle ve tüm yaratılışla bir bütün olduğumu hissediyorum.' },
  { id: '2', text: 'İlahi rehberliğe ve içsel bilgeliğime güveniyorum.' },
  { id: '3', text: 'Zihnim saf, açık ve sınırsız olasılıklara hazır.' },
];

// --- PERFORMANSLI SOLA KAYDIRARAK SİLME BİLEŞENİ (Düzeltildi) ---
const SwipeableAffirmation = ({ item, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Sadece yatay kaydırmaları yakala (dikey scroll'u bozmamak için)
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          // Sadece SOLA kaydırmaya izin ver
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -100) {
          // Yeterince sola kaydırıldıysa pürüzsüzce sil
          Animated.timing(translateX, {
            toValue: -width,
            duration: 250,
            useNativeDriver: true,
          }).start(() => onDelete(item.id));
        } else {
          // Eşik geçilmediyse yaya benzer esneklikle geri dön
          Animated.spring(translateX, {
            toValue: 0,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.swipeWrapper}>
      
      {/* Arkadaki Silme Alanı (Taşmalar düzeltildi, sağa alındı) */}
      <View style={styles.deleteBackground}>
        <View style={styles.deleteActionContainer}>
          <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.deleteRed} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
          </Svg>
        </View>
      </View>

      {/* Öndeki Hareketli Kart */}
      <Animated.View 
        style={[styles.affirmationCard, { transform: [{ translateX }] }]} 
        {...panResponder.panHandlers}
      >
        <View style={styles.bulletContainer}>
          <View style={styles.bulletDot} />
        </View>
        <Text style={styles.affirmationText}>{item.text}</Text>
      </Animated.View>
      
    </View>
  );
};

// --- ANA EKRAN ---
export default function CrownChakraDetail() {
  const navigation = useNavigation();
  const [affirmations, setAffirmations] = useState(INITIAL_AFFIRMATIONS);
  const [currentText, setCurrentText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { updateChakraProgress } = useContext(ChakraContext);

  const handleAddAffirmation = () => {
    if (currentText.trim().length === 0) return;
    
    const newAffirmation = {
      id: Date.now().toString(),
      text: currentText.trim(),
    };
    
    setAffirmations([newAffirmation, ...affirmations]);
    setCurrentText('');
    Keyboard.dismiss();
  };

  const handleDeleteAffirmation = (id) => {
    setAffirmations(prev => prev.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* HEADER (Çıkış Oku) */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()} // <--- DEĞİŞİKLİK BURADA: goBack() kullandık
              activeOpacity={0.7}
            >
              <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.textGray} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <Path d="M19 12H5M12 19l-7-7 7-7" />
              </Svg>
            </TouchableOpacity>

            <View style={styles.textGlowContainer}>
              <Text style={[styles.headerTitle, styles.textGlow]}>TEPE ÇAKRASI</Text>
              <Text style={styles.headerTitle}>TEPE ÇAKRASI</Text>
            </View>
            <View style={styles.headerGlowLine} />
          </View>

          {/* BİLGİ METNİ */}
          <Text style={styles.description}>
            Bilinçaltını evrensel frekansa uyumla. Kendi gerçeğini yaratmak için niyetlerini olumlamalara dönüştür.
          </Text>

          {/* OLUMLAMA EKLEME ALANI */}
          <View style={[styles.inputBox, isFocused && styles.inputBoxFocused]}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Evrene göndermek istediğin olumlamayı yaz..."
              placeholderTextColor={COLORS.textDarkGray}
              value={currentText}
              onChangeText={setCurrentText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              selectionColor={COLORS.primaryMagenta}
            />
            
            <View style={styles.inputFooter}>
              <Text style={styles.charCount}>
                {currentText.length > 0 ? `${currentText.length} karakter` : ''}
              </Text>
              <TouchableOpacity 
                style={[
                  styles.sendBtn, 
                  { backgroundColor: currentText.trim().length > 0 ? COLORS.primaryMagenta : COLORS.surfaceBorder }
                ]}
                onPress={handleAddAffirmation}
                disabled={currentText.trim().length === 0}
                activeOpacity={0.8}
              >
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={currentText.trim().length > 0 ? "#0A000A" : COLORS.textGray} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M12 5v14M5 12h14" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>

          {/* LİSTE BAŞLIĞI */}
          <View style={styles.listHeaderContainer}>
            <Text style={styles.sectionTitle}>NİYETLERİM VE OLUMLAMALARIM</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{affirmations.length} NİYET</Text>
            </View>
          </View>

          {/* KAYDIRILABİLİR LİSTE ELEMANLARI */}
          <View style={styles.listContainer}>
            {affirmations.map((item) => (
              <SwipeableAffirmation 
                key={item.id} 
                item={item} 
                onDelete={handleDeleteAffirmation} 
              />
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }, 
  
  // HEADER & BACK BUTTON
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 25, position: 'relative', width: '100%' },
  backButton: { position: 'absolute', left: 0, width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: COLORS.surfaceBorder, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  textGlowContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.textWhite, fontSize: 13, fontWeight: '700', letterSpacing: 8, opacity: 0.9 },
  textGlow: { position: 'absolute', color: COLORS.primaryMagenta, opacity: 0.6, textShadowColor: COLORS.primaryMagenta, textShadowRadius: 15 },
  headerGlowLine: { position: 'absolute', bottom: -12, width: 60, height: 2, backgroundColor: COLORS.primaryMagenta, shadowColor: COLORS.primaryMagenta, shadowOpacity: 0.8, shadowRadius: 10 },

  description: { color: COLORS.textGray, fontSize: 13, fontWeight: '400', textAlign: 'center', paddingHorizontal: 20, lineHeight: 22, opacity: 0.8, marginBottom: 30, marginTop: 10 },

  // INPUT
  inputBox: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 22, minHeight: 160, borderWidth: 1, borderColor: COLORS.surfaceBorder, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5, marginBottom: 35 },
  inputBoxFocused: { borderColor: COLORS.primaryMagenta, backgroundColor: '#190019', shadowColor: COLORS.primaryMagenta, shadowOpacity: 0.15, shadowRadius: 10 },
  textInput: { flex: 1, color: COLORS.textWhite, fontSize: 15, textAlignVertical: 'top', lineHeight: 24, fontWeight: '300' },
  inputFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 },
  charCount: { color: COLORS.textGray, fontSize: 10, fontWeight: '600' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },

  // LİSTE BAŞLIĞI
  listHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 4 },
  sectionTitle: { color: COLORS.textGray, fontSize: 10, fontWeight: '800', letterSpacing: 3, opacity: 0.8 },
  countBadge: { backgroundColor: 'rgba(207, 3, 207, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  countBadgeText: { color: COLORS.primaryMagenta, fontSize: 9, fontWeight: '800', letterSpacing: 1 },

  // SWIPE-TO-DELETE MİMARİSİ (Düzeltildi)
  listContainer: { paddingBottom: 20 },
  
  swipeWrapper: { 
    position: 'relative', 
    marginBottom: 12, // Gap yerine marginBottom kullanıldı
    width: '100%'
  },
  
  deleteBackground: { 
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.deleteBg, 
    borderRadius: 20, 
    flexDirection: 'row', 
    justifyContent: 'flex-end', // Çöp kutusu sağda
    alignItems: 'center' 
    // Arkadaki border kaldırıldı ki önden taşmasın
  },
  
  deleteActionContainer: { 
    paddingRight: 24, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  
  affirmationCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.surface, 
    borderRadius: 20, 
    paddingVertical: 18, 
    paddingHorizontal: 20, 
    borderWidth: 1, 
    borderColor: COLORS.surfaceBorder 
  },
  
  bulletContainer: { justifyContent: 'center', alignItems: 'center', marginRight: 16, width: 12 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primaryMagenta, shadowColor: COLORS.primaryMagenta, shadowOpacity: 1, shadowRadius: 8, elevation: 5 },
  affirmationText: { flex: 1, color: COLORS.textWhite, fontSize: 14, lineHeight: 22, fontWeight: '300', opacity: 0.95 }
});