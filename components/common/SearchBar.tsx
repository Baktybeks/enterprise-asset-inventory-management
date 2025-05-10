import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants/ionIcons";

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

const SearchBar = ({
  onSearch,
  placeholder = "Поиск товаров...",
  autoFocus = false,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
      <Image
        source={icons.search}
        className="w-5 h-5 mr-2"
        tintColor="#9CA3AF"
      />
      <TextInput
        value={query}
        onChangeText={handleChange}
        placeholder={placeholder}
        className="flex-1 py-1 text-gray-800"
        placeholderTextColor="#9CA3AF"
        autoFocus={autoFocus}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Image source={icons.close} className="w-5 h-5" tintColor="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
