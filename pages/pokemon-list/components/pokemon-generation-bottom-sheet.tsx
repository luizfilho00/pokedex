import { LightColors } from "@/constants/theme";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { forwardRef, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type Generation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null;

interface GenerationData {
  gen: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  label: string;
  starters: [any, any, any];
}

const GENERATIONS: GenerationData[] = [
  {
    gen: 1,
    label: "Generation I",
    starters: [
      require("@/assets/images/001.png"),
      require("@/assets/images/004.png"),
      require("@/assets/images/007.png"),
    ],
  },
  {
    gen: 2,
    label: "Generation II",
    starters: [
      require("@/assets/images/152.png"),
      require("@/assets/images/155.png"),
      require("@/assets/images/158.png"),
    ],
  },
  {
    gen: 3,
    label: "Generation III",
    starters: [
      require("@/assets/images/252.png"),
      require("@/assets/images/255.png"),
      require("@/assets/images/258.png"),
    ],
  },
  {
    gen: 4,
    label: "Generation IV",
    starters: [
      require("@/assets/images/387.png"),
      require("@/assets/images/390.png"),
      require("@/assets/images/393.png"),
    ],
  },
  {
    gen: 5,
    label: "Generation V",
    starters: [
      require("@/assets/images/495.png"),
      require("@/assets/images/498.png"),
      require("@/assets/images/501.png"),
    ],
  },
  {
    gen: 6,
    label: "Generation VI",
    starters: [
      require("@/assets/images/650.png"),
      require("@/assets/images/653.png"),
      require("@/assets/images/656.png"),
    ],
  },
  {
    gen: 7,
    label: "Generation VII",
    starters: [
      require("@/assets/images/722.png"),
      require("@/assets/images/725.png"),
      require("@/assets/images/728.png"),
    ],
  },
  {
    gen: 8,
    label: "Generation VIII",
    starters: [
      require("@/assets/images/810.png"),
      require("@/assets/images/813.png"),
      require("@/assets/images/816.png"),
    ],
  },
];

interface PokemonGenerationBottomSheetProps {
  generation: Generation;
  onSelect: (gen: Generation) => void;
}

export const PokemonGenerationBottomSheet = forwardRef<
  BottomSheet,
  PokemonGenerationBottomSheetProps
>(function PokemonGenerationBottomSheet({ generation, onSelect }, ref) {
  const insets = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const handleSelect = useCallback(
    (gen: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => {
      const next: Generation = generation === gen ? null : gen;
      onSelect(next);
      (ref as React.RefObject<BottomSheet>)?.current?.close();
    },
    [generation, onSelect, ref],
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={["45%"]}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#C4C4C4", width: 40 }}
      backgroundStyle={{
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "white",
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[26px] font-bold text-text-black mt-2">Generations</Text>
        <Text className="text-sm text-text-grey mt-1 mb-6 leading-5">
          Use search for generations to explore your Pokémon!
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {GENERATIONS.map((item) => (
            <GenerationCard
              key={item.gen}
              data={item}
              selected={generation === item.gen}
              onPress={handleSelect}
            />
          ))}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const GenerationCard = React.memo(function GenerationCard({
  data,
  selected,
  onPress,
}: {
  data: GenerationData;
  selected: boolean;
  onPress: (gen: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onPress(data.gen)}
      activeOpacity={0.75}
      style={{
        width: "47%",
        borderRadius: 16,
        backgroundColor: selected ? LightColors.primary : "#F2F2F2",
        overflow: "hidden",
        paddingBottom: 14,
        paddingTop: 20,
      }}
    >
      <Image
        source={require("@/assets/images/card_pattern_horizontal.png")}
        style={{ position: "absolute", top: 10, left: 16, width: 80, height: 35, tintColor: "#E5E5E5" }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        {data.starters.map((src, i) => (
          <Image
            key={i}
            source={src}
            style={{ width: 45, height: 45 }}
            contentFit="contain"
          />
        ))}
      </View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 13,
          fontWeight: "600",
          marginTop: 8,
          color: selected ? "white" : "#747476",
        }}
      >
        {data.label}
      </Text>
    </TouchableOpacity>
  );
});
