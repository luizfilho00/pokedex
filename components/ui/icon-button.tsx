import { Image, ImageSourcePropType, Pressable } from "react-native";

interface IconButtonProps {
  icon: ImageSourcePropType;
  onPress: () => void;
  size?: number;
}

export function IconButton({ icon, onPress, size = 25 }: IconButtonProps) {
  return (
    <Pressable
      className="justify-center items-center active:opacity-50"
      style={{ padding: size / 3 }}
      onPress={onPress}
    >
      <Image
        source={icon}
        style={{ width: size, height: size }}
      />
    </Pressable>
  );
}
