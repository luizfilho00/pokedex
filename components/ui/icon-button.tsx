import { ImageSourcePropType, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { LightColors } from "@/constants/theme";

interface IconButtonProps {
  icon: ImageSourcePropType;
  onPress: () => void;
  size?: number;
  showIndicator?: boolean;
}

export function IconButton({
  icon,
  onPress,
  size = 25,
  showIndicator = false,
}: IconButtonProps) {
  return (
    <Pressable
      className="justify-center items-center active:opacity-50 p-2"
      onPress={onPress}
    >
      <Image source={icon} style={{ width: size, height: size }} contentFit="contain" />
      {showIndicator && (
        <View
          className="rounded-full border-2 border-gray-50"
          style={{
            position: "absolute",
            top: 8,
            right: 5,
            width: 8,
            height: 8,
            backgroundColor: LightColors.primary,
          }}
        />
      )}
    </Pressable>
  );
}
