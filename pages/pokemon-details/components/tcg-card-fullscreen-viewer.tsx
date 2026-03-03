import { TcgCard } from "@/entities/tcg-card";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useRef } from "react";
import {
  Modal,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TcgCardActionsBottomSheet } from "./tcg-card-actions-bottom-sheet";

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
    const cardWidth = width * 0.85;
    const cardHeight = cardWidth * 1.4;
    const marginTop = insets.top + 8;
    const bottomSheetRef = useRef<BottomSheet>(null);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const openBottomSheet = useCallback(() => {
      bottomSheetRef.current?.expand();
    }, []);

    const backgroundCloseGesture = useMemo(
      () => Gesture.Tap().onEnd(() => runOnJS(onClose)()),
      [onClose],
    );

    const longPressGesture = useMemo(
      () =>
        Gesture.LongPress()
          .minDuration(500)
          .onBegin(() => {
            scale.value = withSpring(0.95);
          })
          .onStart(() => {
            runOnJS(openBottomSheet)();
          })
          .onFinalize(() => {
            scale.value = withSpring(1);
          }),
      [openBottomSheet],
    );

    const tapCloseGesture = useMemo(
      () => Gesture.Tap().onEnd(() => runOnJS(onClose)()),
      [onClose],
    );

    const cardGesture = useMemo(
      () => Gesture.Exclusive(longPressGesture, tapCloseGesture),
      [longPressGesture, tapCloseGesture],
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
          <BottomSheetModalProvider>
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
              <TouchableOpacity
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={onClose}
                className="absolute right-6 z-[4]"
                style={{ top: marginTop }}
                accessibilityRole="button"
                accessibilityLabel="Close fullscreen viewer"
              >
                <Ionicons name="close" color="white" size={32} />
              </TouchableOpacity>
              <TcgCardActionsBottomSheet
                ref={bottomSheetRef}
                imageUrl={saveUrl}
                filename={filename}
              />
            </View>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </Modal>
    );
  },
);
