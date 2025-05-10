// app/(tabs)/index.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  useInventoryItems,
  useDeleteInventoryItem,
  InventoryItem,
} from "@/services/inventoryService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/constants/ionIcons";
import * as Haptics from "expo-haptics";

type InventoryCardProps = {
  item: InventoryItem;
  onDelete: (id: string, name: string) => void;
  onEdit: (id: string) => void;
  onPress: (id: string) => void;
};

const InventoryScreen = () => {
  const { data: items = [], isLoading: loading, refetch } = useInventoryItems();
  const deleteItemMutation = useDeleteInventoryItem();

  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Все");
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryFromParams = params.category as string | undefined;

  const categories = useMemo(() => {
    return ["Все", ...Array.from(new Set(items.map((item) => item.category)))];
  }, [items]);

  useEffect(() => {
    if (categoryFromParams && categories.includes(categoryFromParams)) {
      setActiveFilter(categoryFromParams);
    }
  }, [categoryFromParams, categories]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "Все") {
      return items;
    } else {
      return items.filter((item) => item.category === activeFilter);
    }
  }, [items, activeFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
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
            try {
              await deleteItemMutation.mutateAsync(id);
            } catch (error) {
              console.error("Ошибка при удалении товара:", error);
              Alert.alert("Ошибка", "Не удалось удалить товар");
            }
          },
        },
      ]
    );
  };

  const handlePress = (id: string) => {
    Haptics.selectionAsync();
    router.push(`/item/${id}`);
  };

  const handleEdit = (id: string) => {
    Haptics.selectionAsync();
    router.push(`/item/${id}?edit=true`);
  };

  const ItemCard = ({
    item,
    onDelete,
    onEdit,
    onPress,
  }: InventoryCardProps) => (
    <TouchableOpacity
      className="bg-white rounded-xl mx-3 mb-3 overflow-hidden shadow-sm"
      onPress={() => onPress(item.id!)}
      activeOpacity={0.7}
    >
      <View className="p-3">
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-800 font-semibold">
              {item.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Icon
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
              <Icon
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
            <TouchableOpacity className="mr-2" onPress={() => onEdit(item.id!)}>
              <Icon name="create-outline" size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onDelete(item.id!, item.name);
              }}
            >
              <Icon name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const InventoryCard = React.memo(ItemCard);

  const stats = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return { totalItems, totalValue };
  }, [items]);

  const renderStats = () => (
    <View className="flex-row justify-between mx-3 mb-4">
      <View className="bg-white rounded-xl flex-1 mr-2 p-3 shadow-sm">
        <Text className="text-gray-500 text-xs">Всего товаров</Text>
        <Text className="text-2xl font-bold text-primary">
          {stats.totalItems}
        </Text>
      </View>

      <View className="bg-white rounded-xl flex-1 ml-2 p-3 shadow-sm">
        <Text className="text-gray-500 text-xs">Общая стоимость</Text>
        <Text className="text-2xl font-bold text-primary">
          {stats.totalValue.toLocaleString()} ₽
        </Text>
      </View>
    </View>
  );

  const EmptyList = () => (
    <View className="flex-1 justify-center items-center py-10">
      <Icon name="cube-outline" size={64} color="#D1D5DB" />
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

  const handleAddItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/item/create");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FA]" edges={["top"]}>
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
        renderItem={({ item }) => (
          <InventoryCard
            key={item.id || item.$id}
            item={item}
            onDelete={confirmDelete}
            onEdit={handleEdit}
            onPress={handlePress}
          />
        )}
        keyExtractor={(item) => item.id || item.$id!}
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
        onPress={handleAddItem}
        style={{ elevation: 4 }}
      >
        <Icon name="add-outline" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InventoryScreen;
