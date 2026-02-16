import { Badge } from "@/components/ui/badge";
import { TextColors } from "@/constants/theme";
import {
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { Pokemon } from "../model/pokemon";
import { AppFonts } from "@/shared/ui/fonts";

interface PokemonCardProps {
  pokemon: Pokemon;
  onTap: (pokemonId: string) => void;
  className?: string;
}

export function PokemonCard({ pokemon, onTap, className }: PokemonCardProps) {
  return (
    <View className={`relative ${className ?? ""}`}>
      <Pressable
        onPress={() => onTap(pokemon.id)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <View
          className="rounded-[10px] flex-row justify-between mt-6"
          style={{ backgroundColor: pokemon.types[0].backgroundColor }}
        >
          <View className="p-5">
            <Text
              style={{ color: TextColors.number }}
              className="text-xs font-bold"
            >
              {pokemon.id}
            </Text>
            <Text className="text-[26px] font-bold text-white">
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
        <Image
          source={{ uri: pokemon.image }}
          className="w-[130px] h-[130px] absolute right-[10px]"
        />
      </Pressable>
    </View>
  );
}
