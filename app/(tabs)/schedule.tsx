import { database } from "../../firebaseConfig";
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, get, update } from "firebase/database";

const ScheduleScreen = () => {
  const [schedules, setSchedules] = useState([]);
  const [showPicker, setShowPicker] = useState(null);
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = () => {
    const schedulesRef = ref(database, 'feedingSchedules');
    get(schedulesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const scheduleList = Array.from({ length: 5 }, (_, index) => {
          const key = `schedule${index + 1}`;
          return { id: key, time: data[key]?.time || "" };
        });
        setSchedules(scheduleList);
      } else {
        const emptySchedules = Array.from({ length: 5 }, (_, index) => ({
          id: `schedule${index + 1}`,
          time: "",
        }));
        setSchedules(emptySchedules);
      }
    });
  };

  const showTimePicker = (id) => {
    setShowPicker(id);
  };

  const hideTimePicker = () => {
    setShowPicker(null);
  };

  const onTimeChange = (event, selectedDate) => {
    if (event.type === "set") {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      updateSchedule(showPicker, formattedTime);
    }
    hideTimePicker();
  };

  const updateSchedule = (id, time) => {
    const scheduleRef = ref(database, `feedingSchedules/${id}`);
    update(scheduleRef, { time }).then(() => {
      Alert.alert("Success", "Feeding schedule updated!");
      fetchSchedules();
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" translucent={false} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Feeding Schedule</Text>
        </View>
        <View style={styles.mainContainer}>
          <FlatList
            data={schedules}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.scheduleItem}>
                <Text style={styles.scheduleText}>Feeding Slot {index + 1}</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => {
                    setSelectedTime(new Date());
                    showTimePicker(item.id);
                  }}
                >
                  <Text style={styles.timeText}>{item.time || "Set Time"}</Text>
                </TouchableOpacity>
                {showPicker === item.id && (
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="clock" // Changed from "spinner" to "clock"
                    onChange={onTimeChange}
                  />
                )}
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2C3E50', paddingTop: Constants.statusBarHeight },
  container: { flex: 1, backgroundColor: '#2C3E50' },
  headerContainer: { backgroundColor: '#34495E', paddingVertical: 20, alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  mainContainer: { padding: 20 },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  scheduleText: { color: '#fff', fontSize: 18, marginRight: 10, flex: 2 },
  timeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  timeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ScheduleScreen;
