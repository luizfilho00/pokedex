import { TcgCard } from "@/entities/tcg-card";
import { useLoadTcgCards } from "@/features/load-tcg-cards";
import { AppFonts } from "@/shared/ui/fonts";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { TcgCardThumbnail } from "./tcg-card-thumbnail";
import { TcgCardFullscreenViewer } from "./tcg-card-fullscreen-viewer";

const CARD_WIDTH = 100;
const CARD_HEIGHT = 140;
const CARD_MARGIN_RIGHT = 12;
const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN_RIGHT;

const footerStyle = {
  width: 60,
  height: CARD_HEIGHT,
  justifyContent: "center" as const,
  alignItems: "center" as const,
};

interface TcgCardListProps {
  pokemonName: string;
  typeColor: string;
}

export const TcgCardList = React.memo(function TcgCardList({
  pokemonName,
  typeColor,
}: TcgCardListProps) {
  const { cards, loading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLoadTcgCards({ pokemonName });
  const [selectedCard, setSelectedCard] = useState<TcgCard | null>(null);
  const [failedIds, setFailedIds] = useState<ReadonlySet<string>>(new Set());

  const visibleCards = useMemo(
    () => cards?.filter((card) => !failedIds.has(card.id)) ?? null,
    [cards, failedIds],
  );

  const handleCardPress = useCallback((card: TcgCard) => {
    setSelectedCard(card);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setSelectedCard(null);
  }, []);

  const handleCardError = useCallback((cardId: string) => {
    setFailedIds((prev) => {
      if (prev.has(cardId)) return prev;
      const next = new Set(prev);
      next.add(cardId);
      return next;
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: TcgCard }) => (
      <TcgCardThumbnail card={item} onPress={handleCardPress} onError={handleCardError} />
    ),
    [handleCardPress, handleCardError],
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<TcgCard> | null | undefined, index: number) => ({
      length: CARD_TOTAL_WIDTH,
      offset: CARD_TOTAL_WIDTH * index,
      index,
    }),
    [],
  );

  const listGesture = useMemo(() => Gesture.Native(), []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!loading && (!visibleCards || visibleCards.length === 0)) {
    return null;
  }

  return (
    <View>
      <Text
        className="mt-[30px] text-base"
        style={{ fontFamily: AppFonts.bold, color: typeColor }}
      >
        TCG Cards
      </Text>
      {loading ? (
        <ActivityIndicator className="mt-4" color={typeColor} />
      ) : (
        <GestureDetector gesture={listGesture}>
          <FlatList
            className="mt-3"
            data={visibleCards}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            getItemLayout={getItemLayout}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={footerStyle}>
                  <ActivityIndicator color={typeColor} />
                </View>
              ) : null
            }
          />
        </GestureDetector>
      )}
      <TcgCardFullscreenViewer
        card={selectedCard}
        onClose={handleCloseViewer}
      />
    </View>
  );
});
