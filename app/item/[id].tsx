import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useInventory } from "@/context/InventoryContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/constants/ionIcons";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";

// Внешний вид TextField
const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  editable = true,
  autoFocus = false,
}) => (
  <View className="mb-4">
    <Text className="text-gray-800 font-medium mb-2">{label}</Text>
    <TextInput
      className={`bg-gray-100 rounded-lg px-4 py-3 text-gray-800 ${!editable && "opacity-70"}`}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      editable={editable}
      autoFocus={autoFocus}
    />
  </View>
);

// Компонент для инкремента/декремента числовых значений
const NumberField = ({ label, value, onChangeValue, min = 0 }) => {
  const handleIncrement = () => {
    const newValue = parseInt(value) + 1;
    onChangeValue(newValue.toString());
    Haptics.selectionAsync();
  };

  const handleDecrement = () => {
    const newValue = parseInt(value) - 1;
    if (newValue >= min) {
      onChangeValue(newValue.toString());
      Haptics.selectionAsync();
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-800 font-medium mb-2">{label}</Text>
      <View className="flex-row items-center">
        <TouchableOpacity
          className="bg-gray-200 w-10 h-10 rounded-lg items-center justify-center"
          onPress={handleDecrement}
        >
          <Icon name="minus" size={20} color="#374151" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 bg-gray-100 rounded-lg px-4 py-3 mx-2 text-center text-gray-800"
          value={value}
          onChangeText={onChangeValue}
          keyboardType="number-pad"
        />

        <TouchableOpacity
          className="bg-gray-200 w-10 h-10 rounded-lg items-center justify-center"
          onPress={handleIncrement}
        >
          <Icon name="plus" size={20} color="#374151" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ItemDetailScreen = () => {
  const params = useLocalSearchParams();
  const { id, edit, scanned, barcode: scannedBarcode } = params;
  const isEditing = edit === "true";
  const isNewItem = id === "create";
  const isScanned = scanned === "true";
  const router = useRouter();

  const { getItemById, updateItem, addItem, deleteItem } = useInventory();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState(null);

  // Поля формы
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState(scannedBarcode?.toString() || "");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [price, setPrice] = useState("0");
  const [isFormValid, setIsFormValid] = useState(false);

  // Загрузка данных
  useEffect(() => {
    const loadItem = async () => {
      if (isNewItem) {
        setLoading(false);
        return;
      }

      const loadedItem = getItemById(id.toString());

      if (loadedItem) {
        setItem(loadedItem);
        setName(loadedItem.name);
        setBarcode(loadedItem.barcode);
        setCategory(loadedItem.category);
        setQuantity(loadedItem.quantity.toString());
        setPrice(loadedItem.price.toString());
      } else {
        Alert.alert("Ошибка", "Товар не найден");
        router.back();
      }

      setLoading(false);
    };

    loadItem();
  }, [id, isNewItem, getItemById]);

  // Проверка валидности формы
  useEffect(() => {
    setIsFormValid(
      name.trim().length > 0 &&
        barcode.trim().length > 0 &&
        !isNaN(Number(quantity)) &&
        !isNaN(Number(price))
    );
  }, [name, barcode, quantity, price]);

  // Сохранение товара
  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert(
        "Ошибка",
        "Пожалуйста, заполните все обязательные поля корректно"
      );
      return;
    }

    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const itemData = {
        name: name.trim(),
        barcode: barcode.trim(),
        category: category.trim() || "Без категории",
        quantity: parseInt(quantity) || 0,
        price: parseFloat(price) || 0,
      };

      if (isNewItem) {
        await addItem(itemData);
      } else {
        await updateItem(id.toString(), itemData);
      }

      setSaving(false);
      router.back();
    } catch (error) {
      console.error("Ошибка при сохранении товара:", error);
      Alert.alert("Ошибка", "Не удалось сохранить товар. Попробуйте еще раз.");
      setSaving(false);
    }
  };

  // Удаление товара
  const handleDelete = () => {
    Alert.alert(
      "Удаление товара",
      "Вы уверены, что хотите удалить этот товар?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
              await deleteItem(id.toString());
              router.back();
            } catch (error) {
              console.error("Ошибка при удалении товара:", error);
              Alert.alert(
                "Ошибка",
                "Не удалось удалить товар. Попробуйте еще раз."
              );
            }
          },
        },
      ]
    );
  };

  // Отображение загрузки
  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#F5F7FA]">
        <ActivityIndicator size="large" color="#5B67CA" />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F5F7FA]"
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Заголовок */}
      <SafeAreaView edges={["top"]}>
        <View className="pt-2 pb-2 px-4 bg-white">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full"
              onPress={() => {
                Haptics.selectionAsync();
                router.back();
              }}
            >
              <Icon name="back" size={24} color="#333333" />
            </TouchableOpacity>

            <Text className="text-xl font-bold text-gray-800">
              {isNewItem
                ? "Новый товар"
                : isEditing
                  ? "Редактирование"
                  : "Детали товара"}
            </Text>

            <View className="w-10 h-10" />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-4">
        {isNewItem || isEditing ? (
          // Форма редактирования
          <View>
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <TextField
                label="Название товара*"
                value={name}
                onChangeText={setName}
                placeholder="Введите название товара"
                autoFocus={isNewItem}
              />

              <TextField
                label="Штрихкод*"
                value={barcode}
                onChangeText={setBarcode}
                placeholder="Введите штрихкод"
                keyboardType="number-pad"
                editable={!isScanned}
              />

              <TextField
                label="Категория"
                value={category}
                onChangeText={setCategory}
                placeholder="Введите категорию"
              />

              <NumberField
                label="Количество"
                value={quantity}
                onChangeValue={setQuantity}
                min={0}
              />

              <TextField
                label="Цена (₽)"
                value={price}
                onChangeText={setPrice}
                placeholder="Введите цену"
                keyboardType="decimal-pad"
              />
            </View>

            <TouchableOpacity
              className={`rounded-xl py-4 px-6 mb-4 items-center ${isFormValid ? "bg-primary" : "bg-gray-300"}`}
              onPress={handleSave}
              disabled={!isFormValid || saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white font-bold text-lg">Сохранить</Text>
              )}
            </TouchableOpacity>

            {!isNewItem && (
              <TouchableOpacity
                className="rounded-xl py-4 px-6 mb-6 items-center border border-red-500"
                onPress={handleDelete}
              >
                <Text className="text-red-500 font-bold">Удалить товар</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // Режим просмотра
          <View>
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="mb-2 flex-row justify-between items-center">
                <Text className="text-gray-500">Наименование</Text>
                <TouchableOpacity
                  className="p-2"
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push(`/item/${id}?edit=true`);
                  }}
                >
                  <Icon name="edit" size={20} color="#5B67CA" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-800 text-lg font-medium">
                {item.name}
              </Text>
            </View>

            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-500 mb-2">Штрихкод</Text>
              <View className="flex-row items-center">
                <Icon
                  name="barcode"
                  size={24}
                  color="#374151"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-gray-800 text-lg">{item.barcode}</Text>
              </View>
            </View>

            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-500 mb-2">Категория</Text>
              <View className="bg-primary/10 py-1 px-3 rounded-full self-start">
                <Text className="text-primary font-medium">
                  {item.category}
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-500 mb-2">Количество</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-800 text-lg font-medium">
                  {item.quantity} шт.
                </Text>

                <View className="flex-row">
                  <TouchableOpacity
                    className="bg-gray-200 w-10 h-10 rounded-lg items-center justify-center mr-2"
                    onPress={async () => {
                      if (item.quantity > 0) {
                        Haptics.selectionAsync();
                        await updateItem(id.toString(), {
                          quantity: item.quantity - 1,
                        });
                        setItem({ ...item, quantity: item.quantity - 1 });
                        setQuantity((item.quantity - 1).toString());
                      }
                    }}
                  >
                    <Icon name="minus" size={20} color="#374151" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-primary w-10 h-10 rounded-lg items-center justify-center"
                    onPress={async () => {
                      Haptics.selectionAsync();
                      await updateItem(id.toString(), {
                        quantity: item.quantity + 1,
                      });
                      setItem({ ...item, quantity: item.quantity + 1 });
                      setQuantity((item.quantity + 1).toString());
                    }}
                  >
                    <Icon name="plus" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-500 mb-2">Цена</Text>
              <Text className="text-gray-800 text-lg font-medium">
                {item.price.toLocaleString()} ₽
              </Text>
            </View>

            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-500 mb-2">Общая стоимость</Text>
              <Text className="text-primary text-xl font-bold">
                {(item.price * item.quantity).toLocaleString()} ₽
              </Text>
            </View>

            <TouchableOpacity
              className="rounded-xl py-4 px-6 mb-4 items-center bg-primary"
              onPress={() => {
                Haptics.selectionAsync();
                router.push(`/item/${id}?edit=true`);
              }}
            >
              <Text className="text-white font-bold text-lg">
                Редактировать
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-xl py-4 px-6 mb-6 items-center border border-red-500"
              onPress={handleDelete}
            >
              <Text className="text-red-500 font-bold">Удалить товар</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ItemDetailScreen;