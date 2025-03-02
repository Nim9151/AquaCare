import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { database } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

interface ActionHistory {
  action: string;
  timestamp: string; // Timestamp as a string
  temperature?: number; // Optional temperature value
  oxygen?: number; // Optional oxygen level
  pH?: number; // Optional pH value
  expanded?: boolean; // State for expand/collapse
}

const MIN_TEMP = 26.0;
const MAX_TEMP = 32.0;
const MIN_OXYGEN = 3.0;
const MIN_PH = 6.5;
const MAX_PH = 8.5;

export default function HistoryScreen() {
  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);

  // Fetch data from Firebase
  useEffect(() => {
    const historyRef = ref(database, 'actionHistory');

    const historyUnsubscribe = onValue(historyRef, (snapshot) => {
      const historyData = snapshot.val();
      if (historyData) {
        const historyArray = Object.entries(historyData).map(([key, value]: [string, any]) => ({
          action: value.action || 'Unknown action',
          timestamp: value.timestamp || 'Invalid timestamp',
          temperature: value.temperature ?? null,
          oxygen: value.oxygen ?? null,
          pH: value.pH ?? null,
          expanded: false, // Initially collapsed
        }));
        setActionHistory(
          historyArray.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
      }
    });

    return () => {
      historyUnsubscribe();
    };
  }, []);

  // Format timestamp into a readable date string
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return !isNaN(date.getTime())
      ? date.toLocaleString('en-MY', {
          timeZone: 'Asia/Kuala_Lumpur',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Invalid Date';
  };

  // Toggle expand/collapse for warnings only
  const toggleExpand = (index: number) => {
    setActionHistory((prevHistory) =>
      prevHistory.map((item, i) =>
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  // Generate warnings and suggestions only for abnormal conditions
  const renderWarnings = (item: ActionHistory) => {
    const warnings = [];

    // Temperature Warning
    if (item.action.toLowerCase().includes('temperature out of range')) {
      warnings.push({
        color: '#00BFFF',
        message: 'Temperature is out of range: Water pump activated.',
        suggestion: 'Consider turning on the heater or improving water circulation.',
      });
    }

    // Oxygen Warning
    if (item.action.toLowerCase().includes('oxygen low')) {
      warnings.push({
        color: '#DC143C',
        message: 'Abnormal oxygen level: Water pump activated.',
        suggestion: 'It’s time to clean up the tank! Possibly too much algae or fish waste.',
      });
    }

    // pH Warning
    if (item.action.toLowerCase().includes('ph adjusted')) {
      warnings.push({
        color: '#FFC107',
        message: 'Abnormal pH level: pH buffer added.',
        suggestion: 'Possibly caused by fish waste. Maybe you should clean the tank.',
      });
    }

    return warnings;
  };

  // Render each history item
  const renderItem = ({ item, index }: { item: ActionHistory; index: number }) => {
    const warnings = renderWarnings(item);

    // Ignore normal conditions
    if (item.action.toLowerCase().includes('back to normal')) {
      return null;
    }

    return (
      <View style={styles.historyItem}>
        <TouchableOpacity onPress={() => toggleExpand(index)}>
          <View style={styles.actionContainer}>
            {warnings.length > 0 && (
              <View style={styles.warningContainer}>
                <Ionicons name="warning" size={24} color={warnings[0].color} />
                <Text style={[styles.warningText, { color: warnings[0].color }]}>
                  {warnings[0].message}
                </Text>
              </View>
            )}
            <Text style={styles.historyText}>{item.action}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>

        {item.expanded && (
          <View style={styles.expandedContainer}>
            {warnings.map((warning, i) => (
              <Text key={i} style={styles.suggestionText}>
                • {warning.suggestion}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" translucent={false} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>ACTION HISTORY</Text>
        </View>
        <FlatList
          data={actionHistory}
          renderItem={(props) => renderItem({ ...props, index: props.index })}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2C3E50',
    paddingTop: Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  headerContainer: {
    backgroundColor: '#34495E',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  historyItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionContainer: {
    marginBottom: 5,
  },
  historyText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dateText: {
    color: '#B2DFDB',
    fontSize: 14,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  warningText: {
    fontSize: 14,
    marginLeft: 5,
  },
  expandedContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  suggestionText: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 5,
  },
});
