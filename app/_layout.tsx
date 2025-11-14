import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <Stack
        screenOptions={{
          headerShown: true,
          headerShadowVisible: false,
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "#FFFFFF",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(pokemon)" />
      </Stack>
    </SafeAreaProvider>
  );
}
