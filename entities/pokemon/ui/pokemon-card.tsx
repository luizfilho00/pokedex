import { Badge } from "@/components/ui/badge";
import { TextColors } from "@/constants/theme";
import { Image as ExpoImage } from "expo-image";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Pokemon } from "../model/pokemon";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface PokemonCardProps {
  pokemon: Pokemon;
  onTap: (pokemonId: string) => void;
  className?: string;
}

export const PokemonCard = React.memo(function PokemonCard({
  pokemon,
  onTap,
  className,
}: PokemonCardProps) {
  const [imageLoadError, setImageLoadError] = useState(false);
  const scaleAnim = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const handlePressIn = () => {
    scaleAnim.value = withSpring(0.95);
  };
  const handlePressOut = () => {
    scaleAnim.value = withSpring(1);
  };

  return (
    <Pressable
      className={`relative ${className}`}
      onPress={() => onTap(pokemon.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={animatedStyle}>
        <View
          className="rounded-[10px] flex-row justify-between mt-6"
          style={{ backgroundColor: pokemon.types[0].backgroundColor }}
        >
          <View className="p-5 flex-1">
            <Text style={{ color: TextColors.number }} className="text-xs font-bold">
              {pokemon.id}
            </Text>
            <Text className="text-[26px] font-bold text-white" numberOfLines={1}>
              {pokemon.name}
            </Text>
            <View className="flex-row items-center self-start mt-1.5 gap-1.5">
              {pokemon.types.map((type, _) => (
                <Badge
                  key={`${pokemon.id}-${type.name}`}
                  image={type.icon}
                  label={type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                  backgroundColor={type.foregroundColor}
                />
              ))}
            </View>
          </View>
          <Image source={require("@/assets/images/pokeball_transparent.png")} />
        </View>
        <Image
          source={require("@/assets/images/card_pattern.png")}
          className="absolute left-[90px] top-[30px]"
        />
        <ExpoImage
          source={{ uri: pokemon.image }}
          placeholderContentFit="contain"
          style={{ width: 130, height: 130, position: "absolute", right: 10 }}
          cachePolicy="memory-disk"
          recyclingKey={pokemon.id}
          onError={() => setImageLoadError(true)}
          onLoad={() => setImageLoadError(false)}
        />
        {imageLoadError && (
          <Image
            source={require("@/assets/images/silhouette.png")}
            style={{ width: 130, height: 130, position: "absolute", right: 10 }}
          />
        )}
      </Animated.View>
    </Pressable>
  );
});
