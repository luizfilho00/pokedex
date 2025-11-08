import { Image, ImageSourcePropType, Pressable, StyleSheet } from "react-native";

interface IconButtonProps {
  icon: ImageSourcePropType;
  onPress: () => void;
  size?: number;
}

export function IconButton({ icon, onPress, size = 25 }: IconButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        { padding: size / 3 },
      ]}
      onPress={onPress}
    >
      <Image
        source={icon}
        style={{ width: size, height: size }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.5,
  },
});