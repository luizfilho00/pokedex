import { TextColors } from "@/constants/theme";
import { Pokemon } from "@/entities/pokemon";
import { AppFonts } from "@/shared/ui/fonts";
import { View, Text } from "react-native";

export default function StatsPage({ pokemon }: { pokemon: Pokemon }) {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 32,
        flex: 1,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: AppFonts.bold,
            color: pokemon.types[0].foregroundColor,
          }}
        >
          Pokédex Data
        </Text>
        {pokemon.stats.map((stat) => (
          <View
            key={stat.name}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 24,
              marginTop: 20,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: AppFonts.medium,
                color: TextColors.black,
                fontSize: 12,
              }}
            >
              {stat.name}
            </Text>
            <Text
              style={{
                fontFamily: AppFonts.regular,
                color: TextColors.grey,
                fontSize: 16,
              }}
            >
              {stat.baseStat}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
