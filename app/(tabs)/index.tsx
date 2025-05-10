import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useInventory } from "@/context/InventoryContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

type InventoryItem = {
  id: string;
  name: string;
  barcode: string;
  image?: string;
  category: string;
  price: number;
  quantity: number;
};

type InventoryCardProps = {
  item: InventoryItem;
};

const InventoryScreen = () => {
  const { items, loading, deleteItem } = useInventory();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);
  const [activeFilter, setActiveFilter] = useState("Все");
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryFromParams = params.category as string | undefined;

  const categories = [
    "Все",
    ...Array.from(new Set(items.map((item) => item.category))),
  ];

  useEffect(() => {
    if (categoryFromParams && categories.includes(categoryFromParams)) {
      setActiveFilter(categoryFromParams);
    }
  }, [categoryFromParams]);

  useEffect(() => {
    if (activeFilter === "Все") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === activeFilter));
    }
  }, [items, activeFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      "Удаление товара",
      `Вы уверены, что хотите удалить товар "${name}"?`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await deleteItem(id);
          },
        },
      ]
    );
  };

  const InventoryCard: React.FC<InventoryCardProps> = ({ item }) => (
    <TouchableOpacity
      className="bg-white rounded-xl mx-3 mb-3 overflow-hidden shadow-sm"
      onPress={() => {
        Haptics.selectionAsync();
        router.push(`/item/${item.id}`);
      }}
      activeOpacity={0.7}
    >
      <View className="p-3">
        <View className="flex-row items-center">
          <View className="w-14 h-14 bg-gray-100 rounded-xl items-center justify-center mr-3">
            {item.image ? (
              <Image
                source={item.image}
                className="w-12 h-12"
                contentFit="contain"
              />
            ) : (
              <Ionicons name="cube-outline" size={28} color="#6B7280" />
            )}
          </View>

          <View className="flex-1">
            <Text className="text-base font-medium text-gray-800 font-semibold">
              {item.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons
                name="barcode-outline"
                size={14}
                color="#9CA3AF"
                style={{ marginRight: 4 }}
              />
              <Text className="text-xs text-gray-500">{item.barcode}</Text>
            </View>
          </View>

          <View className="ml-2">
            <Text className="text-primary font-bold text-right text-lg">
              {item.price.toLocaleString()} ₽
            </Text>
            <View className="flex-row items-center justify-end mt-1">
              <Ionicons
                name="cube-outline"
                size={14}
                color="#9CA3AF"
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm text-gray-700 font-medium">
                {item.quantity} шт.
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row mt-2 justify-between items-center">
          <View className="bg-primary/10 px-2 py-1 rounded-full">
            <Text className="text-xs text-primary font-medium">
              {item.category}
            </Text>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              className="mr-2"
              onPress={() => {
                Haptics.selectionAsync();
                router.push(`/item/${item.id}?edit=true`);
              }}
            >
              <Ionicons name="create-outline" size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                confirmDelete(item.id, item.name);
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStats = () => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return (
      <View className="flex-row justify-between mx-3 mb-4">
        <View className="bg-white rounded-xl flex-1 mr-2 p-3 shadow-sm">
          <Text className="text-gray-500 text-xs">Всего товаров</Text>
          <Text className="text-2xl font-bold text-primary">{totalItems}</Text>
        </View>

        <View className="bg-white rounded-xl flex-1 ml-2 p-3 shadow-sm">
          <Text className="text-gray-500 text-xs">Общая стоимость</Text>
          <Text className="text-2xl font-bold text-primary">
            {totalValue.toLocaleString()} ₽
          </Text>
        </View>
      </View>
    );
  };

  const EmptyList = () => (
    <View className="flex-1 justify-center items-center py-10">
      <Ionicons name="cube-outline" size={64} color="#D1D5DB" />
      <Text className="text-gray-400 text-base mt-4 text-center">
        Список пуст{"\n"}Добавьте товары с помощью кнопки ниже
      </Text>
    </View>
  );

  const renderCategoryFilter = () => (
    <View className="mx-3 mb-4">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item, index) => `category-${index}`}
        renderItem={({ item: category }) => (
          <TouchableOpacity
            className={`px-4 py-2 rounded-full mr-2 ${
              activeFilter === category ? "bg-primary" : "bg-gray-100"
            }`}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveFilter(category);
            }}
          >
            <Text
              className={`font-medium ${
                activeFilter === category ? "text-white" : "text-gray-800"
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FA]" edges={["top"]}>
      {/* Заголовок */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-800">Инвентаризация</Text>
        <Text className="text-gray-500 mt-1">
          Управление товарами и имуществом предприятия
        </Text>
      </View>

      {renderStats()}
      {renderCategoryFilter()}

      <FlatList
        data={filteredItems}
        renderItem={({ item }) => <InventoryCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 100,
          flex: filteredItems.length ? undefined : 1,
        }}
        ListEmptyComponent={EmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        className="absolute bottom-24 right-5 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push("/item/create");
        }}
        style={{ elevation: 4 }}
      >
        <Ionicons name="add-outline" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InventoryScreen;
