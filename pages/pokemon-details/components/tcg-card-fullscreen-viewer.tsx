import { TcgCard } from "@/entities/tcg-card";
import { Image } from "expo-image";
import React from "react";
import { Modal, Pressable, useWindowDimensions } from "react-native";

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
    const cardWidth = width * 0.85;
    const cardHeight = cardWidth * 1.4;

    if (!card) return null;

    return (
      <Modal
        visible
        transparent
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onPress={onClose}
        >
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
      </Modal>
    );
  },
);
