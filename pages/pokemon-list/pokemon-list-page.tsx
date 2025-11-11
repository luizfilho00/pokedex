import { IconButton } from "@/components/ui/icon-button";
import { SearchBar } from "@/components/ui/search-bar";
import { LightColors, TextColors } from "@/constants/theme";
import { PokemonCard } from "@/entities/pokemon";
import { useLoadPokemons } from "@/features/load-pokemons";
import { ActivityIndicator, FlatList, ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokemonListPage() {
  const { pokemons, loading, error, filterByName } = useLoadPokemons(10, 0);

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
            onSearch={filterByName}
            placeholder="What Pokémon are you looking for?"
            style={styles.searchBar}
          />
        </ImageBackground>
        {loading && (
          <ActivityIndicator
            color={LightColors.primary}
            size={"large"}
            style={styles.progress}
          />
        )}
        {error && <Text style={styles.error}>Error: {error}</Text>}
        {pokemons && (
          <FlatList
            style={styles.list}
            data={pokemons}
            renderItem={({ item }) => (
              <PokemonCard pokemon={item} style={styles.card} />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  list: {
    flex: 1,
    marginBottom: 16,
  },
  card: {
    marginVertical: 8,
  },
  error: {
    flex: 1,
    alignSelf: "center",
  },
  progress: {
    flex: 1,
    alignSelf: "center",
  },
});
