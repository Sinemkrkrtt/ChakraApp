import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const COLORS = {
  bgDark: '#010A14',       
  surface: '#031221',      
  surfaceBorder: 'rgba(0, 191, 255, 0.25)', 
  primaryBlue: '#00BFFF',  
  textWhite: '#F0F9FF',    
  textGray: '#85A3BC',     
  textDarkGray: '#003A5C', 
};

const MOODS = [
  { id: 'joy', label: 'Neşeli', color: '#F1C40F' },
  { id: 'calm', label: 'Huzurlu', color: '#00BFFF' },
  { id: 'thought', label: 'Düşünceli', color: '#9B59B6' },
  { id: 'neutral', label: 'Nötr', color: '#95A5A6' },
  { id: 'tired', label: 'Yorgun', color: '#E74C3C' }
];

const INITIAL_ENTRIES = {
  10: { mood: 'joy', text: 'Kendimi ifade etmek bugün su gibi akıcıydı.' },
  14: { mood: 'thought', text: 'Kelimelerin gücünü bazen susunca daha iyi anlıyorum.' },
  23: { mood: 'calm', text: 'İç huzurum sesime yansıyor, mavi enerji her yerde.' }
};

const WEEK_DAYS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

export default function ThroatChakraDetail() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [currentText, setCurrentText] = useState('');
  const [activeMood, setActiveMood] = useState('calm');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState(null);

  const handleSaveEntry = () => {
    if (currentText.trim().length === 0) return;
    setEntries(prev => ({ ...prev, 24: { mood: activeMood, text: currentText.trim() } }));
    setCurrentText('');
    Keyboard.dismiss();
  };

  const openDayEntry = (day) => {
    if (entries[day]) {
      setSelectedDayData({ day, ...entries[day] });
      setModalVisible(true);
    }
  };

  const getMoodColor = (moodId) => MOODS.find(m => m.id === moodId)?.color || COLORS.primaryBlue;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <View style={styles.textGlowContainer}>
              <Text style={[styles.headerTitle, styles.textGlow]}>BOĞAZ ÇAKRASI</Text>
              <Text style={styles.headerTitle}>BOĞAZ ÇAKRASI</Text>
            </View>
            <View style={styles.headerGlowLine} />
          </View>

          <View style={styles.editorContainer}>
            <View style={styles.moodBar}>
              {MOODS.map(mood => (
                <TouchableOpacity 
                  key={mood.id} 
                  onPress={() => setActiveMood(mood.id)}
                  style={[styles.moodItem, activeMood === mood.id && { borderColor: mood.color }]}
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
                <Text style={styles.charCount}>{currentText.length} karakter</Text>
                <TouchableOpacity 
                  style={[styles.sendBtn, { backgroundColor: currentText ? getMoodColor(activeMood) : COLORS.surfaceBorder }]}
                  onPress={handleSaveEntry}
                  disabled={!currentText}
                >
                  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M12 19V5M5 12l7-7 7 7" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>HAZİRAN YANSIMALARI</Text>
          <View style={styles.calendarContainer}>
            <View style={styles.calDaysHeader}>
              {WEEK_DAYS.map((day, i) => <Text key={i} style={styles.calDayName}>{day}</Text>)}
            </View>
            <View style={styles.calGrid}>
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const entry = entries[day];
                return (
                  <TouchableOpacity key={i} onPress={() => openDayEntry(day)} style={[styles.calCell, entry && { borderColor: getMoodColor(entry.mood) }]}>
                    <Text style={styles.calDayText}>{day}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 0 }, // Boşluk tamamen sıfırlandı
  header: { alignItems: 'center', marginTop: 15, marginBottom: 30 },
  textGlowContainer: { alignItems: 'center' },
  headerTitle: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600', letterSpacing: 6 },
  textGlow: { position: 'absolute', color: COLORS.primaryBlue, opacity: 0.6, textShadowColor: COLORS.primaryBlue, textShadowRadius: 15 },
  headerGlowLine: { marginTop: 12, width: 80, height: 2, backgroundColor: COLORS.primaryBlue },

  editorContainer: { marginBottom: 25 },
  moodBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  moodItem: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
  moodLabel: { fontSize: 10, fontWeight: '700' },

  inputBox: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 20, minHeight: 220, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  textInput: { flex: 1, color: COLORS.textWhite, fontSize: 15, textAlignVertical: 'top' },
  inputFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  charCount: { color: COLORS.textGray, fontSize: 11 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },

  sectionTitle: { color: COLORS.textGray, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 10, textAlign: 'flex-start' },
  calendarContainer: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 25, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  calDaysHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  calDayName: { color: COLORS.textGray, fontSize: 14, width: '13%', textAlign: 'center' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '13.5%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent', margin: 0.8, borderRadius: 10 },
  calDayText: { color: COLORS.textGray, fontSize: 15 }
});