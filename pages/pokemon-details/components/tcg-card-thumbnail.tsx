import { TcgCard } from "@/entities/tcg-card";
import { Image } from "expo-image";
import React from "react";
import { Pressable } from "react-native";

interface TcgCardThumbnailProps {
  card: TcgCard;
  onPress: (card: TcgCard) => void;
}

export const TcgCardThumbnail = React.memo(function TcgCardThumbnail({
  card,
  onPress,
}: TcgCardThumbnailProps) {
  return (
    <Pressable className="mr-3" onPress={() => onPress(card)}>
      <Image
        source={{ uri: `${card.imageUrl}/low.png` }}
        style={{ width: 100, height: 140, borderRadius: 8 }}
        contentFit="cover"
        cachePolicy="memory-disk"
        recyclingKey={card.id}
      />
    </Pressable>
  );
});
