import { ALL_TYPES, type PokemonType } from "@/entities/pokemon";
import { LightColors, TextColors } from "@/constants/theme";
import { DEFAULT_FILTERS, type PokemonFilters } from "@/features/filter-pokemon-list";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RangeSlider } from "./range-slider";

const SORTED_TYPES = [...ALL_TYPES].sort((a, b) => a.name.localeCompare(b.name));

interface HeightOption {
  key: string;
  label: string;
  icon: any;
  backgroundColor: string;
  foregroundColor: string;
}

interface WeightOption {
  key: string;
  label: string;
  icon: any;
  backgroundColor: string;
  foregroundColor: string;
}

const HEIGHT_OPTIONS: HeightOption[] = [
  {
    key: "short",
    label: "Short",
    icon: require("@/assets/images/short.svg"),
    backgroundColor: "#FFC5E6",
    foregroundColor: "#FFC5E6",
  },
  {
    key: "medium",
    label: "Medium",
    icon: require("@/assets/images/medium.svg"),
    backgroundColor: "#AACBF1",
    foregroundColor: "#AACBF1",
  },
  {
    key: "tall",
    label: "Tall",
    icon: require("@/assets/images/tall.svg"),
    backgroundColor: "#B8D5CD",
    foregroundColor: "#B8D5CD",
  },
];

const WEIGHT_OPTIONS: WeightOption[] = [
  {
    key: "light",
    label: "Light",
    icon: require("@/assets/images/light.svg"),
    backgroundColor: "#99CD7C",
    foregroundColor: "#99CD7C",
  },
  {
    key: "normal",
    label: "Normal",
    icon: require("@/assets/images/normal-weight.svg"),
    backgroundColor: "#57B2DC",
    foregroundColor: "#57B2DC",
  },
  {
    key: "heavy",
    label: "Heavy",
    icon: require("@/assets/images/heavy.svg"),
    backgroundColor: "#5B9DAF",
    foregroundColor: "#5B9DAF",
  },
];

interface PokemonFilterBottomSheetProps {
  filters: PokemonFilters;
  onApply: (filters: PokemonFilters) => void;
}

export const PokemonFilterBottomSheet = forwardRef<
  BottomSheet,
  PokemonFilterBottomSheetProps
>(function PokemonFilterBottomSheet({ filters, onApply }, ref) {
  const insets = useSafeAreaInsets();
  const [localFilters, setLocalFilters] = useState<PokemonFilters>(filters);

  const snapPoints = useMemo(() => ["47%", "90%"], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === 0) {
        setLocalFilters(filters);
      }
    },
    [filters],
  );

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

  const toggleType = useCallback((typeName: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      types: prev.types.includes(typeName)
        ? prev.types.filter((t) => t !== typeName)
        : [...prev.types, typeName],
    }));
  }, []);

  const toggleWeakness = useCallback((typeName: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      weaknesses: prev.weaknesses.includes(typeName)
        ? prev.weaknesses.filter((t) => t !== typeName)
        : [...prev.weaknesses, typeName],
    }));
  }, []);

  const toggleHeight = useCallback((key: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      heights: prev.heights.includes(key)
        ? prev.heights.filter((h) => h !== key)
        : [...prev.heights, key],
    }));
  }, []);

  const toggleWeight = useCallback((key: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      weights: prev.weights.includes(key)
        ? prev.weights.filter((w) => w !== key)
        : [...prev.weights, key],
    }));
  }, []);

  const handleRangeChange = useCallback((min: number, max: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      numberRange: [min, max],
    }));
  }, []);

  const handleReset = useCallback(() => {
    setLocalFilters(DEFAULT_FILTERS);
  }, []);

  const handleApply = useCallback(() => {
    onApply(localFilters);
    (ref as React.RefObject<BottomSheet>)?.current?.close();
  }, [localFilters, onApply, ref]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}
      handleIndicatorStyle={{ backgroundColor: "#C4C4C4", width: 40 }}
      backgroundStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: "white" }}
    >
      <BottomSheetScrollView
        className="px-6 pt-2"
        style={{ paddingBottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[26px] font-bold text-text-black">Filters</Text>
        <Text className="text-sm text-text-grey mt-1 mb-4 leading-5">
          Use advanced search to explore Pokémon by type, weakness, height and
          more!
        </Text>

        <FilterSection title="Types">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2.5"
          >
            {SORTED_TYPES.map((type) => (
              <TypeChip
                key={type.name}
                type={type}
                selected={localFilters.types.includes(type.name)}
                onPress={() => toggleType(type.name)}
              />
            ))}
          </ScrollView>
        </FilterSection>

        <FilterSection title="Weaknesses">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2.5"
          >
            {SORTED_TYPES.map((type) => (
              <TypeChip
                key={type.name}
                type={type}
                selected={localFilters.weaknesses.includes(type.name)}
                onPress={() => toggleWeakness(type.name)}
              />
            ))}
          </ScrollView>
        </FilterSection>

        <FilterSection title="Heights">
          <View className="flex-row gap-2.5">
            {HEIGHT_OPTIONS.map((opt) => (
              <OptionChip
                key={opt.key}
                icon={opt.icon}
                backgroundColor={opt.backgroundColor}
                selected={localFilters.heights.includes(opt.key)}
                onPress={() => toggleHeight(opt.key)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Weights">
          <View className="flex-row gap-2.5">
            {WEIGHT_OPTIONS.map((opt) => (
              <OptionChip
                key={opt.key}
                icon={opt.icon}
                backgroundColor={opt.backgroundColor}
                selected={localFilters.weights.includes(opt.key)}
                onPress={() => toggleWeight(opt.key)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Number Range">
          <RangeSlider
            min={1}
            max={1100}
            lowValue={localFilters.numberRange[0]}
            highValue={localFilters.numberRange[1]}
            onValueChange={handleRangeChange}
          />
        </FilterSection>

        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            className="flex-1 h-14 rounded-xl bg-grey-light justify-center items-center"
            onPress={handleReset}
            activeOpacity={0.5}
          >
            <Text className="text-base font-semibold text-text-grey">Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 h-14 rounded-xl justify-center items-center"
            style={{ backgroundColor: LightColors.primary }}
            onPress={handleApply}
            activeOpacity={0.5}
          >
            <Text className="text-base font-semibold text-white">Apply</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-5">
      <Text className="text-base font-bold text-text-black mb-3">{title}</Text>
      {children}
    </View>
  );
}

const TypeChip = React.memo(function TypeChip({
  type,
  selected,
  onPress,
}: {
  type: PokemonType;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="items-center">
      <View
        className="w-[50px] h-[50px] rounded-full justify-center items-center"
        style={{
          backgroundColor: selected ? type.foregroundColor : "transparent",
        }}
      >
        <Image
          source={type.icon}
          style={{ tintColor: selected ? "white" : type.foregroundColor, width: 25, height: 25 }}
          contentFit="contain"
        />
      </View>
    </Pressable>
  );
});

const OptionChip = React.memo(function OptionChip({
  icon,
  backgroundColor,
  selected,
  onPress,
}: {
  icon: any;
  backgroundColor: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="items-center">
      <View
        className="w-[50px] h-[50px] rounded-full justify-center items-center"
        style={{
          backgroundColor: selected ? backgroundColor : "transparent",
        }}
      >
        <Image
          source={icon}
          style={{ tintColor: selected ? "white" : "#999", width: 25, height: 25 }}
          contentFit="contain"
        />
      </View>
    </Pressable>
  );
});
