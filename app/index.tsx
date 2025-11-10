import { IconButton } from "@/components/ui/icon-button";
import { SearchBar } from "@/components/ui/search-bar";
import { TextColors } from "@/constants/theme";
import PokemonsProvider, { usePokemonsProvider } from "@/features/pokemons/provider/pokemons-provider";
import { PokemonList } from "@/features/pokemons/ui/pokemon-list";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <PokemonsProvider>
      <HomeComposer />
    </PokemonsProvider>
  );
}

function HomeComposer() {
  const { filter } = usePokemonsProvider();

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.header}>
        <ImageBackground
          source={require("@/assets/images/gradient_pokeball.png")}
          imageStyle={{
            height: "80%",
            width: "100%",
            resizeMode: "contain",
            position: "absolute",
            top: -30,
          }}
        >
          <TopBarActions />
          <Text style={styles.headerText}>Pokédex</Text>
          <Text style={styles.description}>
            Search for Pokémon by name or using the National Pokédex number.
          </Text>
          <SearchBar
            onSearch={filter}
            placeholder="What Pokémon are you looking for?"
            style={styles.searchBar}
          />
        </ImageBackground>
        <PokemonList />
      </View>
    </SafeAreaView>
  );
}

function TopBarActions() {
  return (
    <View style={styles.iconButtons}>
      <IconButton icon={require("@/assets/images/generation.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/sort.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/filter.png")} onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flex: 1,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    paddingHorizontal: 32,
    paddingTop: 35,
    color: TextColors.black,
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    paddingHorizontal: 32,
    paddingTop: 10,
    color: TextColors.grey,
  },
  iconButtons: {
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingHorizontal: 32,
    paddingTop: 48,
    gap: 8,
  },
  searchBar: {
    marginTop: 24,
    marginBottom: 20,
    marginHorizontal: 32,
  },
});
