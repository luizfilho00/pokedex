import { LightColors } from "@/constants/theme";
import { memo } from "react";
import { ActivityIndicator, Text } from "react-native";
import { useRenderCount } from "../hooks/use-render-count";
import { styles } from "../style";

interface PokemonListStateProps {
  loading: boolean;
  error: string | null;
}

export const PokemonListState = memo(function PokemonListState({
  loading,
  error,
}: PokemonListStateProps) {
  useRenderCount("PokemonListState");
  if (loading) {
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
});
