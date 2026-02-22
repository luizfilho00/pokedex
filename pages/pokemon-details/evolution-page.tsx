import { Pokemon } from "@/entities/pokemon";
import { EvolutionStage } from "@/entities/pokemon/model/pokemon";
import { AppFonts } from "@/shared/ui/fonts";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

function EvolutionPair({ from, to }: { from: EvolutionStage; to: EvolutionStage }) {
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
    <View className="flex-row items-center justify-between mb-8">
      <PokemonStageView stage={from} />
      <View className="items-center flex-1">
        <Text className="text-3xl text-text-grey/20">→</Text>
        {triggerLabel ? (
          <Text className="text-xs mt-1 text-text-black font-bold">({triggerLabel})</Text>
        ) : null}
      </View>
      <PokemonStageView stage={to} />
    </View>
  );
}

function PokemonStageView({ stage }: { stage: EvolutionStage }) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const [loadError, setLoadError] = useState(false);

  const handlePressIn = () => {
    scale.value = withSpring(0.85);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable
      className="items-center w-[100px]"
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() =>
        router.push({
          pathname: "/pokemon/details",
          params: { id: stage.id.toString() },
        })
      }
    >
      <Animated.View style={style}>
        <View
          style={{
            width: 100,
            height: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ExpoImage
            source={require("@/assets/images/gradient_pokeball.png")}
            style={{ width: 100, height: 100, position: "absolute" }}
            contentFit="contain"
          />
          <ExpoImage
            source={{ uri: stage.image }}
            style={{ width: 75, height: 75 }}
            placeholder={require("@/assets/images/silhouette.png")}
            placeholderContentFit="contain"
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </View>
        <Text
          className="text-xs text-text-grey text-center mt-2"
          style={{ fontFamily: AppFonts.regular }}
        >
          #{stage.id}
        </Text>
        <Text
          className="text-sm text-text-black text-center mt-0.5"
          style={{ fontFamily: AppFonts.bold }}
        >
          {stage.name}
        </Text>
      </Animated.View>
    </Pressable>
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
        chain
          .slice(0, -1)
          .map((from, index) => (
            <EvolutionPair key={from.id} from={from} to={chain[index + 1]} />
          ))
      )}
    </ScrollView>
  );
}
