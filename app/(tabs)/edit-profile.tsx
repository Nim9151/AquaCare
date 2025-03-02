import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { updateProfile, updatePassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function EditProfileScreen() {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const handleUpdate = async () => {
    try {
      const promises = [];
      const currentUser = auth.currentUser;

      if (newUsername) {
        promises.push(updateProfile(currentUser, { displayName: newUsername }));
      }

      if (newPassword) {
        promises.push(updatePassword(currentUser, newPassword));
      }

      if (promises.length === 0) {
        Alert.alert("No Changes", "Please fill at least one field to update.");
        return;
      }

      await Promise.all(promises);

      Alert.alert("Success", "Profile updated successfully!");
      router.push("/(tabs)/profile"); // Navigate back to the profile page
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Edit Profile</Text>

        {/* Profile Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/logo.png")} // Use the same image as in profile.tsx
            style={styles.profileImage}
          />
        </View>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Enter new username"
          placeholderTextColor="#999"
          value={newUsername}
          onChangeText={setNewUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2C3E50", justifyContent: "center" },
  container: { paddingHorizontal: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20, // Space between the title and image
  },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make the image circular
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5a768e",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "#FFFFFF", fontSize: 18, textAlign: "center" },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

