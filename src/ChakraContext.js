// ChakraContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

export const ChakraContext = createContext();

const initialChakras = [
  { id: 1, name: 'Kök', color: '#FF0000', progress: 0 },
  { id: 2, name: 'Sakral', color: '#FFA500', progress: 0 },
  { id: 3, name: 'Solar Plexus', color: '#FFFF00', progress: 0 },
  { id: 4, name: 'Kalp', color: '#00C82B', progress: 0 },
  { id: 5, name: 'Boğaz', color: '#00BFFF', progress: 0 },
  { id: 6, name: 'Üçüncü Göz', color: '#7202C2', progress: 0 },
  { id: 7, name: 'Tepe', color: '#CF03CF', progress: 0 },
];

export const ChakraProvider = ({ children }) => {
  const [chakras, setChakras] = useState(initialChakras);
  
  // 🧠 SENIOR DOKUNUŞ: Günlükleri tarih anahtarlı bir nesne olarak saklıyoruz.
  // Örnek yapı: { '2026-06-26': 'Bugün çok huzurluyum...' }
  const [journals, setJournals] = useState({});

  const updateChakraProgress = (id, newProgress) => {
    setChakras(prevChakras => 
      prevChakras.map(chakra => 
        chakra.id === id ? { ...chakra, progress: Math.min(Math.max(newProgress, 0), 100) } : chakra
      )
    );
  };

  // 📝 Günlük Kaydetme ve Boğaz Çakrasını Tetikleme Fonksiyonu
  const saveJournalEntry = (dateString, text) => {
    setJournals(prev => {
      const updated = { ...prev, [dateString]: text };
      
      // Yazılan toplam günlük sayısına göre Boğaz Çakrasını (ID: 5) ödüllendir
      const totalWritten = Object.values(updated).filter(t => t.trim().length > 0).length;
      const boğazProgress = Math.min(totalWritten * 20, 100); // Her günlük %20 doldurur
      updateChakraProgress(5, boğazProgress);

      return updated;
    });
  };

  // Kök Çakra İçin Global Pedometer Motoru
  useEffect(() => {
    let subscription;
    let pastSteps = 0;

    const initPedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        try {
          const past = await Pedometer.getStepCountAsync(start, end);
          if (past) pastSteps = past.steps;
        } catch (error) { console.log(error); }

        subscription = Pedometer.watchStepCount(result => {
          const totalSteps = pastSteps + result.steps;
          const rootProgress = Math.min(Math.floor((totalSteps / 10000) * 100), 100);
          updateChakraProgress(1, rootProgress);
        });
      }
    };

    initPedometer();
    return () => { if (subscription) subscription.remove(); };
  }, []);

  return (
    <ChakraContext.Provider value={{ chakras, updateChakraProgress, journals, saveJournalEntry }}>
      {children}
    </ChakraContext.Provider>
  );
};