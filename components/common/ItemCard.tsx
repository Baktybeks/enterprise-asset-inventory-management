import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants/ionIcons";
import StatusBadge from "./StatusBadge";

type ItemCardProps = {
  item: {
    id: string;
    name: string;
    quantity: number;
    category: string;
    description?: string;
  };
  onPress: () => void;
};

const ItemCard = ({ item, onPress }: ItemCardProps) => {
  const getStockIcon = () => {
    if (item.quantity > 10) return icons.stockHigh;
    if (item.quantity > 5) return icons.stockMedium;
    return icons.stockLow;
  };

  const getStockColor = () => {
    if (item.quantity > 10) return "text-green-600";
    if (item.quantity > 5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 shadow-sm mb-3 flex-row items-center"
    >
      <View className="bg-blue-100 rounded-lg p-3 mr-4">
        <Image
          source={getStockIcon()}
          className="w-6 h-6"
          tintColor="#3B82F6"
        />
      </View>

      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
        <View className="flex-row items-center mt-1">
          <StatusBadge category={item.category} />
          <Text className={`ml-auto font-medium ${getStockColor()}`}>
            {item.quantity} шт.
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCard;
