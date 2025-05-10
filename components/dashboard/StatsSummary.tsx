import React from "react";
import { View, Text, Image } from "react-native";
import { icons } from "@/constants/ionIcons";

type StatsSummaryProps = {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
};

const StatsSummary = ({
  totalItems,
  lowStockItems,
  totalValue,
}: StatsSummaryProps) => {
  return (
    <View className="flex-row justify-between">
      <View className="bg-white rounded-xl p-4 shadow-sm flex-1 mr-2">
        <View className="bg-blue-100 rounded-full p-2 w-10 h-10 items-center justify-center mb-2">
          <Image source={icons.box} className="w-5 h-5" tintColor="#3B82F6" />
        </View>
        <Text className="text-sm text-gray-500">Всего товаров</Text>
        <Text className="text-xl font-bold">{totalItems}</Text>
      </View>

      <View className="bg-white rounded-xl p-4 shadow-sm flex-1 mx-2">
        <View className="bg-red-100 rounded-full p-2 w-10 h-10 items-center justify-center mb-2">
          <Image source={icons.alert} className="w-5 h-5" tintColor="#EF4444" />
        </View>
        <Text className="text-sm text-gray-500">Низкий запас</Text>
        <Text className="text-xl font-bold">{lowStockItems}</Text>
      </View>

      <View className="bg-white rounded-xl p-4 shadow-sm flex-1 ml-2">
        <View className="bg-green-100 rounded-full p-2 w-10 h-10 items-center justify-center mb-2">
          <Image source={icons.money} className="w-5 h-5" tintColor="#10B981" />
        </View>
        <Text className="text-sm text-gray-500">Общая стоимость</Text>
        <Text className="text-xl font-bold">
          {totalValue.toLocaleString()} ₽
        </Text>
      </View>
    </View>
  );
};

export default StatsSummary;
