// app/(tabs)/search.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useInventoryItems, InventoryItem } from "@/services/inventoryService";
import { Icon } from "@/constants/ionIcons";
import { images } from "@/constants/images";

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<InventoryItem[]>([]);
  const { data: items = [] } = useInventoryItems();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      setQuery("");
      setResults([]);

      return () => {};
    }, [])
  );

  const searchItems = React.useCallback(
    (searchQuery: string): InventoryItem[] => {
      if (!searchQuery.trim()) return [];

      const normalizedQuery = searchQuery.toLowerCase().trim();

      return items.filter(
        (item) =>
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.barcode.includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery)
      );
    },
    [items]
  );

  // Обновляем результаты поиска при изменении запроса
  useEffect(() => {
    if (query.trim().length > 0) {
      setResults(searchItems(query));
    } else {
      setResults([]);
    }
  }, [query, searchItems]);

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity
      className="bg-white rounded-xl mx-3 mb-3 p-3 shadow-sm flex-row"
      onPress={() => router.push(`/item/${item.id}`)}
    >
      <View className="flex-1 justify-center">
        <Text className="text-base font-medium text-gray-800">{item.name}</Text>
        <View className="flex-row items-center mt-1">
          <Icon
            name="barcode"
            size={16}
            color="#9CA3AF"
            style={{ marginRight: 4 }}
          />
          <Text className="text-xs text-gray-500">{item.barcode}</Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <View className="bg-primary/10 px-2 py-1 rounded-full">
            <Text className="text-xs text-primary font-medium">
              {item.category}
            </Text>
          </View>
          <Text className="text-sm font-bold text-primary">
            {item.quantity} шт.
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyResults = () => (
    <View className="items-center justify-center py-10">
      {query.trim().length > 0 ? (
        <>
          <Image
            source={images.noResults}
            className="w-40 h-40"
            tintColor="#D1D5DB"
          />
          <Text className="text-gray-400 text-base mt-4">
            Товары не найдены
          </Text>
        </>
      ) : (
        <>
          <Image
            source={images.search}
            className="w-40 h-40"
            tintColor="#D1D5DB"
          />
          <Text className="text-gray-400 text-base mt-4">
            Введите запрос для поиска товаров
          </Text>
        </>
      )}
    </View>
  );

  // Очистка поиска
  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      <View className="px-4 pt-12 pb-4">
        <Text className="text-2xl font-bold text-gray-800">Поиск товаров</Text>
        <Text className="text-gray-500 mt-1">
          Найдите товары по названию, категории или штрихкоду
        </Text>
      </View>

      <View className="px-4 pb-4">
        <View className="flex-row bg-white rounded-xl px-4 py-3 items-center shadow-sm">
          <Icon
            name="search"
            size={20}
            color="#9CA3AF"
            style={{ marginRight: 12 }}
          />
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Введите название или штрихкод"
            value={query}
            onChangeText={setQuery}
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Icon name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.$id!}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={renderEmptyResults}
      />

      <TouchableOpacity
        className="absolute bottom-24 right-5 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/item/create")}
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SearchScreen;
