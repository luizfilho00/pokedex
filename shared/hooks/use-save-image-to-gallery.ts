import { useState, useCallback, useRef } from "react";
import { File, Paths } from "expo-file-system/next";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

export function useSaveImageToGallery(imageUrl: string, filename: string) {
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  const save = useCallback(async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);

    const destination = new File(Paths.cache, filename);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync(false);
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to save images.",
        );
        return;
      }

      const downloaded = await File.downloadFileAsync(imageUrl, destination);
      await MediaLibrary.saveToLibraryAsync(downloaded.uri);

      Alert.alert("Saved", "Image saved to your gallery.");
    } catch {
      Alert.alert("Error", "Failed to save the image. Please try again.");
    } finally {
      destination.delete();
      savingRef.current = false;
      setIsSaving(false);
    }
  }, [imageUrl, filename]);

  return { save, isSaving };
}
