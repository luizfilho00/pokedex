import { TextColors } from "@/constants/theme";
import { Pokemon } from "@/entities/pokemon";
import { EvolutionStage } from "@/entities/pokemon/model/pokemon";
import { AppFonts } from "@/shared/ui/fonts";
import { View, Text, Image, ScrollView } from "react-native";

function EvolutionPair({
  from,
  to,
  typeColor,
}: {
  from: EvolutionStage;
  to: EvolutionStage;
  typeColor: string;
}) {
  const triggerLabel =
    to.minLevel != null
      ? `Level ${to.minLevel}`
      : to.trigger
        ? to.trigger
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : "";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
      }}
    >
      <PokemonStageView stage={from} />
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 20, color: TextColors.grey }}>→</Text>
        {triggerLabel ? (
          <Text
            style={{
              fontSize: 12,
              fontFamily: AppFonts.medium,
              color: typeColor,
              marginTop: 4,
            }}
          >
            ({triggerLabel})
          </Text>
        ) : null}
      </View>
      <PokemonStageView stage={to} />
    </View>
  );
}

function PokemonStageView({ stage }: { stage: EvolutionStage }) {
  return (
    <View style={{ alignItems: "center", width: 120 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#F5F5F5",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{ uri: stage.image }}
          style={{ width: 64, height: 64 }}
          resizeMode="contain"
        />
      </View>
      <Text
        style={{
          fontSize: 12,
          fontFamily: AppFonts.regular,
          color: TextColors.grey,
          marginTop: 8,
        }}
      >
        #{stage.id}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: AppFonts.bold,
          color: TextColors.black,
          marginTop: 2,
        }}
      >
        {stage.name}
      </Text>
    </View>
  );
}

export default function EvolutionPage({ pokemon }: { pokemon: Pokemon }) {
  const chain = pokemon.evolutionChain ?? [];
  const typeColor = pokemon.types[0].foregroundColor;

  return (
    <ScrollView
      style={{
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flex: 1,
      }}
      contentContainerStyle={{ padding: 32 }}
    >
      <Text
        style={{
          fontSize: 16,
          fontFamily: AppFonts.bold,
          color: typeColor,
          marginBottom: 24,
        }}
      >
        Evolution Chart
      </Text>

      {chain.length <= 1 ? (
        <Text
          style={{
            fontSize: 14,
            fontFamily: AppFonts.regular,
            color: TextColors.grey,
            textAlign: "center",
            marginTop: 40,
          }}
        >
          No evolutions
        </Text>
      ) : (
        chain.slice(0, -1).map((from, index) => (
          <EvolutionPair
            key={from.id}
            from={from}
            to={chain[index + 1]}
            typeColor={typeColor}
          />
        ))
      )}
    </ScrollView>
  );
}
