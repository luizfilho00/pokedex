import { FloatingScrollButton } from "@/components/ui/floating-scroll-button";
import { Toast } from "@/components/ui/toast";
import { LightColors } from "@/constants/theme";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { PokemonListHeader } from "./components/pokemon-list-header";
import { PokemonFilterBottomSheet } from "./components/pokemon-filter-bottom-sheet";
import { PokemonListItem } from "./components/pokemon-list-item";
import { usePokemonListContext } from "./context/pokemon-list-context";
import { usePokemonListData, type ListItem } from "./hooks/use-pokemon-list-data";
import { usePokemonListScroll } from "./hooks/use-pokemon-list-scroll";
import { usePokemonListToast } from "./hooks/use-pokemon-list-toast";

export default function PokemonListPage() {
  const {
    showScrollButton,
    loadPokemonsState,
    loadPokemonsActions,
    isFilterSheetVisible,
    closeFilterSheet,
    filterDraft,
    filterActions,
  } = usePokemonListContext();
  const { refList, handleScroll, scrollToTop } = usePokemonListScroll<ListItem>();
  const { listData, showFooterLoading } = usePokemonListData();
  const { toastMessage, dismissToast } = usePokemonListToast();

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => <PokemonListItem item={item} />,
    []);

  const rangeBounds = useMemo<[number, number]>(() => {
    const ids = (loadPokemonsState.pokemons ?? [])
      .map((pokemon) => Number(pokemon.id))
      .filter((value) => Number.isFinite(value));
    if (ids.length === 0) {
      return [1, 1025];
    }
    return [Math.min(...ids), Math.max(...ids)];
  }, [loadPokemonsState.pokemons]);

  return (
    <View className="flex-1">
      <FlashList
        className="flex-1"
        ref={refList}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemType={(item) => item.type}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        onScroll={handleScroll}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        ListHeaderComponent={<PokemonListHeader />}
        onEndReached={
          loadPokemonsState.endOfItems
            ? undefined
            : loadPokemonsActions.fetchNextPage
        }
        onEndReachedThreshold={0.2}
        scrollEventThrottle={16}
        ListFooterComponent={
          showFooterLoading ? (
            <ActivityIndicator color={LightColors.primary} size={24} className="p-2" />
          ) : null
        }
      />
      <FloatingScrollButton visible={showScrollButton} onPress={scrollToTop} />
      <Toast message={toastMessage} onDismiss={dismissToast} />
      <PokemonFilterBottomSheet
        visible={isFilterSheetVisible}
        onClose={closeFilterSheet}
        onApply={filterActions.applyFilters}
        onReset={filterActions.resetDraftFilters}
        filters={filterDraft}
        rangeBounds={rangeBounds}
        onToggleType={filterActions.toggleType}
        onToggleWeakness={filterActions.toggleWeakness}
        onSetHeight={filterActions.setHeight}
        onSetWeight={filterActions.setWeight}
        onSetNumberRange={filterActions.setNumberRange}
      />
    </View>
  );
}
