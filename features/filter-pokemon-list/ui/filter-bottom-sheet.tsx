import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PokemonFilters } from "../lib/use-filter-pokemon-list";

const TYPES = [
  "bug", "dark", "dragon", "electric", "fairy", "fighting",
  "fire", "flying", "ghost", "grass", "ground", "ice",
  "normal", "poison", "psychic", "rock", "steel", "water"
] as const;

const HEIGHTS = ["short", "medium", "tall"] as const;
const WEIGHTS = ["light", "normal", "heavy"] as const;

const TYPE_COLORS: Record<string, string> = {
  bug: "#8CB230",
  dark: "#58575F",
  dragon: "#0F6AC0",
  electric: "#EED535",
  fairy: "#ED6EC7",
  fighting: "#D04164",
  fire: "#FD7D24",
  flying: "#748FC9",
  ghost: "#556AAE",
  grass: "#62B957",
  ground: "#DD7748",
  ice: "#61CEC0",
  normal: "#9DA0AA",
  poison: "#A552CC",
  psychic: "#EA5D60",
  rock: "#BAAB82",
  steel: "#417D9A",
  water: "#4A90DA",
};

const HEIGHT_COLORS: Record<string, string> = {
  short: TYPE_COLORS.fairy,
  medium: TYPE_COLORS.flying,
  tall: TYPE_COLORS.normal,
};

const WEIGHT_COLORS: Record<string, string> = {
  light: TYPE_COLORS.grass,
  normal: TYPE_COLORS.water,
  heavy: TYPE_COLORS.dark,
};

const svgs: Record<string, any> = {
  types: {
    bug: {
      default: require('@/assets/images/bug.svg'),
    },
    dark: {
      default: require('@/assets/images/dark.svg'),
    },
    dragon: {
      default: require('@/assets/images/dragon.svg'),
    },
    electric: {
      default: require('@/assets/images/electric.svg'),
    },
    fairy: {
      default: require('@/assets/images/fairy.svg'),
    },
    fighting: {
      default: require('@/assets/images/fighting.svg'),
    },
    fire: {
      default: require('@/assets/images/fire.svg'),
    },
    flying: {
      default: require('@/assets/images/flying.svg'),
    },
    ghost: {
      default: require('@/assets/images/ghost.svg'),
    },
    grass: {
      default: require('@/assets/images/grass.svg'),
    },
    ground: {
      default: require('@/assets/images/ground.svg'),
    },
    ice: {
      default: require('@/assets/images/ice.svg'),
    },
    normal: {
      default: require('@/assets/images/normal.svg'),
    },
    poison: {
      default: require('@/assets/images/poison.svg'),
    },
    psychic: {
      default: require('@/assets/images/psychic.svg'),
    },
    rock: {
      default: require('@/assets/images/rock.svg'),
    },
    steel: {
      default: require('@/assets/images/steel.svg'),
    },
    water: {
      default: require('@/assets/images/water.svg'),
    },
  },
  heights: {
    short: {
      default: require('@/assets/images/short.svg'),
    },
    medium: {
      default: require('@/assets/images/medium.svg'),
    },
    tall: {
      default: require('@/assets/images/tall.svg'),
    },
  },
  weights: {
    light: {
      default: require('@/assets/images/light.svg'),
    },
    normal: {
      default: require('@/assets/images/normal.svg'),
    },
    heavy: {
      default: require('@/assets/images/heavy.svg'),
    },
  },
};

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: PokemonFilters;
  onApply: (f: PokemonFilters) => void;
  onReset: () => void;
}

