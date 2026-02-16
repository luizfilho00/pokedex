import { TextColors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  TextInput,
  View,
} from "react-native";

interface SearchBarProps {
  onSearch: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search Pokémon",
  className,
}: SearchBarProps) {
  const [search, setSearch] = useState("");
  const handleClear = () => {
    Keyboard.dismiss();
    setSearch("");
    onSearch("");
  };
  const handleChange = (text: string) => {
    setSearch(text);
    onSearch(text);
  };
  return (
    <View className={`flex-row items-center bg-white rounded-[10px] px-3 h-12 shadow-sm ${className ?? ""}`}>
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
        value={search}
      />
      {search.length > 0 && (
        <Pressable onPress={handleClear} className="p-2">
          <Ionicons name="close" size={20} color={TextColors.grey} />
        </Pressable>
      )}
    </View>
  );
}
