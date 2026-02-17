import { Badge } from "@/components/ui/badge";
import { TextColors } from "@/constants/theme";
import { Pokemon } from "@/entities/pokemon";
import { AppFonts } from "@/shared/ui/fonts";
import { View, Text, ScrollView } from "react-native";

function formatGender(genderRate?: number) {
  if (genderRate == null || genderRate === -1) {
    return { isGenderless: true, femalePercent: 0, malePercent: 0 };
  }
  const femalePercent = (genderRate / 8) * 100;
  return { isGenderless: false, femalePercent, malePercent: 100 - femalePercent };
}

export default function AboutPage({ pokemon }: { pokemon: Pokemon }) {
  const { isGenderless, femalePercent, malePercent } = formatGender(pokemon.genderRate);

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 32,
        flex: 1,
        flexDirection: "column",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: TextColors.grey,
          fontFamily: AppFonts.regular,
        }}
      >
        {pokemon.description ?? ""}
      </Text>
      <View>
        <Text
          style={{
            marginTop: 30,
            fontSize: 16,
            fontFamily: AppFonts.bold,
            color: pokemon.types[0].foregroundColor,
          }}
        >
          Pokédex Data
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: AppFonts.medium,
              color: TextColors.black,
              fontSize: 12,
              flex: 1,
            }}
          >
            Species
          </Text>
          <Text
            style={{
              flex: 2,
              fontFamily: AppFonts.regular,
              color: TextColors.grey,
              fontSize: 16,
            }}
          >
            {pokemon.genus ?? ""}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: AppFonts.medium,
              color: TextColors.black,
              fontSize: 12,
              flex: 1,
            }}
          >
            Height
          </Text>
          <Text
            style={{
              flex: 2,
              fontFamily: AppFonts.regular,
              color: TextColors.grey,
              fontSize: 16,
            }}
          >
            {pokemon.height != null ? `${(pokemon.height / 10).toFixed(1)} m` : "—"}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: AppFonts.medium,
              color: TextColors.black,
              fontSize: 12,
              flex: 1,
            }}
          >
            Weight
          </Text>
          <Text
            style={{
              flex: 2,
              fontFamily: AppFonts.regular,
              color: TextColors.grey,
              fontSize: 16,
            }}
          >
            {pokemon.weight != null ? `${(pokemon.weight / 10).toFixed(1)} kg` : "—"}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: AppFonts.medium,
              color: TextColors.black,
              fontSize: 12,
              flex: 1,
            }}
          >
            Weakness
          </Text>
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              gap: 8,
            }}
          >
            {pokemon.types.map((type) => (
              <Badge
                key={`${pokemon.id}-${type.name}`}
                image={type.icon}
                label={""}
                backgroundColor={type.foregroundColor}
              />
            ))}
          </View>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: AppFonts.medium,
              color: TextColors.black,
              fontSize: 12,
              flex: 1,
            }}
          >
            Gender
          </Text>
          <View style={{ flexDirection: "row", flex: 2 }}>
            {isGenderless ? (
              <Text
                style={{
                  fontFamily: AppFonts.medium,
                  color: TextColors.grey,
                  fontSize: 16,
                }}
              >
                Genderless
              </Text>
            ) : (
              <>
                <Text
                  style={{
                    fontFamily: AppFonts.medium,
                    color: "#6C79DB",
                    fontSize: 16,
                  }}
                >
                  {`♂ ${malePercent}%, `}
                </Text>
                <Text
                  style={{
                    fontFamily: AppFonts.medium,
                    color: "#F0729F",
                    fontSize: 16,
                  }}
                >
                  {`♀ ${femalePercent}%`}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      <View>
        <Text
          style={{
            marginTop: 30,
            fontSize: 16,
            fontFamily: AppFonts.bold,
            color: pokemon.types[0].foregroundColor,
          }}
        >
          Training
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: AppFonts.medium,
              color: TextColors.black,
              fontSize: 12,
              flex: 1,
            }}
          >
            EV Yield
          </Text>
          <Text
            style={{
              flex: 2,
              fontFamily: AppFonts.regular,
              color: TextColors.grey,
              fontSize: 16,
            }}
          >
            {pokemon.stats
              .filter((s) => s.effort > 0)
              .map((s) => `${s.effort} ${s.name}`)
              .join(", ") || "—"}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: AppFonts.medium,
              color: TextColors.black,
              fontSize: 12,
              flex: 1,
            }}
          >
            Catch Rate
          </Text>
          <Text
            style={{
              flex: 2,
              fontFamily: AppFonts.regular,
              color: TextColors.grey,
              fontSize: 16,
            }}
          >
            {pokemon.catchRate ?? "—"}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: AppFonts.medium,
              color: TextColors.black,
              fontSize: 12,
              flex: 1,
            }}
          >
            Base Friendship
          </Text>
          <Text
            style={{
              flex: 2,
              fontFamily: AppFonts.regular,
              color: TextColors.grey,
              fontSize: 16,
            }}
          >
            {pokemon.baseHappiness ?? "—"}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: AppFonts.medium,
              color: TextColors.black,
              fontSize: 12,
              flex: 1,
            }}
          >
            Base Exp
          </Text>
          <Text
            style={{
              flex: 2,
              fontFamily: AppFonts.regular,
              color: TextColors.grey,
              fontSize: 16,
            }}
          >
            {pokemon.baseExperience ?? "—"}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 24, marginTop: 20 }}
        >
          <Text
            style={{
              fontFamily: AppFonts.medium,
              color: TextColors.black,
              fontSize: 12,
              flex: 1,
            }}
          >
            Growth Rate
          </Text>
          <Text
            style={{
              flex: 2,
              fontFamily: AppFonts.regular,
              color: TextColors.grey,
              fontSize: 16,
            }}
          >
            {pokemon.growthRate
              ? pokemon.growthRate
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")
              : "—"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
