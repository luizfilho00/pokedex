import {
  ImageSourcePropType,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";

interface BadgeProps {
  image: ImageSourcePropType;
  label?: string;
  backgroundColor: string;
  className?: string;
}

export function Badge({ image, label, backgroundColor, className }: BadgeProps) {
  return (
    <View
      className={`self-start rounded-lg flex-row items-center p-1.5 ${className ?? ""}`}
      style={{ backgroundColor }}
    >
      <Image
        source={image}
        style={{ tintColor: "white", width: 16, height: 16 }}
        contentFit="contain"
      />
      <Text className="text-white ml-1.5 text-xs font-medium">
        {label}
      </Text>
    </View>
  );
}
