import { Pokemon } from "@/entities/pokemon";
import { View, Text } from "react-native";

export default function EvolutionPage({ pokemon }: { pokemon: Pokemon }) {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 16,
        flex: 1,
      }}
    >
      <Text>Evolution Page</Text>
    </View>
  );
}