import React from "react";
import { View, Text } from "react-native";

type StatusBadgeProps = {
  category: string;
};

const StatusBadge = ({ category }: StatusBadgeProps) => {
  const getColor = () => {
    switch (category) {
      case "Электроника":
        return "bg-blue-100 text-blue-800";
      case "Мебель":
        return "bg-green-100 text-green-800";
      case "Канцтовары":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <View className={`px-2 py-1 rounded-full ${getColor().split(" ")[0]}`}>
      <Text className={`text-xs font-medium ${getColor().split(" ")[1]}`}>
        {category}
      </Text>
    </View>
  );
};

export default StatusBadge;
