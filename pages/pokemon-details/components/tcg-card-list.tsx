import { TcgCard } from "@/entities/tcg-card";
import { useLoadTcgCards } from "@/features/load-tcg-cards";
import { AppFonts } from "@/shared/ui/fonts";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { TcgCardThumbnail } from "./tcg-card-thumbnail";
import { TcgCardFullscreenViewer } from "./tcg-card-fullscreen-viewer";

const CARD_HEIGHT = 140;

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
    setFailedIds((prev) => new Set([...prev, cardId]));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: TcgCard }) => (
      <TcgCardThumbnail card={item} onPress={handleCardPress} onError={handleCardError} />
    ),
    [handleCardPress, handleCardError],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (loading) {
    return (
      <View>
        <Text
          className="mt-[30px] text-base"
          style={{ fontFamily: AppFonts.bold, color: typeColor }}
        >
          TCG Cards
        </Text>
        <ActivityIndicator className="mt-4" color={typeColor} />
      </View>
    );
  }

  if (!visibleCards || visibleCards.length === 0) {
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
      <FlatList
        className="mt-3"
        data={visibleCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ width: 60, height: CARD_HEIGHT, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator color={typeColor} />
            </View>
          ) : null
        }
      />
      <TcgCardFullscreenViewer
        card={selectedCard}
        visible={selectedCard !== null}
        onClose={handleCloseViewer}
      />
    </View>
  );
});
