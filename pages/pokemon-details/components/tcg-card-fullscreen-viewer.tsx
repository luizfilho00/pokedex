import { TcgCard } from "@/entities/tcg-card";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useRef } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { TcgCardActionsBottomSheet } from "./tcg-card-actions-bottom-sheet";

const CARD_SCALE_RATIO = 0.85;
const CARD_ASPECT_RATIO = 1.4;
const CARD_MARGIN_TOP_OFFSET = 8;
const LONG_PRESS_MIN_DURATION_MS = 300;
const CARD_PRESS_SCALE = 0.95;

interface TcgCardFullscreenViewerProps {
  card: TcgCard | null;
  onClose: () => void;
}

export const TcgCardFullscreenViewer = React.memo(
  function TcgCardFullscreenViewer({
    card,
    onClose,
  }: TcgCardFullscreenViewerProps) {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const cardWidth = width * CARD_SCALE_RATIO;
    const cardHeight = cardWidth * CARD_ASPECT_RATIO;
    const marginTop = insets.top + CARD_MARGIN_TOP_OFFSET;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const openBottomSheet = useCallback(() => {
      bottomSheetRef.current?.expand();
    }, []);

    const backgroundCloseGesture = useMemo(
      () => Gesture.Tap().onEnd(() => scheduleOnRN(onClose)),
      [onClose],
    );

    const tapScaleGesture = useMemo(
      () =>
        Gesture.Tap()
          .blocksExternalGesture(backgroundCloseGesture)
          .onBegin(() => {
            scale.value = withSpring(CARD_PRESS_SCALE);
          })
          .onFinalize(() => {
            scale.value = withSpring(1);
          }),
      [backgroundCloseGesture],
    );

    const longPressGesture = useMemo(
      () =>
        Gesture.LongPress()
          .minDuration(LONG_PRESS_MIN_DURATION_MS)
          .blocksExternalGesture(backgroundCloseGesture)
          .onBegin(() => {
            scale.value = withSpring(CARD_PRESS_SCALE);
          })
          .onStart(() => {
            scheduleOnRN(openBottomSheet);
          })
          .onFinalize(() => {
            scale.value = withSpring(1);
          }),
      [openBottomSheet, backgroundCloseGesture],
    );

    const cardGesture = useMemo(
      () => Gesture.Exclusive(longPressGesture, tapScaleGesture),
      [longPressGesture, tapScaleGesture],
    );

    if (!card) return null;

    const imageUrl = `${card.imageUrl}/high.webp`;
    const saveUrl = `${card.imageUrl}/high.png`;
    const filename = `${card.name}-${card.id}.png`;

    return (
      <Modal
        visible
        transparent
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <GestureHandlerRootView className="flex-1">
          <View className="flex-1 bg-black/85">
            <GestureDetector gesture={backgroundCloseGesture}>
              <View
                style={StyleSheet.absoluteFill}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Close fullscreen viewer"
              />
            </GestureDetector>
            <View
              className="flex-1 justify-center items-center"
              pointerEvents="box-none"
            >
              <GestureDetector gesture={cardGesture}>
                <Animated.View
                  style={animatedStyle}
                  accessible
                  accessibilityRole="image"
                  accessibilityLabel={card.name}
                  accessibilityHint="Long press to save to gallery"
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={{
                      width: cardWidth,
                      height: cardHeight,
                    }}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                </Animated.View>
              </GestureDetector>
            </View>
            <Pressable
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={onClose}
              className="absolute right-6 z-[4] active:opacity-60"
              style={{ top: marginTop }}
              accessibilityRole="button"
              accessibilityLabel="Close fullscreen viewer"
            >
              <Ionicons name="close" color="white" size={32} />
            </Pressable>
            <TcgCardActionsBottomSheet
              ref={bottomSheetRef}
              imageUrl={saveUrl}
              filename={filename}
            />
          </View>
        </GestureHandlerRootView>
      </Modal>
    );
  },
);
