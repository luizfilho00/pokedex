import { IconButton } from "@/components/ui/icon-button";
import { PokemonCard } from "@/components/ui/pokemon-card";
import { SearchBar } from "@/components/ui/search-bar";
import { TextColors } from "@/constants/theme";
import {
  FireType,
  GrassType,
  PoisonType,
  WaterType,
} from "@/model/pokemon_type";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const pokemonList = [
  {
    name: "Bulbasaur",
    number: "#001",
    types: [new GrassType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
  {
    name: "Charmander",
    number: "#002",
    types: [new FireType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
  {
    name: "Squirtle",
    number: "#003",
    types: [new WaterType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
  {
    name: "Bulbasaur",
    number: "#004",
    types: [new GrassType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
  {
    name: "Charmander",
    number: "#005",
    types: [new FireType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
  {
    name: "Squirtle",
    number: "#006",
    types: [new WaterType(), new PoisonType()],
    image: require("@/assets/images/bulbasaur.png"),
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ImageBackground
        source={require("@/assets/images/gradient_pokeball.png")}
        style={{paddingTop: 32}}
      >
        <View style={styles.header}>
          <TopBarActions />
          <Text style={styles.headerText}>Pokédex</Text>
          <Text style={styles.description}>
            Search for Pokémon by name or using the National Pokédex number.
          </Text>
          <SearchBar
            onSearch={(text) => {}}
            placeholder="What Pokémon are you looking for?"
            style={styles.searchBar}
          />
        </View>
      </ImageBackground>
      <FlatList
        style={styles.list}
        data={pokemonList}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        keyExtractor={(item) => item.number}
        showsVerticalScrollIndicator={false}
      />
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
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "column",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    paddingHorizontal: 32,
    paddingTop: 35,
    color: TextColors.black,
  },
  list: {
    flex: 3,
    marginBottom: 16,
  },
});
