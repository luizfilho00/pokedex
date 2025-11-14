import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "SFProDisplay-Regular": require("@/assets/fonts/SF-Pro-Display-Regular.otf"),
    "SFProDisplay-Bold": require("@/assets/fonts/SF-Pro-Display-Bold.otf"),
    "SFProDisplay-Medium": require("@/assets/fonts/SF-Pro-Display-Medium.otf"),
    "SFProDisplay-Light": require("@/assets/fonts/SF-Pro-Display-Light.otf"),
    "SFProDisplay-Thin": require("@/assets/fonts/SF-Pro-Display-Thin.otf"),
  });

  useEffect(() => {
    if (fontError) {
      console.error("Font loading error:", fontError);
    }
    if (fontsLoaded) {
      console.log("Fonts loaded successfully!");
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

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
