import { TextColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, Keyboard, Platform, Pressable, TextInput, View } from "react-native";
import { useEffect, useState } from "react";

interface SearchBarProps {
  value?: string;
  onSearch: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value = "",
  onSearch,
  placeholder = "Search Pokémon",
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    Keyboard.dismiss();
    setLocalValue("");
    onSearch("");
  };
  const handleChange = (text: string) => {
    setLocalValue(text);
    onSearch(text);
  };
  return (
    <View
      className={`flex-row items-center bg-white rounded-[10px] px-3 h-12 shadow-sm overflow-visible ${className ?? ""}`}
      style={Platform.OS === "android" ? { elevation: 8 } : undefined}
    >
      <Image
        source={require("@/assets/images/search.png")}
        className="w-5 h-5"
        style={{ tintColor: TextColors.grey }}
      />
      <TextInput
        className="flex-1 ml-3 text-base text-text-black"
        placeholder={placeholder}
        placeholderTextColor={TextColors.grey}
        onChangeText={handleChange}
        returnKeyType="search"
        style={{
          includeFontPadding: false,
          paddingVertical: 0,
          ...(Platform.OS === "ios" && {
            paddingTop: 0,
            paddingBottom: 0,
            lineHeight: 20,
            height: 20,
          }),
        }}
        value={localValue}
      />
      {localValue.length > 0 && (
        <Pressable onPress={handleClear} className="p-2">
          <Ionicons name="close" size={20} color={TextColors.grey} />
        </Pressable>
      )}
    </View>
  );
}
