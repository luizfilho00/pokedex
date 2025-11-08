import { TextColors } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { Image, Pressable, StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native";

interface SearchBarProps {
  onSearch: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export function SearchBar({
  onSearch,
  placeholder = "Search Pokémon",
  style,
}: SearchBarProps) {
  const [search, setSearch] = useState("");
  const handleClear = () => {
    setSearch("");
    onSearch("");
  };
  const handleChange = (text: string) => {
    setSearch(text);
    onSearch(text);
  };
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require("@/assets/images/search.png")}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={TextColors.grey}
        onChangeText={handleChange}
        value={search}
      />
      {search.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close" size={20} color={TextColors.grey} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: TextColors.grey,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: TextColors.black,
  },
  clearButton: {
    padding: 8,
  },
});
