import {
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";

interface BadgeProps {
  image: ImageSourcePropType;
  label: string;
  backgroundColor: string;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ image, label, backgroundColor, style }: BadgeProps) {
  return (
    <View
      style={[
        {
          width: "auto",
          alignSelf: "flex-start",
          backgroundColor: backgroundColor,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          padding: 6,
        },
        style,
      ]}
    >
      <Image
        source={image}
        style={{ width: 16, height: 16, tintColor: "white" }}
      />
      <Text
        style={{ color: "white", marginLeft: 6, fontSize: 12, fontWeight: 500 }}
      >
        {label}
      </Text>
    </View>
  );
}
