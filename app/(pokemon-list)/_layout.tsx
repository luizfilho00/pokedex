import { PokemonListProvider } from "@/pages/pokemon-list";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokemonListLayout() {
  return (
    <SafeAreaView className="flex-1" edges={["bottom"]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <PokemonListProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "white",
              },
            }}
          />
        </Stack>
      </PokemonListProvider>
    </SafeAreaView>
  );
}
