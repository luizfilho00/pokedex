import { IconButton } from "@/components/ui/icon-button";
import { memo } from "react";
import { ImageBackground, Text, View } from "react-native";
import { useRenderCount } from "../hooks/use-render-count";
import { styles } from "../style";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const PokemonListHeader = memo(function PokemonListHeader() {
  useRenderCount("PokemonListHeader");

  return (
    <View>
      <ImageBackground
        source={require("@/assets/images/gradient_pokeball.png")}
        imageStyle={[styles.imageBackground]}
      >
        <TopBarActions />
        <Text style={styles.headerText}>Pokédex</Text>
        <Text style={styles.description}>
          Search for Pokémon by name or using the National Pokédex number.
        </Text>
      </ImageBackground>
    </View>
  );
});

function TopBarActions() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.iconButtons, { paddingTop: insets.top }]}>
      <IconButton icon={require("@/assets/images/generation.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/sort.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/filter.png")} onPress={() => {}} />
    </View>
  );
}
