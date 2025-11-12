import { LightColors } from "@/constants/theme";
import { ActivityIndicator, Text } from "react-native";
import { styles } from "../style";
import { usePokemonProvider } from "../provider/pokemons-provider";

export function PokemonListState() {
  const { isLoading, error } = usePokemonProvider();
  if (isLoading) {
    return (
      <ActivityIndicator
        color={LightColors.primary}
        size="large"
        style={styles.progress}
      />
    );
  }
  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }
  return null;
}
