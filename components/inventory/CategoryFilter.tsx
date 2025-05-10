import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

type CategoryFilterProps = {
  categories: string[];
  onSelectCategory: (category: string) => void;
};

const CategoryFilter = ({
  categories,
  onSelectCategory,
}: CategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
    onSelectCategory(category === "Все" ? "" : category);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-4"
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => handleSelect(category)}
          className={`mr-2 px-4 py-2 rounded-full ${
            selectedCategory === category ? "bg-blue-500" : "bg-gray-100"
          }`}
        >
          <Text
            className={`font-medium ${
              selectedCategory === category ? "text-white" : "text-gray-700"
            }`}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryFilter;
