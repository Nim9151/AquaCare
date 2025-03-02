import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Function to handle password reset
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset", "A password reset email has been sent to your email.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Function to handle user login
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)"); // Navigate to the main app tabs
    } catch (error) {
      Alert.alert("Login failed", "Invalid email or password");
    }
  };

  return (
    <>
      {/* Set StatusBar background to match app */}
      <StatusBar backgroundColor="#2C3E50" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>Welcome</Text>

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          {/* Forgot Password Button */}
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign-Up Navigation */}
          <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2C3E50", justifyContent: "center" },
  container: { paddingHorizontal: 20 },
  logo: { width: 150, height: 150, alignSelf: "center", marginBottom: 20 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  button: { backgroundColor: "#5a768e", padding: 15, borderRadius: 10 },
  buttonText: { color: "#FFFFFF", fontSize: 18, textAlign: "center" },
  forgotPasswordText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  linkText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});

