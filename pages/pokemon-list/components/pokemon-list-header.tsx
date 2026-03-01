import { IconButton } from "@/components/ui/icon-button";
import { Image, ImageBackground, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePokemonListContext } from "../context/pokemon-list-context";
import { useCallback } from "react";
import type { LayoutChangeEvent } from "react-native";

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
  const { openFilterSheet, hasAppliedFilters } = usePokemonListContext();

  return (
    <View className="flex-row self-end px-4 gap-2">
      <IconButton icon={require("@/assets/images/generation.png")} onPress={() => {}} />
      <IconButton icon={require("@/assets/images/sort.png")} onPress={() => {}} />
      <Pressable
        onPress={openFilterSheet}
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: hasAppliedFilters ? "#EA5D60" : "transparent" }}
      >
        <Image
          source={require("@/assets/images/filter.png")}
          style={{
            width: 25,
            height: 25,
            tintColor: hasAppliedFilters ? "#FFFFFF" : "#17171B",
          }}
        />
      </Pressable>
    </View>
  );
}
