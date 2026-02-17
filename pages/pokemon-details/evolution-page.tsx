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
    <View className="flex-row items-center justify-between mb-6">
      <PokemonStageView stage={from} />
      <View className="items-center flex-1">
        <Text className="text-xl text-text-grey">→</Text>
        {triggerLabel ? (
          <Text
            className="text-xs mt-1"
            style={{ fontFamily: AppFonts.medium, color: typeColor }}
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
    <View className="items-center w-[120px]">
      <View className="w-20 h-20 rounded-full bg-grey-light items-center justify-center">
        <Image
          source={{ uri: stage.image }}
          className="w-16 h-16"
          resizeMode="contain"
        />
      </View>
      <Text
        className="text-xs text-text-grey mt-2"
        style={{ fontFamily: AppFonts.regular }}
      >
        #{stage.id}
      </Text>
      <Text
        className="text-sm text-text-black mt-0.5"
        style={{ fontFamily: AppFonts.bold }}
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
      className="bg-white rounded-t-[30px] flex-1"
      contentContainerStyle={{ padding: 32 }}
    >
      <Text
        className="text-base mb-6"
        style={{ fontFamily: AppFonts.bold, color: typeColor }}
      >
        Evolution Chart
      </Text>

      {chain.length <= 1 ? (
        <Text
          className="text-sm text-text-grey text-center mt-10"
          style={{ fontFamily: AppFonts.regular }}
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
