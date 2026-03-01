import { TextColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  Keyboard,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
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
    <View className={`flex-row items-center bg-grey-light px-6 py-5 rounded-xl`}>
      <View className="p-0">
        <Image
          source={require("@/assets/images/search.svg")}
          style={{ tintColor: TextColors.grey, width: 16, height: 16 }}
        />
      </View>
      <TextInput
        className="flex-1 ml-3 text-base text-text-black"
        placeholder={placeholder}
        placeholderTextColor={TextColors.grey}
        onChangeText={handleChange}
        returnKeyType="search"
        style={{
          paddingVertical: 0,
          includeFontPadding: false,
          lineHeight: 0,
          textAlignVertical: Platform.OS === "android" ? "top" : undefined,
        }}
        value={localValue}
      />
      {localValue.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          activeOpacity={0.6}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <Ionicons name="close" size={16} color={TextColors.grey} />
        </TouchableOpacity>
      )}
    </View>
  );
}
