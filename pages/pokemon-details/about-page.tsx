import { Badge } from "@/components/ui/badge";
import { TextColors } from "@/constants/theme";
import { FairyType, FlyingType, Pokemon } from "@/entities/pokemon";
import { AppFonts } from "@/shared/ui/fonts";
import { View, Text } from "react-native";

export default function AboutPage({ pokemon }: { pokemon: Pokemon }) {
  return (
    <View
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
      >{`Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun's rays, the seed grows progressively larger.`}</Text>
      {/* Create a custom view of this */}
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
        {/* With a list map of this */}
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
            Seed Pokémon
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
            <Badge
              image={pokemon!.types[1].icon}
              label={""}
              backgroundColor={pokemon!.types[1].foregroundColor}
            />
            <Badge
              image={pokemon!.types[0].icon}
              label={""}
              backgroundColor={pokemon!.types[0].foregroundColor}
            />
            <Badge
              image={pokemon!.types[1].icon}
              label={""}
              backgroundColor={pokemon!.types[1].foregroundColor}
            />
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
            <Text
              style={{
                fontFamily: AppFonts.medium,
                color: new FlyingType().foregroundColor,
                fontSize: 16,
              }}
            >
              {`♀ 87.5%, `}
            </Text>
            <Text
              style={{
                fontFamily: AppFonts.medium,
                color: new FairyType().foregroundColor,
                fontSize: 16,
              }}
            >
              {`♂ 12.5%`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
