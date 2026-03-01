import { Pokemon, getTypeDefenses } from "@/entities/pokemon";
import { AppFonts } from "@/shared/ui/fonts";
import { View, Text, ScrollView } from "react-native";
import { Image } from "expo-image";

const STAT_LABELS: Record<string, string> = {
  Hp: "HP",
  Attack: "Attack",
  Defense: "Defense",
  "Special attack": "Sp. Atk",
  "Special defense": "Sp. Def",
  Speed: "Speed",
};

function computeMinMax(baseStat: number, isHp: boolean) {
  if (isHp) {
    return { min: 2 * baseStat + 110, max: 2 * baseStat + 204 };
  }
  return {
    min: Math.floor((2 * baseStat + 5) * 0.9),
    max: Math.floor((2 * baseStat + 99) * 1.1),
  };
}

function formatMultiplier(multiplier: number): string {
  if (multiplier === 1) return "";
  if (multiplier === 0.5) return "\u00BD";
  if (multiplier === 0.25) return "\u00BC";
  if (multiplier === 0) return "0";
  return String(multiplier);
}

export default function StatsPage({ pokemon }: { pokemon: Pokemon }) {
  const primaryColor = pokemon.types[0].foregroundColor;
  const total = pokemon.stats.reduce((sum, s) => sum + s.baseStat, 0);
  const defenses = getTypeDefenses(pokemon.types);

  return (
    <ScrollView className="bg-white rounded-t-[30px] flex-1 p-8">
      <Text
        className="text-base"
        style={{ fontFamily: AppFonts.bold, color: primaryColor }}
      >
        Base Stats
      </Text>

      <View className="mt-4">
        {pokemon.stats.map((stat) => {
          const label = STAT_LABELS[stat.name] ?? stat.name;
          const isHp = stat.name === "Hp";
          const { min, max } = computeMinMax(stat.baseStat, isHp);
          const ratio = stat.baseStat / 255;

          return (
            <View key={stat.name} className="flex-row items-center mb-3">
              <Text
                className="w-[60px] text-xs text-text-black"
                style={{ fontFamily: AppFonts.medium }}
              >
                {label}
              </Text>
              <Text
                className="w-9 text-sm text-text-grey text-right"
                style={{ fontFamily: AppFonts.regular }}
              >
                {stat.baseStat}
              </Text>
              <View className="flex-1 h-1 bg-grey-medium rounded-sm mx-3 overflow-hidden">
                <View
                  className="h-full rounded-sm"
                  style={{
                    width: `${Math.round(ratio * 100)}%`,
                    backgroundColor: primaryColor,
                  }}
                />
              </View>
              <Text
                className="w-8 text-xs text-text-grey text-right"
                style={{ fontFamily: AppFonts.regular }}
              >
                {min}
              </Text>
              <Text
                className="w-8 text-xs text-text-grey text-right ml-2"
                style={{ fontFamily: AppFonts.regular }}
              >
                {max}
              </Text>
            </View>
          );
        })}

        <View className="flex-row items-center mt-1 pt-3 border-t border-grey-medium">
          <Text
            className="w-[60px] text-xs text-text-black"
            style={{ fontFamily: AppFonts.bold }}
          >
            Total
          </Text>
          <Text
            className="w-9 text-sm text-text-black text-right"
            style={{ fontFamily: AppFonts.bold }}
          >
            {total}
          </Text>
          <View className="flex-1 mx-3" />
          <Text
            className="w-8 text-xs text-text-grey text-right"
            style={{ fontFamily: AppFonts.medium }}
          >
            Min
          </Text>
          <Text
            className="w-8 text-xs text-text-grey text-right ml-2"
            style={{ fontFamily: AppFonts.medium }}
          >
            Max
          </Text>
        </View>
      </View>

      <Text
        className="mt-4 text-[10px] text-text-grey"
        style={{ fontFamily: AppFonts.regular }}
      >
        The ranges shown on the right are for a level 100 Pokémon. Minimum values are
        based on 0 EVs, 0 IVs and a hindering nature. Maximum values are based on 252 EVs,
        31 IVs and a beneficial nature.
      </Text>

      <Text
        className="text-base mt-[30px]"
        style={{ fontFamily: AppFonts.bold, color: primaryColor }}
      >
        Type Defenses
      </Text>
      <Text
        className="mt-2 text-xs text-text-grey"
        style={{ fontFamily: AppFonts.regular }}
      >
        The effectiveness of each type on {pokemon.name}.
      </Text>

      <View className="flex-row flex-wrap mt-4 gap-2">
        {defenses.map(({ type, multiplier }) => (
          <View key={type.name} className="items-center w-8 mb-2">
            <View
              className="w-7 h-7 rounded items-center justify-center"
              style={{ backgroundColor: type.foregroundColor }}
            >
              <Image
                source={type.icon}
                style={{ tintColor: "white", width: 14, height: 14 }}
              />
            </View>
            <Text
              className="mt-1 text-[10px] text-text-black"
              style={{ fontFamily: AppFonts.medium }}
            >
              {formatMultiplier(multiplier)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
