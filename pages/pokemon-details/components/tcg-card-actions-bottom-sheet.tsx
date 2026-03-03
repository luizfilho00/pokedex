import { GreyColors, TextColors } from "@/constants/theme";
import { useSaveImageToGallery } from "@/shared/hooks/use-save-image-to-gallery";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TcgCardActionsBottomSheetProps {
  imageUrl: string;
  filename: string;
}

export const TcgCardActionsBottomSheet = forwardRef<
  BottomSheet,
  TcgCardActionsBottomSheetProps
>(function TcgCardActionsBottomSheet({ imageUrl, filename }, ref) {
  const insets = useSafeAreaInsets();
  const { save, isSaving } = useSaveImageToGallery(imageUrl, filename);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const handleSave = useCallback(async () => {
    await save();
    (ref as React.RefObject<BottomSheet>)?.current?.close();
  }, [save, ref]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#C4C4C4", width: 40 }}
      backgroundStyle={{
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: TextColors.white,
      }}
    >
      <BottomSheetView
        style={{ paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}
      >
        <TouchableOpacity
          className="mt-4 h-14 flex-row rounded-2xl justify-center items-center gap-2"
          style={{ backgroundColor: GreyColors.light }}
          onPress={handleSave}
          activeOpacity={0.7}
          disabled={isSaving}
          accessibilityRole="button"
          accessibilityLabel={isSaving ? "Saving image" : "Save to Gallery"}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={TextColors.grey} />
          ) : (
            <Ionicons
              name="download-outline"
              size={20}
              color={TextColors.grey}
            />
          )}
          <Text
            className="text-base font-semibold"
            style={{ color: TextColors.grey }}
          >
            {isSaving ? "Saving..." : "Save to Gallery"}
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
});
