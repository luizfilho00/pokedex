import { LightColors } from "@/constants/theme";
import { memo } from "react";
import { ActivityIndicator, Text } from "react-native";
import { useRenderCount } from "../hooks/use-render-count";

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
        className="flex-1 self-center"
      />
    );
  }
  if (error) {
    return <Text className="flex-1 self-center">Error: {error}</Text>;
  }
  return null;
});
