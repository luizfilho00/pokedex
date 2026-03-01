import { LightColors } from "@/constants/theme";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type SortOption = "smallest-first" | "largest-first" | "a-z" | "z-a";

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "smallest-first", label: "Smallest number first" },
  { key: "largest-first", label: "Highest number first" },
  { key: "a-z", label: "A-Z" },
  { key: "z-a", label: "Z-A" },
];

interface PokemonSortBottomSheetProps {
  sortOption: SortOption;
  onSelect: (option: SortOption) => void;
}

export const PokemonSortBottomSheet = forwardRef<
  BottomSheet,
  PokemonSortBottomSheetProps
>(function PokemonSortBottomSheet({ sortOption, onSelect }, ref) {
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
    (option: SortOption) => {
      onSelect(option);
      (ref as React.RefObject<BottomSheet>)?.current?.close();
    },
    [onSelect, ref],
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#C4C4C4", width: 40 }}
      backgroundStyle={{
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "white",
      }}
    >
      <BottomSheetView style={{ paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}>
        <Text className="text-[26px] font-bold text-text-black mt-2">Sort</Text>
        <Text className="text-sm text-text-grey mt-1 mb-6 leading-5">
          Sort Pokémons alphabetically or by National Pokédex number!
        </Text>

        <View className="gap-3">
          {SORT_OPTIONS.map((option) => {
            const isSelected = sortOption === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                className="h-14 rounded-2xl justify-center items-center"
                style={{
                  backgroundColor: isSelected ? LightColors.primary : "#F2F2F2",
                }}
                onPress={() => handleSelect(option.key)}
                activeOpacity={0.7}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: isSelected ? "white" : "#747476" }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});
