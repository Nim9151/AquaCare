import React, { useState, useEffect } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { database } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

interface Styles {
  safeArea: ViewStyle;
  container: ViewStyle;
  mainContainer: ViewStyle;
  gridContainer: ViewStyle;
  gridItem: ViewStyle;
  gridItemTitle: TextStyle;
  gridItemValue: TextStyle;
  historyContainer: ViewStyle;
  historyTitle: TextStyle;
  historyItem: ViewStyle;
  historyText: TextStyle;
  icon: ViewStyle;
  headerContainer: ViewStyle;
  headerText: TextStyle;
}

interface WaterStatus {
  pH: number;
  oxygen: number;
  temperature: number;
}

interface ActionHistory {
  action: string;
  timestamp: string; // Date in string format
}

export default function HomeScreen() {
  const [waterStatus, setWaterStatus] = useState<WaterStatus | null>(null);
  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);
  const [overallCondition, setOverallCondition] = useState<string>('Unknown');

  const getOverallCondition = (status: WaterStatus): string => {
    let goodCount = 0;

    if (status.pH >= 6.5 && status.pH <= 8.5) goodCount++;
    if (status.oxygen >= 3.0) goodCount++;
    if (status.temperature >= 26.0 && status.temperature <= 32.0) goodCount++;

    if (goodCount === 3) return 'Good';
    if (goodCount === 2) return 'Moderate';
    return 'Poor';
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'Good':
        return 'happy-outline';
      case 'Moderate':
        return 'sad-outline';
      case 'Poor':
        return 'skull-outline';
      default:
        return 'help-circle-outline';
    }
  };

  useEffect(() => {
    const statusRef = ref(database, 'sensors');
    const historyRef = ref(database, 'actionHistory');

    const statusUnsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setWaterStatus(data);
        setOverallCondition(getOverallCondition(data));
      }
    });

    const historyUnsubscribe = onValue(historyRef, (snapshot) => {
      const historyData = snapshot.val();
      if (historyData) {
        const historyArray = Object.entries(historyData).map(([key, value]) => {
          const { action, timestamp } = value as any;
          return {
            action: action || 'Unknown Action',
            timestamp: timestamp || 'Unknown Date',
          };
        });

        const sortedHistory = historyArray.sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return dateB - dateA;
        });

        setActionHistory(sortedHistory.slice(0, 5));
      } else {
        console.warn('No action history found.');
        setActionHistory([]);
      }
    });

    return () => {
      statusUnsubscribe();
      historyUnsubscribe();
    };
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString('en-MY', {
          timeZone: 'Asia/Kuala_Lumpur',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      : 'Invalid Date';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" translucent={false} />
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>WATER CONDITION</Text>
        </View>

        <View style={styles.mainContainer}>
          {waterStatus && (
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Ionicons name="flask-outline" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.gridItemTitle}>pH Level</Text>
                <Text style={styles.gridItemValue}>{waterStatus.pH.toFixed(2)}</Text>
              </View>

              <View style={styles.gridItem}>
                <Ionicons name="water-outline" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.gridItemTitle}>Oxygen</Text>
                <Text style={styles.gridItemValue}>{waterStatus.oxygen.toFixed(2)} mg/L</Text>
              </View>

              <View style={styles.gridItem}>
                <Ionicons name="thermometer-outline" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.gridItemTitle}>Temperature</Text>
                <Text style={styles.gridItemValue}>{waterStatus.temperature.toFixed(1)}°C</Text>
              </View>

              <View style={styles.gridItem}>
                <Ionicons
                  name={getConditionIcon(overallCondition)}
                  size={24}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.gridItemTitle}>Overall Condition</Text>
                <Text style={styles.gridItemValue}>{overallCondition}</Text>
              </View>
            </View>
          )}

          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Recent Actions</Text>
            {actionHistory.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyText}>{item.action}</Text>
                <Text style={styles.historyText}>{formatDate(item.timestamp)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<Styles>({
  safeArea: {
    flex: 1,
    backgroundColor: '#2C3E50',
    paddingTop: Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  mainContainer: {
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  gridItemTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
    marginTop: 8,
  },
  gridItemValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  historyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  historyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyText: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 14,
  },
  icon: {
    marginBottom: 8,
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
});
