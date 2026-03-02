import { LightColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { usePokemonListContext } from "../context/pokemon-list-context";

export const ClearFiltersPill = memo(function ClearFiltersPill() {
  const { clearFilters } = usePokemonListContext();

  return (
    <View className="items-end px-4 py-2 bg-white">
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
