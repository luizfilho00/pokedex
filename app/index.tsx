import { PokemonListPage } from "@/pages/pokemon-list";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <PokemonListPage />
    </SafeAreaView>
  );
}
