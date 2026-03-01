import { IconButton } from "@/components/ui/icon-button";
import { useCallback } from "react";
import type { LayoutChangeEvent } from "react-native";
import { ImageBackground, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePokemonListContext } from "../context/pokemon-list-context";

export const PokemonListHeader = () => {
  const insets = useSafeAreaInsets();
  const { headerHeight } = usePokemonListContext();

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      headerHeight.value = e.nativeEvent.layout.height;
    },
    [headerHeight],
  );

  return (
    <View onLayout={handleLayout}>
      <ImageBackground
        source={require("@/assets/images/gradient_pokeball_half.png")}
        imageStyle={{
          height: "80%",
          width: "100%",
          resizeMode: "contain",
          position: "absolute",
          top: -30,
        }}
      >
        <View style={{ marginTop: insets.top }}>
          <TopBarActions />
          <Text className="text-[32px] font-bold px-4 text-text-black">Pokédex</Text>
          <Text className="text-base font-normal px-4 pt-2.5 text-text-grey">
            Search for Pokémon by name or using the National Pokédex number.
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

function TopBarActions() {
  const { setIsFilterModalVisible } = usePokemonListContext();
  return (
    <View className="flex-row self-end px-4 gap-2">
      <IconButton icon={require("@/assets/images/generation.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/sort.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/filter.png")} onPress={() => setIsFilterModalVisible(true)} />
    </View>
  );
}
