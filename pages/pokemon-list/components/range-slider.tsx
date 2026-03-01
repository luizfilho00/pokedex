import { LightColors, TextColors } from "@/constants/theme";
import React, { useCallback } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface RangeSliderProps {
  min: number;
  max: number;
  lowValue: number;
  highValue: number;
  onValueChange: (low: number, high: number) => void;
}

const THUMB_SIZE = 28;
const TRACK_HEIGHT = 4;

export function RangeSlider({
  min,
  max,
  lowValue,
  highValue,
  onValueChange,
}: RangeSliderProps) {
  const sliderWidth = useSharedValue(0);
  const lowOffset = useSharedValue(0);
  const highOffset = useSharedValue(0);
  const lowStart = useSharedValue(0);
  const highStart = useSharedValue(0);

  const range = max - min;

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width;
      sliderWidth.value = width;
      lowOffset.value = ((lowValue - min) / range) * width;
      highOffset.value = ((highValue - min) / range) * width;
    },
    [lowValue, highValue, min, range, sliderWidth, lowOffset, highOffset],
  );

  const updateValues = useCallback(
    (lowPx: number, highPx: number, width: number) => {
      if (width === 0) return;
      const newLow = Math.round(min + (lowPx / width) * range);
      const newHigh = Math.round(min + (highPx / width) * range);
      onValueChange(
        Math.max(min, Math.min(newLow, max)),
        Math.max(min, Math.min(newHigh, max)),
      );
    },
    [min, max, range, onValueChange],
  );

  const lowGesture = Gesture.Pan()
    .onStart(() => {
      lowStart.value = lowOffset.value;
    })
    .onUpdate((e) => {
      const newVal = Math.max(
        0,
        Math.min(lowStart.value + e.translationX, highOffset.value - THUMB_SIZE),
      );
      lowOffset.value = newVal;
      runOnJS(updateValues)(newVal, highOffset.value, sliderWidth.value);
    });

  const highGesture = Gesture.Pan()
    .onStart(() => {
      highStart.value = highOffset.value;
    })
    .onUpdate((e) => {
      const newVal = Math.max(
        lowOffset.value + THUMB_SIZE,
        Math.min(highStart.value + e.translationX, sliderWidth.value),
      );
      highOffset.value = newVal;
      runOnJS(updateValues)(lowOffset.value, newVal, sliderWidth.value);
    });

  const lowThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: lowOffset.value - THUMB_SIZE / 2 }],
  }));

  const highThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: highOffset.value - THUMB_SIZE / 2 }],
  }));

  const activeTrackStyle = useAnimatedStyle(() => ({
    left: lowOffset.value,
    width: highOffset.value - lowOffset.value,
  }));

  return (
    <View style={{ paddingHorizontal: THUMB_SIZE / 2 }} className="pt-2">
      <View className="justify-center" style={{ height: THUMB_SIZE }} onLayout={handleLayout}>
        <View className="bg-grey-medium" style={{ height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2 }} />
        <Animated.View
          className="absolute"
          style={[
            {
              height: TRACK_HEIGHT,
              backgroundColor: LightColors.primary,
              borderRadius: TRACK_HEIGHT / 2,
            },
            activeTrackStyle,
          ]}
        />
        <GestureDetector gesture={lowGesture}>
          <Animated.View
            className="absolute bg-white border-[3px]"
            style={[
              {
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: THUMB_SIZE / 2,
                borderColor: LightColors.primary,
                top: 0,
              },
              lowThumbStyle,
            ]}
          />
        </GestureDetector>
        <GestureDetector gesture={highGesture}>
          <Animated.View
            className="absolute bg-white border-[3px]"
            style={[
              {
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: THUMB_SIZE / 2,
                borderColor: LightColors.primary,
                top: 0,
              },
              highThumbStyle,
            ]}
          />
        </GestureDetector>
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-sm" style={{ color: TextColors.grey }}>{lowValue}</Text>
        <Text className="text-sm" style={{ color: TextColors.grey }}>{highValue}</Text>
      </View>
    </View>
  );
}
