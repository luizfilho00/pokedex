import { LightColors, TextColors } from "@/constants/theme";
import type { PokemonAdvancedFilters } from "@/features/filter-pokemon-list";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PanResponder,
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type PanResponderGestureState,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PokemonFilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  filters: PokemonAdvancedFilters;
  rangeBounds: [number, number];
  onToggleType: (type: string) => void;
  onToggleWeakness: (type: string) => void;
  onSetHeight: (height: "short" | "medium" | "tall") => void;
  onSetWeight: (weight: "light" | "normal" | "heavy") => void;
  onSetNumberRange: (range: [number, number]) => void;
}

const TYPE_OPTIONS = [
  { key: "bug", icon: require("@/assets/images/bug.svg"), color: "#8CB230" },
  { key: "dark", icon: require("@/assets/images/dark.svg"), color: "#58575F" },
  { key: "dragon", icon: require("@/assets/images/dragon.svg"), color: "#0F6AC0" },
  { key: "electric", icon: require("@/assets/images/electric.svg"), color: "#EED535" },
  { key: "fairy", icon: require("@/assets/images/fairy.svg"), color: "#ED6EC7" },
  { key: "fighting", icon: require("@/assets/images/fighting.svg"), color: "#D04164" },
  { key: "fire", icon: require("@/assets/images/fire.svg"), color: "#FD7D24" },
  { key: "flying", icon: require("@/assets/images/flying.svg"), color: "#748FC9" },
  { key: "ghost", icon: require("@/assets/images/ghost.svg"), color: "#556AAE" },
  { key: "grass", icon: require("@/assets/images/grass.svg"), color: "#62B957" },
  { key: "ground", icon: require("@/assets/images/ground.svg"), color: "#DD7748" },
  { key: "ice", icon: require("@/assets/images/ice.svg"), color: "#61CEC0" },
  { key: "normal", icon: require("@/assets/images/normal.svg"), color: "#9DA0AA" },
  { key: "poison", icon: require("@/assets/images/poison.svg"), color: "#A552CC" },
  { key: "psychic", icon: require("@/assets/images/psychic.svg"), color: "#EA5D60" },
  { key: "rock", icon: require("@/assets/images/rock.svg"), color: "#BAAB82" },
  { key: "steel", icon: require("@/assets/images/steel.svg"), color: "#417D9A" },
  { key: "water", icon: require("@/assets/images/water.svg"), color: "#4A90DA" },
] as const;

const HEIGHT_OPTIONS = [
  { key: "short", icon: require("@/assets/images/short.svg"), color: "#F5B9E1" },
  { key: "medium", icon: require("@/assets/images/medium.svg"), color: "#A7BEE0" },
  { key: "tall", icon: require("@/assets/images/tall.svg"), color: "#A5AAB4" },
] as const;

const WEIGHT_OPTIONS = [
  { key: "light", icon: require("@/assets/images/light.svg"), color: "#9FCF8A" },
  { key: "normal", icon: require("@/assets/images/normal.svg"), color: "#79B0D8" },
  { key: "heavy", icon: require("@/assets/images/heavy.svg"), color: "#6F9FB1" },
] as const;

