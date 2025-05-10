import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import Button from "@/components/common/Button";
import CategorySelect from "../common/CategorySelect";

type ItemFormProps = {
  item: {
    id: string;
    name: string;
    quantity: number;
    category: string;
    description?: string;
    barcode?: string;
  };
  onSave: (item: any) => void;
  isNew?: boolean;
};

const ItemForm = ({ item, onSave, isNew = false }: ItemFormProps) => {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [description, setDescription] = useState(item.description || "");
  const [barcode, setBarcode] = useState(item.barcode || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [category, setCategory] = useState<string | null>(
    item.category || null
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Название обязательно";
    }

    if (!quantity.trim() || isNaN(Number(quantity))) {
      newErrors.quantity = "Укажите корректное количество";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({
        ...item,
        name,
        quantity: parseInt(quantity) || 0,
        category,
        description,
        barcode,
      });
    }
  };

  return (
    <View className="mb-8">
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Название товара*</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className={`border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-lg px-3 py-2 bg-white`}
          placeholder="Введите название товара"
        />
        {errors.name && (
          <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
        )}
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Количество*</Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          className={`border ${
            errors.quantity ? "border-red-500" : "border-gray-300"
          } rounded-lg px-3 py-2 bg-white`}
          placeholder="0"
        />
        {errors.quantity && (
          <Text className="text-red-500 text-sm mt-1">{errors.quantity}</Text>
        )}
      </View>
      <View className="mb-4">
        <CategorySelect selected={category} setSelected={setCategory} />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Штрих-код</Text>
        <TextInput
          value={barcode}
          onChangeText={setBarcode}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
          placeholder="Введите или отсканируйте штрих-код"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 mb-1">Описание</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-lg px-3 py-2 bg-white h-24 textAlignVertical-top"
          placeholder="Дополнительная информация о товаре..."
        />
      </View>

      <Button
        title={isNew ? "Добавить товар" : "Сохранить изменения"}
        onPress={handleSave}
      />
    </View>
  );
};

export default ItemForm;
