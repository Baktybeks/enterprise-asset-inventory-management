// app/(tabs)/dashboard.tsx
import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Icon } from "@/constants/ionIcons";
import { getCategoryColor } from "@/constants/colors";
import { useInventoryItems, InventoryItem } from "@/services/inventoryService";

const { width } = Dimensions.get("window");

interface CategoryStat {
  name: string;
  count: number;
  value: number;
  items: InventoryItem[];
}

const DashboardScreen: React.FC = () => {
  const { data: items = [], isLoading, error } = useInventoryItems();
  const router = useRouter();

  const { totalValue, categoryStats, lowStockItems, totalItems } =
    useMemo(() => {
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const categories: Record<string, CategoryStat> = {};
      items.forEach((item) => {
        const category = item.category || "Без категории";
        if (!categories[category]) {
          categories[category] = {
            name: category,
            count: 0,
            value: 0,
            items: [],
          };
        }

        categories[category].count += item.quantity;
        categories[category].value += item.price * item.quantity;
        categories[category].items.push(item);
      });

      const sortedCategories = Object.values(categories).sort(
        (a, b) => b.value - a.value
      );

      const lowStock = items
        .filter((item) => item.quantity < 5)
        .sort((a, b) => a.quantity - b.quantity);

      return {
        totalValue: total,
        categoryStats: sortedCategories,
        lowStockItems: lowStock,
        totalItems: totalCount,
      };
    }, [items]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#F5F7FA]">
        <ActivityIndicator size="large" color="#5B67CA" />
        <Text className="mt-4 text-gray-600">Загрузка данных...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#F5F7FA] p-4">
        <Icon name="alert" size={50} color="#EF4444" />
        <Text className="mt-4 text-gray-800 font-medium text-lg text-center">
          Не удалось загрузить данные
        </Text>
        <Text className="mt-2 text-gray-600 text-center">
          Проверьте подключение к интернету и попробуйте снова
        </Text>
        <TouchableOpacity
          className="mt-6 bg-primary px-6 py-3 rounded-lg"
          onPress={() => window.location.reload()}
        >
          <Text className="text-white font-medium">Обновить</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F7FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      <View className="px-4 pt-12 pb-2">
        <Text className="text-2xl font-bold text-gray-800">
          Панель управления
        </Text>
        <Text className="text-gray-500 mt-1">
          Статистика и показатели инвентаря
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-xl mx-4 mt-4 p-4 shadow-sm">
          <Text className="text-gray-500 mb-1">Общая стоимость инвентаря</Text>
          <Text className="text-3xl font-bold text-primary">
            {totalValue.toLocaleString()} ₽
          </Text>

          <View className="flex-row mt-3 items-center">
            <Text className="text-gray-500">Всего типов товаров:</Text>
            <Text className="ml-1 font-medium text-gray-800">
              {items.length}
            </Text>
          </View>

          <View className="flex-row mt-1 items-center">
            <Text className="text-gray-500">Всего единиц:</Text>
            <Text className="ml-1 font-medium text-gray-800">{totalItems}</Text>
          </View>
        </View>

        <View className="mt-4">
          <View className="flex-row justify-between items-center px-4 mb-2">
            <Text className="text-lg font-bold text-gray-800">Категории</Text>
          </View>

          {categoryStats.length === 0 ? (
            <View className="bg-white rounded-xl mx-4 p-4 items-center py-6 shadow-sm">
              <Icon
                name="information-circle"
                size={40}
                color="#9CA3AF"
                style={{ marginBottom: 8 }}
              />
              <Text className="text-gray-500 text-center">
                Нет информации о категориях
              </Text>
            </View>
          ) : (
            categoryStats.map((category, index) => {
              const categoryColor = getCategoryColor(category.name);
              const percentage =
                totalValue > 0 ? (category.value / totalValue) * 100 : 0;

              return (
                <TouchableOpacity
                  key={index}
                  className="bg-white rounded-xl mx-4 mb-3 p-4 shadow-sm"
                  onPress={() => {
                    router.push({
                      pathname: "/",
                      params: { category: category.name },
                    });
                  }}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center">
                      <View
                        style={{ backgroundColor: categoryColor }}
                        className="w-3 h-3 rounded-full mr-2"
                      />
                      <Text className="font-medium text-gray-800">
                        {category.name}
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-sm">
                      {category.count} шт.
                    </Text>
                  </View>

                  <View className="bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                    <View
                      style={{
                        width: `${Math.min(100, percentage)}%`,
                        backgroundColor: categoryColor,
                      }}
                      className="h-full rounded-full"
                    />
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </Text>
                    <Text className="text-sm font-medium text-gray-800">
                      {category.value.toLocaleString()} ₽
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
        <View className="mt-4 mb-24">
          <View className="flex-row justify-between items-center px-4 mb-2">
            <Text className="text-lg font-bold text-gray-800">
              Низкий запас
            </Text>
            {lowStockItems.length > 0 && (
              <View className="bg-red-500 px-2 py-1 rounded-full">
                <Text className="text-xs text-white font-medium">
                  {lowStockItems.length}
                </Text>
              </View>
            )}
          </View>

          {lowStockItems.length === 0 ? (
            <View className="bg-white rounded-xl mx-4 p-4 items-center py-6 shadow-sm">
              <Icon
                name="checkCircle"
                size={40}
                color="#22C55E"
                style={{ marginBottom: 8 }}
              />
              <Text className="text-gray-500 text-center">
                Нет товаров с низким запасом
              </Text>
            </View>
          ) : (
            lowStockItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-xl mx-4 mb-3 p-4 shadow-sm"
                onPress={() => router.push(`/item/${item.id}`)}
              >
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-800">
                      {item.name}
                    </Text>
                    <View className="bg-primary/10 px-2 py-1 rounded-full self-start mt-1">
                      <Text className="text-xs text-primary font-medium">
                        {item.category}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <View
                      className={`px-2 py-1 rounded ${
                        item.quantity === 0 ? "bg-red-500" : "bg-amber-500"
                      }`}
                    >
                      <Text className="text-white font-medium">
                        {item.quantity === 0
                          ? "Нет в наличии"
                          : `${item.quantity} шт.`}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="bg-primary px-2 py-1 rounded mt-2 flex-row items-center"
                      onPress={() => {
                        router.push(`/item/${item.id}?edit=true`);
                      }}
                    >
                      <Icon
                        name="plus"
                        size={16}
                        color="#FFFFFF"
                        style={{ marginRight: 4 }}
                      />
                      <Text className="text-white font-medium text-xs">
                        Добавить
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
