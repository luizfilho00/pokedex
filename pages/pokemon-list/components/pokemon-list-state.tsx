import { LightColors } from "@/constants/theme";
import { ActivityIndicator, Text } from "react-native";
import { styles } from "../style";

interface PokemonListStateProps {
  loading: boolean;
  error: string | null;
}

export function PokemonListState({ loading, error }: PokemonListStateProps) {
  if (loading) {
    return <ActivityIndicator color={LightColors.primary} size="large" style={styles.progress} />;
  }
  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }
  return null;
}
