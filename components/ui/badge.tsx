import {
  Image,
  ImageSourcePropType,
  Text,
  View,
} from "react-native";

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
        className="w-4 h-4"
        style={{ tintColor: "white" }}
      />
      <Text className="text-white ml-1.5 text-xs font-medium">
        {label}
      </Text>
    </View>
  );
}
