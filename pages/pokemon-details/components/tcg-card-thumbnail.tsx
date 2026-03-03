import { TcgCard } from "@/entities/tcg-card";
import { GreyColors } from "@/constants/theme";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const CARD_WIDTH = 100;
const CARD_HEIGHT = 140;
const CARD_BORDER_RADIUS = 8;

interface TcgCardThumbnailProps {
  card: TcgCard;
  onPress: (card: TcgCard) => void;
  onError: (cardId: string) => void;
}

export const TcgCardThumbnail = React.memo(function TcgCardThumbnail({
  card,
  onPress,
  onError,
}: TcgCardThumbnailProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const shimmerOpacity = useSharedValue(1);

  useEffect(() => {
    if (!imageLoaded) {
      shimmerOpacity.value = withRepeat(withTiming(0.4, { duration: 700 }), -1, true);
    } else {
      cancelAnimation(shimmerOpacity);
      shimmerOpacity.value = 0;
    }
  }, [imageLoaded, shimmerOpacity]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  const handlePress = useCallback(() => {
    onPress(card);
  }, [card, onPress]);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    cancelAnimation(shimmerOpacity);
    onError(card.id);
  }, [card.id, onError, shimmerOpacity]);

  return (
    <Pressable className="mr-3" onPress={handlePress}>
      <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        {!imageLoaded && (
          <Animated.View
            style={[
              shimmerStyle,
              {
                position: "absolute",
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                borderRadius: CARD_BORDER_RADIUS,
                backgroundColor: GreyColors.medium,
              },
            ]}
          />
        )}
        <Image
          source={{ uri: `${card.imageUrl}/low.webp` }}
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: CARD_BORDER_RADIUS }}
          contentFit="cover"
          cachePolicy="memory-disk"
          recyclingKey={card.id}
          onLoad={handleLoad}
          onError={handleError}
        />
      </View>
    </Pressable>
  );
});
