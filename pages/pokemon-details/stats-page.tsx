import { TextColors } from "@/constants/theme";
import { Pokemon, getTypeDefenses } from "@/entities/pokemon";
import { AppFonts } from "@/shared/ui/fonts";
import { View, Text, Image, ScrollView } from "react-native";

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
    <ScrollView
      style={{
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 32,
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: AppFonts.bold,
          color: primaryColor,
        }}
      >
        Base Stats
      </Text>

      <View style={{ marginTop: 16 }}>
        {pokemon.stats.map((stat) => {
          const label = STAT_LABELS[stat.name] ?? stat.name;
          const isHp = stat.name === "Hp";
          const { min, max } = computeMinMax(stat.baseStat, isHp);
          const ratio = stat.baseStat / 255;

          return (
            <View
              key={stat.name}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  width: 60,
                  fontFamily: AppFonts.medium,
                  color: TextColors.black,
                  fontSize: 12,
                }}
              >
                {label}
              </Text>
              <Text
                style={{
                  width: 36,
                  fontFamily: AppFonts.regular,
                  color: TextColors.grey,
                  fontSize: 14,
                  textAlign: "right",
                }}
              >
                {stat.baseStat}
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 4,
                  backgroundColor: "#E0E0E0",
                  borderRadius: 2,
                  marginHorizontal: 12,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${Math.round(ratio * 100)}%`,
                    height: "100%",
                    backgroundColor: primaryColor,
                    borderRadius: 2,
                  }}
                />
              </View>
              <Text
                style={{
                  width: 32,
                  fontFamily: AppFonts.regular,
                  color: TextColors.grey,
                  fontSize: 12,
                  textAlign: "right",
                }}
              >
                {min}
              </Text>
              <Text
                style={{
                  width: 32,
                  fontFamily: AppFonts.regular,
                  color: TextColors.grey,
                  fontSize: 12,
                  textAlign: "right",
                  marginLeft: 8,
                }}
              >
                {max}
              </Text>
            </View>
          );
        })}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 4,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#E0E0E0",
          }}
        >
          <Text
            style={{
              width: 60,
              fontFamily: AppFonts.bold,
              color: TextColors.black,
              fontSize: 12,
            }}
          >
            Total
          </Text>
          <Text
            style={{
              width: 36,
              fontFamily: AppFonts.bold,
              color: TextColors.black,
              fontSize: 14,
              textAlign: "right",
            }}
          >
            {total}
          </Text>
          <View style={{ flex: 1, marginHorizontal: 12 }} />
          <Text
            style={{
              width: 32,
              fontFamily: AppFonts.medium,
              color: TextColors.grey,
              fontSize: 12,
              textAlign: "right",
            }}
          >
            Min
          </Text>
          <Text
            style={{
              width: 32,
              fontFamily: AppFonts.medium,
              color: TextColors.grey,
              fontSize: 12,
              textAlign: "right",
              marginLeft: 8,
            }}
          >
            Max
          </Text>
        </View>
      </View>

      <Text
        style={{
          marginTop: 16,
          fontFamily: AppFonts.regular,
          color: TextColors.grey,
          fontSize: 10,
        }}
      >
        The ranges shown on the right are for a level 100 Pokémon. Minimum values are
        based on 0 EVs, 0 IVs and a hindering nature. Maximum values are based on 252 EVs,
        31 IVs and a beneficial nature.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontFamily: AppFonts.bold,
          color: primaryColor,
          marginTop: 30,
        }}
      >
        Type Defenses
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontFamily: AppFonts.regular,
          color: TextColors.grey,
          fontSize: 12,
        }}
      >
        The effectiveness of each type on {pokemon.name}.
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 16,
          gap: 8,
        }}
      >
        {defenses.map(({ type, multiplier }) => (
          <View
            key={type.name}
            style={{ alignItems: "center", width: 32, marginBottom: 8 }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 4,
                backgroundColor: type.backgroundColor,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={type.icon}
                style={{ width: 14, height: 14, tintColor: "white" }}
              />
            </View>
            <Text
              style={{
                marginTop: 4,
                fontFamily: AppFonts.medium,
                fontSize: 10,
                color: TextColors.black,
              }}
            >
              {formatMultiplier(multiplier)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
