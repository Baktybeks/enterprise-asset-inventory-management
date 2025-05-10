import React from "react";
import { View, Text, Dimensions } from "react-native";

type StockLevelChartProps = {
  data: Record<string, number>;
};

const StockLevelChart = ({ data }: StockLevelChartProps) => {
  const screenWidth = Dimensions.get("window").width - 56;
  const totalItems = Object.values(data).reduce((sum, count) => sum + count, 0);

  const getColorForCategory = (category: string) => {
    switch (category) {
      case "Электроника":
        return "bg-blue-500";
      case "Мебель":
        return "bg-green-500";
      case "Канцтовары":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <View>
      <View className="flex-row h-8 rounded-lg overflow-hidden mb-4">
        {Object.entries(data).map(([category, count], index) => {
          const percentage = (count / totalItems) * 100;
          const width = Math.max((percentage / 100) * screenWidth, 20); // Минимальная ширина 20px для видимости

          return (
            <View
              key={category}
              style={{ width }}
              className={`${getColorForCategory(category)}`}
            />
          );
        })}
      </View>

      <View className="mt-2">
        {Object.entries(data).map(([category, count]) => (
          <View key={category} className="flex-row items-center mb-2">
            <View
              className={`w-3 h-3 rounded-full ${getColorForCategory(
                category
              )} mr-2`}
            />
            <Text className="text-gray-700">{category}</Text>
            <Text className="ml-auto font-medium">
              {count} шт. ({Math.round((count / totalItems) * 100)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default StockLevelChart;
