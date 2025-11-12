import { IconButton } from "@/components/ui/icon-button";
import { SearchBar } from "@/components/ui/search-bar";
import { ImageBackground, Text, View } from "react-native";
import { styles } from "../style";

interface PokemonListHeaderProps {
  onSearch: (name: string) => void;
}

export function PokemonListHeader({ onSearch }: PokemonListHeaderProps) {
  return (
    <ImageBackground
      source={require("@/assets/images/gradient_pokeball.png")}
      imageStyle={styles.imageBackground}
    >
      <TopBarActions />
      <Text style={styles.headerText}>Pokédex</Text>
      <Text style={styles.description}>
        Search for Pokémon by name or using the National Pokédex number.
      </Text>
      <SearchBar
        onSearch={onSearch}
        placeholder="What Pokémon are you looking for?"
        style={styles.searchBar}
      />
    </ImageBackground>
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
