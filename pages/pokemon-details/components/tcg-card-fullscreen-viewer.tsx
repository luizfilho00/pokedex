import { TcgCard } from "@/entities/tcg-card";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  Modal,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TcgCardFullscreenViewerProps {
  card: TcgCard | null;
  onClose: () => void;
}

export const TcgCardFullscreenViewer = React.memo(function TcgCardFullscreenViewer({
  card,
  onClose,
}: TcgCardFullscreenViewerProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cardWidth = width * 0.85;
  const cardHeight = cardWidth * 1.4;
  const marginTop = insets.top + 8;

  if (!card) return null;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="relative flex-1 bg-black/85">
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={onClose}
          style={{
            position: "absolute",
            top: marginTop,
            right: 24,
            zIndex: 4,
          }}
        >
          <Ionicons name="close" color="white" size={32} />
        </TouchableOpacity>
        <Pressable className="flex-1 justify-center items-center" onPress={onClose}>
          <Pressable>
            <Image
              source={{ uri: `${card.imageUrl}/high.webp` }}
              style={{
                width: cardWidth,
                height: cardHeight,
              }}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
});
