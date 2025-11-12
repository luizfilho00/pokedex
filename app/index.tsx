import { PokemonListPage } from "@/pages/pokemon-list";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <PokemonListPage />
    </SafeAreaView>
  );
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
}
