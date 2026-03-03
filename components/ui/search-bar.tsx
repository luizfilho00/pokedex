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
import { useRef } from "react";

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
  const textInputRef = useRef<TextInput>(null);
  const handleClear = () => {
    Keyboard.dismiss();
    onSearch("");
  };

  return (
    <Pressable
      className={`flex-row items-center bg-grey-light px-6 py-5 rounded-xl`}
      onPress={() => textInputRef.current?.focus()}
    >
      <View className="p-0">
        <Image
          source={require("@/assets/images/search.svg")}
          style={{ tintColor: TextColors.grey, width: 16, height: 16 }}
        />
      </View>
      <TextInput
        ref={textInputRef}
        className="flex-1 ml-3 text-base text-text-black"
        placeholder={placeholder}
        placeholderTextColor={TextColors.grey}
        onChangeText={onSearch}
        returnKeyType="search"
        style={{
          paddingVertical: 0,
          includeFontPadding: false,
          lineHeight: Platform.OS === "android" ? undefined : 0,
          textAlignVertical: Platform.OS === "android" ? "center" : undefined,
        }}
        value={value}
      />
      {value.length > 0 && (
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
    </Pressable>
  );
}
