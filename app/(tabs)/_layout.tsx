import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#5a768e", // Dark Blue-Gray for the tab bar
        },
        tabBarActiveTintColor: "#00d4ff", // Light Aqua for active tabs
        tabBarInactiveTintColor: "#ffffff", // White for inactive tabs
        headerStyle: {
          backgroundColor: "#5a768e", // Header background for all tabs
        },
        headerTintColor: "#ffffff", // White text/icons
        headerTitleStyle: {
          fontWeight: "bold", // Bold text
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "index":
              iconName = focused ? "home" : "home-outline";
              break;
            case "history":
              iconName = focused ? "time" : "time-outline";
              break;
            case "schedule":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "alert"; // Default icon
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Tab Screens */}
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="schedule" options={{ title: "Schedule" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      

      {/* Exclude "edit-profile" from bottom tabs */}
      <Tabs.Screen
        name="edit-profile"
        options={{
          title: "Update Profile", // Title for the header
          href: null, // Prevent "edit-profile" from appearing in the tabs
        }}
      />
    </Tabs>
  );
}
