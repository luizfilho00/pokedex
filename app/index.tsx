import { IconButton } from "@/components/ui/icon-button";
import { PokemonCard } from "@/components/ui/pokemon-card";
import { SearchBar } from "@/components/ui/search-bar";
import { TextColors } from "@/constants/theme";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View style={{ flexDirection: "column" }}>
        <ImageBackground
          source={require("@/assets/images/gradient_pokeball.png")}
          style={{ height: 200 }}
        >
          <TopBarActions />
          <Text style={styles.header}>Pokédex</Text>
          <Text style={styles.description}>
            Search for Pokémon by name or using the National Pokédex number.
          </Text>
          <SearchBar
            onSearch={(text) => {}}
            placeholder="What Pokémon are you looking for?"
            style={styles.searchBar}
          />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

function TopBarActions() {
  return (
    <View style={styles.iconButtons}>
      <IconButton
        icon={require("@/assets/images/generation.png")}
        onPress={() => {}}
      />
      <IconButton
        icon={require("@/assets/images/sort.png")}
        onPress={() => {}}
      />
      <IconButton
        icon={require("@/assets/images/filter.png")}
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
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
    padding: 16,
    gap: 20,
  },
  searchBar: {
    marginTop: 24,
    marginBottom: 20,
    marginHorizontal: 32,
  },
});