export const PokemonFilterBottomSheet = memo(function PokemonFilterBottomSheet({
  visible,
  onClose,
  onApply,
  onReset,
  filters,
  rangeBounds,
  onToggleType,
  onToggleWeakness,
  onSetHeight,
  onSetWeight,
  onSetNumberRange,
}: PokemonFilterBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);
  const minBound = rangeBounds[0];
  const maxBound = rangeBounds[1];
  const minValue = Math.max(minBound, Math.min(filters.numberRange[0], filters.numberRange[1]));
  const maxValue = Math.min(maxBound, Math.max(filters.numberRange[0], filters.numberRange[1]));

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0);
      return;
    }
    bottomSheetRef.current?.close();
  }, [visible]);

  const handleApply = () => {
    onApply();
    onClose();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleMinRangeChange = (value: number) => {
    const nextMin = Math.round(value);
    onSetNumberRange([Math.min(nextMin, maxValue), maxValue]);
  };

  const handleMaxRangeChange = (value: number) => {
    const nextMax = Math.round(value);
    onSetNumberRange([minValue, Math.max(nextMax, minValue)]);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onClose={onClose}
      backgroundStyle={{ backgroundColor: "#F4F4F4" }}
      handleIndicatorStyle={{ backgroundColor: "#D8D8D8", width: 64, height: 5 }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 16) }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[44px] leading-[44px] text-text-black font-bold">Filters</Text>
        <Text className="text-[26px] leading-[32px] text-text-grey mt-3 mb-6">
          Use advanced search to explore Pok&#233;mon by type, weakness, height and more!
        </Text>

        <FilterSection title="Types">
          <View className="flex-row flex-wrap gap-3">
            {TYPE_OPTIONS.map((option) => (
              <CircleIconButton
                key={option.key}
                icon={option.icon}
                iconColor={option.color}
                selected={filters.types.includes(option.key)}
                selectedColor={option.color}
                onPress={() => onToggleType(option.key)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Weaknesses">
          <View className="flex-row flex-wrap gap-3">
            {TYPE_OPTIONS.map((option) => (
              <CircleIconButton
                key={`weak-${option.key}`}
                icon={option.icon}
                iconColor={option.color}
                selected={filters.weaknesses.includes(option.key)}
                selectedColor={option.color}
                onPress={() => onToggleWeakness(option.key)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Heights">
          <View className="flex-row flex-wrap gap-3">
            {HEIGHT_OPTIONS.map((option) => (
              <CircleIconButton
                key={option.key}
                icon={option.icon}
                iconColor={option.color}
                selected={filters.height === option.key}
                selectedColor={option.color}
                onPress={() => onSetHeight(option.key)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Weights">
          <View className="flex-row flex-wrap gap-3">
            {WEIGHT_OPTIONS.map((option) => (
              <CircleIconButton
                key={option.key}
                icon={option.icon}
                iconColor={option.color}
                selected={filters.weight === option.key}
                selectedColor={option.color}
                onPress={() => onSetWeight(option.key)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Number Range">
          <Text className="text-sm text-text-grey mb-1">From #{minValue}</Text>
          <SingleThumbSlider
            minimumValue={minBound}
            maximumValue={maxValue}
            value={minValue}
            onValueChange={handleMinRangeChange}
          />
          <Text className="text-sm text-text-grey mb-1 mt-2">To #{maxValue}</Text>
          <SingleThumbSlider
            minimumValue={minValue}
            maximumValue={maxBound}
            value={maxValue}
            onValueChange={handleMaxRangeChange}
          />
          <View className="flex-row justify-between mt-1">
            <Text style={{ color: TextColors.grey }}>{minValue}</Text>
            <Text style={{ color: TextColors.grey }}>{maxValue}</Text>
          </View>
        </FilterSection>

        <View className="flex-row gap-3 mt-3">
          <Pressable
            className="flex-1 h-14 rounded-2xl items-center justify-center bg-[#E4E4E4]"
            onPress={onReset}
          >
            <Text className="text-text-grey text-xl font-medium">Reset</Text>
          </Pressable>
          <Pressable
            className="flex-1 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: LightColors.primary }}
            onPress={handleApply}
          >
            <Text className="text-white text-xl font-medium">Apply</Text>
          </Pressable>
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
    <View className="mb-6">
      <Text className="text-[30px] leading-[36px] text-text-black font-bold mb-3">{title}</Text>
      {children}
    </View>
  );
}

function CircleIconButton({
  icon,
  iconColor,
  selected,
  selectedColor,
  onPress,
}: {
  icon: number;
  iconColor: string;
  selected: boolean;
  selectedColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-12 h-12 rounded-full items-center justify-center"
      style={{
        backgroundColor: selected ? selectedColor : "transparent",
        opacity: selected ? 1 : 0.75,
        shadowColor: selectedColor,
        shadowOpacity: selected ? 0.28 : 0,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: selected ? 4 : 0,
      }}
    >
      <Image
        source={icon}
        style={{
          width: 24,
          height: 24,
          tintColor: selected ? "#FFFFFF" : iconColor,
        }}
        contentFit="contain"
      />
    </Pressable>
  );
}

function SingleThumbSlider({
  minimumValue,
  maximumValue,
  value,
  onValueChange,
}: {
  minimumValue: number;
  maximumValue: number;
  value: number;
  onValueChange: (value: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const startValueRef = useRef(value);
  const range = Math.max(1, maximumValue - minimumValue);
  const clampedValue = Math.max(minimumValue, Math.min(maximumValue, value));

  const valueToX = useCallback(
    (val: number) => {
      if (trackWidth <= 0) {
        return 0;
      }
      return ((val - minimumValue) / range) * trackWidth;
    },
    [minimumValue, range, trackWidth],
  );

  const xToValue = useCallback(
    (x: number) => {
      if (trackWidth <= 0) {
        return clampedValue;
      }
      const ratio = Math.max(0, Math.min(1, x / trackWidth));
      return Math.round(minimumValue + ratio * range);
    },
    [clampedValue, minimumValue, range, trackWidth],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_evt, gestureState) =>
          Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2,
        onPanResponderGrant: () => {
          startValueRef.current = clampedValue;
        },
        onPanResponderMove: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
          if (trackWidth <= 0) {
            return;
          }
          const startX = valueToX(startValueRef.current);
          onValueChange(xToValue(startX + gesture.dx));
        },
      }),
    [clampedValue, onValueChange, trackWidth, valueToX, xToValue],
  );

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const handleTrackPress = (event: GestureResponderEvent) => {
    onValueChange(xToValue(event.nativeEvent.locationX));
  };

  const thumbX = valueToX(clampedValue);

  return (
    <Pressable className="h-8 justify-center relative" onLayout={handleTrackLayout} onPress={handleTrackPress}>
      <View className="h-1 rounded-full bg-[#DCDCDC]" />
      <View
        className="absolute h-1 rounded-full"
        style={{
          width: thumbX,
          backgroundColor: LightColors.primary,
        }}
      />
      <View
        className="absolute -ml-2.5 w-5 h-5 rounded-full border-[3px] bg-white"
        style={{
          left: thumbX,
          borderColor: LightColors.primary,
        }}
        {...panResponder.panHandlers}
      />
    </Pressable>
  );
}
