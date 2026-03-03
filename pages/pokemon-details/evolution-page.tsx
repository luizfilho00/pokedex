import { Pokemon } from "@/entities/pokemon";
import { EvolutionStage } from "@/entities/pokemon/model/pokemon";
import { AppFonts } from "@/shared/ui/fonts";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

function PokemonStageView({ stage }: { stage: EvolutionStage }) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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

function EvolutionRow({
  from,
  to,
}: {
  from: EvolutionStage;
  to: EvolutionStage;
}) {
  const triggerLabel = to.trigger
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
          <Text className="text-xs mt-1 text-text-black font-bold">
            ({triggerLabel})
          </Text>
        ) : null}
      </View>
      <PokemonStageView stage={to} />
    </View>
  );
}

function EvolutionTree({
  stage,
}: {
  stage: EvolutionStage;
}) {
  const children = stage.evolvesTo || [];

  if (children.length === 0) {
    return null;
  }

  return (
    <View>
      {children.map((evolution) => (
        <EvolutionRow key={`${stage.id}-${evolution.id}`} from={stage} to={evolution} />
      ))}
      {children.map((child) => (
        <EvolutionTree key={`sub-${child.id}`} stage={child} />
      ))}
    </View>
  );
}

export default function EvolutionPage({ pokemon }: { pokemon: Pokemon }) {
  const chain = pokemon.evolutionChain ?? [];
  const typeColor = pokemon.types[0].foregroundColor;

  if (chain.length === 0 || (chain.length === 1 && (chain[0].evolvesTo?.length ?? 0) === 0)) {
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
        <Text
          className="text-sm text-text-grey text-center mt-10"
          style={{ fontFamily: AppFonts.regular }}
        >
          No evolutions
        </Text>
      </ScrollView>
    );
  }

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

      {chain.map((stage) => (
        <EvolutionTree key={stage.id} stage={stage} />
      ))}
    </ScrollView>
  );
}