export function FilterBottomSheet({ visible, onClose, filters, onApply, onReset }: FilterBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [localFilters, setLocalFilters] = useState<PokemonFilters>(filters);

  useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  const toggleFilter = (category: keyof PokemonFilters, item: string) => {
    const list = localFilters[category] as string[];
    if (list.includes(item)) {
      setLocalFilters({ ...localFilters, [category]: list.filter(i => i !== item) });
    } else {
      setLocalFilters({ ...localFilters, [category]: [...list, item] });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <TouchableOpacity className="absolute inset-0 z-0" activeOpacity={1} onPress={onClose} />
        
        <View 
          className="bg-white rounded-t-3xl pt-2 px-8 pb-8 z-10 w-full" 
          style={{ paddingBottom: insets.bottom || 24, maxHeight: "90%" }}
        >
          <View className="items-center mb-6">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-2xl font-bold text-[#333333] mb-2">Filters</Text>
            <Text className="text-gray-500 mb-6">
              Use advanced search to explore Pokémon by type, weakness, height and more!
            </Text>

            {/* Types */}
            <Text className="text-base font-bold mb-3 mt-2 text-[#333333]">Types</Text>
            <View className="flex-row flex-wrap gap-x-3 gap-y-3 mb-6">
              {TYPES.map(t => {
                const isSelected = localFilters.types.includes(t);
                return (
                  <TouchableOpacity 
                    key={t} 
                    onPress={() => toggleFilter("types", t)}
                    className="rounded-full justify-center items-center"
                    style={{
                      backgroundColor: isSelected ? TYPE_COLORS[t] : "transparent",
                      paddingVertical: isSelected ? 14 : 0,
                      paddingHorizontal: isSelected ? 14 : 0,
                    }}
                  >
                    <Image 
                      source={svgs.types[t].default} 
                      style={{ 
                        width: 25, 
                        height: 25, 
                        tintColor: isSelected ? "white" : undefined 
                      }} 
                      contentFit="contain" 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Weaknesses */}
            <Text className="text-base font-bold mb-3 text-[#333333]">Weaknesses</Text>
            <View className="flex-row flex-wrap gap-x-3 gap-y-3 mb-6">
              {TYPES.map(t => {
                const isSelected = localFilters.weaknesses.includes(t);
                return (
                  <TouchableOpacity 
                    key={`weak-${t}`} 
                    onPress={() => toggleFilter("weaknesses", t)}
                    className="rounded-full justify-center items-center"
                    style={{
                      backgroundColor: isSelected ? TYPE_COLORS[t] : "transparent",
                      paddingVertical: isSelected ? 12 : 0,
                      paddingHorizontal: isSelected ? 14 : 0,
                    }}
                  >
                    <Image 
                      source={svgs.types[t].default} 
                      style={{ 
                        width: 25, 
                        height: 25, 
                        tintColor: isSelected ? "white" : undefined 
                      }} 
                      contentFit="contain" 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Heights */}
            <Text className="text-base font-bold mb-3 text-[#333333]">Heights</Text>
            <View className="flex-row gap-3 mb-6">
              {HEIGHTS.map(h => {
                const isSelected = localFilters.heights.includes(h);
                return (
                  <TouchableOpacity 
                    key={h} 
                    onPress={() => toggleFilter("heights", h)}
                    className="rounded-full justify-center items-center"
                    style={{
                      backgroundColor: isSelected ? HEIGHT_COLORS[h] : "transparent",
                      paddingVertical: isSelected ? 12 : 0,
                      paddingHorizontal: isSelected ? 14 : 0,
                    }}
                  >
                    <Image 
                      source={svgs.heights[h].default} 
                      style={{ 
                        width: 25, 
                        height: 25, 
                        tintColor: isSelected ? "white" : undefined 
                      }} 
                      contentFit="contain" 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Weights */}
            <Text className="text-base font-bold mb-3 text-[#333333]">Weights</Text>
            <View className="flex-row gap-3 mb-6">
              {WEIGHTS.map(w => {
                const isSelected = localFilters.weights.includes(w);
                return (
                  <TouchableOpacity 
                    key={w} 
                    onPress={() => toggleFilter("weights", w)}
                    className="rounded-full justify-center items-center"
                    style={{
                      backgroundColor: isSelected ? WEIGHT_COLORS[w] : "transparent",
                      paddingVertical: isSelected ? 12 : 0,
                      paddingHorizontal: isSelected ? 14 : 0,
                    }}
                  >
                    <Image 
                      source={svgs.weights[w].default} 
                      style={{ 
                        width: 25, 
                        height: 25, 
                        tintColor: isSelected ? "white" : undefined 
                      }} 
                      contentFit="contain" 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="flex-row mt-6 gap-4">
              <TouchableOpacity className="flex-1 py-4 bg-gray-100 rounded-[10px] items-center" onPress={() => { onReset(); onClose(); }}>
                <Text className="text-gray-500 font-semibold text-base">Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-4 bg-[#EA5D60] rounded-[10px] items-center" onPress={() => { onApply(localFilters); onClose(); }}>
                <Text className="text-white font-semibold text-base">Apply</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
