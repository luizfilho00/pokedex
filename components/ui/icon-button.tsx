import { ImageSourcePropType, Pressable } from "react-native";
import { Image } from "expo-image";

interface IconButtonProps {
  icon: ImageSourcePropType;
  onPress: () => void;
  size?: number;
}

export function IconButton({ icon, onPress, size = 25 }: IconButtonProps) {
  return (
    <Pressable
      className="justify-center items-center active:opacity-50 p-2"
      onPress={onPress}
    >
      <Image source={icon} style={{ width: size, height: size }} contentFit="contain" />
    </Pressable>
  );
}
