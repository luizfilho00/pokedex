import { LightColors } from "@/constants/theme";
import { computeHasActiveFilters } from "@/features/filter-pokemon-list";
import { Ionicons } from "@expo/vector-icons";
import { memo, useMemo } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { usePokemonListContext } from "../context/pokemon-list-context";

export const ClearFiltersPill = memo(function ClearFiltersPill() {
  const { filters, clearFilters } = usePokemonListContext();

  const hasActiveFilters = useMemo(() => computeHasActiveFilters(filters), [filters]);

  if (!hasActiveFilters) return null;

  return (
    <View className="items-end mt-2">
      <TouchableOpacity
        onPress={clearFilters}
        activeOpacity={0.6}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: LightColors.primary,
          borderRadius: 999,
          paddingVertical: 4,
          paddingHorizontal: 10,
          gap: 4,
        }}
      >
        <Ionicons name="close" size={12} color="white" />
        <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
          Clear filters
        </Text>
      </TouchableOpacity>
    </View>
  );
});
