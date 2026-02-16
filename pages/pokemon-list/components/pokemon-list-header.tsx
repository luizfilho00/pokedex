import { IconButton } from "@/components/ui/icon-button";
import { ImageBackground, Text, View } from "react-native";
import { useRenderCount } from "../hooks/use-render-count";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const PokemonListHeader = () => {
  useRenderCount("PokemonListHeader");

  return (
    <ImageBackground
      source={require("@/assets/images/gradient_pokeball.png")}
      imageStyle={{ height: "80%", width: "100%", resizeMode: "contain", position: "absolute", top: -30 }}
    >
      <TopBarActions />
      <Text className="text-[32px] font-bold px-4 text-text-black">Pokédex</Text>
      <Text className="text-base font-normal px-4 pt-2.5 text-text-grey">
        Search for Pokémon by name or using the National Pokédex number.
      </Text>
    </ImageBackground>
  );
};

function TopBarActions() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-row self-end px-4 gap-2" style={{ marginTop: insets.top }}>
      <IconButton icon={require("@/assets/images/generation.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/sort.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/filter.png")} onPress={() => {}} />
    </View>
  );
}
