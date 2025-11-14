import { StyleProp, ViewStyle } from "react-native";
import Svg, {
  Defs,
  Stop,
  LinearGradient as SvgLinearGradient,
  Text as SvgText,
} from "react-native-svg";

interface OutlinedTextProps {
  text: string;
  fontSize?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fontFamily?: string;
  x?: number;
  y?: number;
  style?: StyleProp<ViewStyle>;
}

export function OutlinedText({
  text,
  fontSize = 100,
  strokeColor = "white",
  strokeWidth = 2,
  fontFamily = "SFProDisplay-Bold",
  x = 0,
  y = fontSize,
  style,
}: OutlinedTextProps) {
  return (
    <Svg height={fontSize * 1.2} width="100%" style={style}>
      <Defs>
        <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      <SvgText
        fill="transparent"
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        fontSize={fontSize}
        fontFamily={fontFamily}
        x={"50%"}
        y={y}
        textAnchor="middle"
        letterSpacing={20}
      >
        {text}
      </SvgText>
    </Svg>
  );
}
