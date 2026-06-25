import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { ChakraContext } from './ChakraContext';

const { width } = Dimensions.get('window');

const COLORS = {
  bgDark: '#010A14',       
  surface: '#031221',      
  surfaceBorder: 'rgba(0, 191, 255, 0.15)',
  primaryBlue: '#00BFFF',  
  textWhite: '#F0E9FF',    
  textGray: '#7A93A8',     
  textDarkGray: '#1C354A', 
};

const MOODS = [
  { id: 'joy', label: 'Neşeli', color: '#F1C40F' },
  { id: 'calm', label: 'Huzurlu', color: '#00BFFF' },
  { id: 'thought', label: 'Düşünceli', color: '#9B59B6' },
  { id: 'neutral', label: 'Nötr', color: '#95A5A6' },
  { id: 'tired', label: 'Yorgun', color: '#E74C3C' }
];

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const WEEK_DAYS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

export default function ThroatChakraDetail() {
  const navigation = useNavigation();
  const { chakras, updateChakraProgress } = useContext(ChakraContext);

  // Cihazın gerçek tarihine göre başlangıç ay ve yılını alıyoruz
  const todayDate = new Date();
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth()); 

  const [currentText, setCurrentText] = useState('');
  const [activeMood, setActiveMood] = useState('calm');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState(null);

  // 🧠 SENIOR DOKUNUŞ: Yalandan yazılmış veriler (INITIAL_ENTRIES) tamamen temizlendi, boş obje ile başlıyor.
  const [entries, setEntries] = useState({});

  const monthKey = `${currentYear}-${currentMonth}`;
  const currentMonthEntries = entries[monthKey] || {};

  // Dinamik Ay Hesaplamaları
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const blankDaysCount = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // 🎯 GÜNDE BİR KERE YAZINCA FULL DOLMA MOTORU
  useEffect(() => {
    const today = new Date();
    const todayMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
    const todayDay = today.getDate();

    // Bugün için bir günlük girilmiş mi kontrol et
    const hasEntryToday = entries[todayMonthKey]?.[todayDay];

    // Varsa %100 yap, yoksa %0 (Home Screen anlık tetiklenir)
    const newProgress = hasEntryToday ? 100 : 0;
    updateChakraProgress(5, newProgress); // Boğaz Çakrası ID: 5
  }, [entries]);

  const handleSaveEntry = () => {
    if (currentText.trim().length === 0) return;
    
    const today = new Date();
    const todayMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
    const todayDay = today.getDate();

    setEntries(prev => ({
      ...prev,
      [todayMonthKey]: {
        ...prev[todayMonthKey],
        [todayDay]: { mood: activeMood, text: currentText.trim() }
      }
    }));

    // Eğer kullanıcı başka bir ayı incelerken günlük yazdıysa, bugünün takvimine otomatik odakla
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());

    setCurrentText('');
    Keyboard.dismiss();
  };

  const openDayEntry = (day) => {
    if (currentMonthEntries[day]) {
      setSelectedDayData({ day, ...currentMonthEntries[day] });
      setModalVisible(true);
    }
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(y => y - 1);
      } else {
        setCurrentMonth(m => m - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(y => y + 1);
      } else {
        setCurrentMonth(m => m + 1);
      }
    }
  };

  const getMoodColor = (moodId) => MOODS.find(m => m.id === moodId)?.color || COLORS.primaryBlue;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
              <Text style={[styles.headerTitle, styles.textGlow]}>BOĞAZ ÇAKRASI</Text>
              <Text style={styles.headerTitle}>BOĞAZ ÇAKRASI</Text>
            </View>
            <View style={styles.headerGlowLine} />
          </View>

          {/* EDİTÖR */}
          <View style={styles.editorContainer}>
            <View style={styles.moodBar}>
              {MOODS.map(mood => (
                <TouchableOpacity 
                  key={mood.id} 
                  onPress={() => setActiveMood(mood.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.moodItem, 
                    activeMood === mood.id && { 
                      borderColor: mood.color, 
                      backgroundColor: `${mood.color}15`
                    }
                  ]}
                >
                  <Text style={[styles.moodLabel, { color: activeMood === mood.id ? mood.color : COLORS.textGray }]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="İçindeki fısıltıyı kelimelere dök..."
                placeholderTextColor={COLORS.textDarkGray}
                value={currentText}
                onChangeText={setCurrentText}
                selectionColor={COLORS.primaryBlue}
              />
              
              <View style={styles.inputFooter}>
                <Text style={styles.charCount}>
                  {currentText.length > 0 ? `${currentText.length} karakter` : ''}
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.sendBtn, 
                    { backgroundColor: currentText.trim().length > 0 ? getMoodColor(activeMood) : COLORS.surfaceBorder }
                  ]}
                  onPress={handleSaveEntry}
                  disabled={currentText.trim().length === 0}
                  activeOpacity={0.8}
                >
                  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={currentText.trim().length > 0 ? "#010A14" : COLORS.textGray} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M12 19V5M5 12l7-7 7 7" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* DİNAMİK AY DEĞİŞTİRİCİ NAVİGASYON */}
          <View style={styles.monthNavigator}>
            <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.monthArrow}>
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.textWhite} strokeWidth="2.5"><Path d="M15 18l-6-6 6-6" /></Svg>
            </TouchableOpacity>
            <Text style={styles.monthNavTitle}>{`${MONTH_NAMES[currentMonth].toUpperCase()} ${currentYear}`}</Text>
            <TouchableOpacity onPress={() => changeMonth('next')} style={styles.monthArrow}>
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.textWhite} strokeWidth="2.5"><Path d="M9 18l6-6-6-6" /></Svg>
            </TouchableOpacity>
          </View>

          {/* TAKVİM */}
          <View style={styles.calendarContainer}>
            <View style={styles.calDaysHeader}>
              {WEEK_DAYS.map((day, i) => <Text key={`wd-${i}`} style={styles.calDayName}>{day}</Text>)}
            </View>
            
            <View style={styles.calGrid}>
              {/* Ay Başlangıcındaki Boş Günler */}
              {Array.from({ length: blankDaysCount }).map((_, i) => (
                <View key={`blank-${i}`} style={styles.calCellWrapper} />
              ))}

              {/* Gerçek Ayın Günleri */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const entry = currentMonthEntries[day];
                return (
                  <View key={`day-${i}`} style={styles.calCellWrapper}>
                    <TouchableOpacity 
                      onPress={() => openDayEntry(day)} 
                      disabled={!entry}
                      activeOpacity={0.7}
                      style={[
                        styles.calCell, 
                        entry && { 
                          borderColor: getMoodColor(entry.mood),
                          backgroundColor: `${getMoodColor(entry.mood)}15`
                        }
                      ]}
                    >
                      <Text style={[styles.calDayText, entry && { color: COLORS.textWhite, fontWeight: '700' }]}>
                        {day}
                      </Text>
                      {entry && <View style={[styles.calMoodIndicator, { backgroundColor: getMoodColor(entry.mood) }]} />}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL */}
      <Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setModalVisible(false)} activeOpacity={1} />
          
          <View style={[styles.modalContent, selectedDayData && { borderTopColor: getMoodColor(selectedDayData.mood) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalDate}>{selectedDayData?.day} {MONTH_NAMES[currentMonth]}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn} activeOpacity={0.6}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.textGray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M18 6L6 18M6 6l12 12" />
                </Svg>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={[styles.modalMoodTag, { backgroundColor: selectedDayData ? `${getMoodColor(selectedDayData.mood)}15` : COLORS.surface }]}>
                <Text style={[styles.modalMoodText, { color: selectedDayData ? getMoodColor(selectedDayData.mood) : COLORS.textGray }]}>
                  {MOODS.find(m => m.id === selectedDayData?.mood)?.label.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.modalText}>{selectedDayData?.text}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }, 
  header: { alignItems: 'center', marginTop: 15, marginBottom: 35 },
  backButton: { position: 'absolute', left: 0, width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: COLORS.surfaceBorder, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  textGlowContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.textWhite, fontSize: 13, fontWeight: '700', letterSpacing: 8, opacity: 0.9 },
  textGlow: { position: 'absolute', color: COLORS.primaryBlue, opacity: 0.5, textShadowColor: COLORS.primaryBlue, textShadowRadius: 15 },
  headerGlowLine: { marginTop: 12, width: 60, height: 2, backgroundColor: COLORS.primaryBlue, shadowColor: COLORS.primaryBlue, shadowOpacity: 0.8, shadowRadius: 10 },
  editorContainer: { marginBottom: 30 },
  moodBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  moodItem: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: 'transparent' },
  moodLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  inputBox: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 22, minHeight: 220, borderWidth: 1, borderColor: COLORS.surfaceBorder, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  textInput: { flex: 1, color: COLORS.textWhite, fontSize: 15, textAlignVertical: 'top', lineHeight: 26, fontWeight: '300' },
  inputFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 15 },
  charCount: { color: COLORS.textGray, fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  monthNavigator: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginBottom: 15 },
  monthArrow: { width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, justifyContent: 'center', alignItems: 'center' },
  monthNavTitle: { color: COLORS.textWhite, fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  calendarContainer: { backgroundColor: COLORS.surface, borderRadius: 24, paddingVertical: 20, paddingHorizontal: 15, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  calDaysHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  calDayName: { color: COLORS.textGray, fontSize: 11, fontWeight: '700', width: '14.28%', textAlign: 'center', opacity: 0.5 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start' },
  calCellWrapper: { width: '14.28%', height: 48, alignItems: 'center', justifyContent: 'center' },
  calCell: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'transparent' },
  calDayText: { color: COLORS.textGray, fontSize: 13, fontWeight: '400' },
  calMoodIndicator: { width: 4, height: 4, borderRadius: 2, position: 'absolute', bottom: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(1, 10, 20, 0.90)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: '#031221', width: '100%', borderRadius: 28, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderTopWidth: 4 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  modalDate: { color: COLORS.textWhite, fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.bgDark, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.surfaceBorder },
  modalBody: { padding: 24, minHeight: 160 },
  modalMoodTag: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, marginBottom: 20 },
  modalMoodText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  modalText: { color: COLORS.textWhite, opacity: 0.9, fontSize: 15, lineHeight: 26, fontWeight: '300' },
});