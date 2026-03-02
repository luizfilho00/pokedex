import { TcgCard } from "@/entities/tcg-card";
import { useLoadTcgCards } from "@/features/load-tcg-cards";
import { AppFonts } from "@/shared/ui/fonts";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { TcgCardThumbnail } from "./tcg-card-thumbnail";
import { TcgCardFullscreenViewer } from "./tcg-card-fullscreen-viewer";

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

  const handleCardPress = useCallback((card: TcgCard) => {
    setSelectedCard(card);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setSelectedCard(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: TcgCard }) => (
      <TcgCardThumbnail card={item} onPress={handleCardPress} />
    ),
    [handleCardPress],
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

  if (!cards || cards.length === 0) {
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
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color={typeColor} style={{ marginHorizontal: 12 }} />
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
