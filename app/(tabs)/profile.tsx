import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/sign-in");
    } catch (error) {
      alert("Failed to log out: " + error.message);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: handleLogout },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" translucent={false} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>PROFILE</Text>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.profileInfo}>
            {/* Load and display the profile picture */}
            <Image
              source={require("../../assets/logo.png")}
              style={styles.profileImage}
            />
            <Text style={styles.nameText}>{user?.displayName || "Koko"}</Text>
            <Text style={styles.emailText}>{user?.email || "koko@gmail.com"}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(tabs)/edit-profile")}
          >
            <Ionicons name="create-outline" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2C3E50",
    paddingTop: Constants.statusBarHeight,
  },
  container: { flex: 1, backgroundColor: "#2C3E50" },
  headerContainer: {
    backgroundColor: "#34495E",
    paddingVertical: 15,
    alignItems: "center",
  },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF" },
  mainContainer: { padding: 20 },
  profileInfo: { alignItems: "center", marginBottom: 30 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make the image circular
    marginBottom: 10,
  },
  nameText: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold", marginTop: 10 },
  emailText: { color: "#FFFFFF", fontSize: 16, opacity: 0.8 },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, marginLeft: 10 },
  icon: { marginRight: 10 },
});

export default ProfileScreen;

