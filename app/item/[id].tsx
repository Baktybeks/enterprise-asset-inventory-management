// app/item/[id].tsx
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
  KeyboardTypeOptions,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/constants/ionIcons";
import * as Haptics from "expo-haptics";
import {
  useInventoryItem,
  useAddInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  useInventoryItemByBarcode,
} from "@/services/inventoryService";

// Типы для пропсов компонентов
interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  autoFocus?: boolean;
  onBlur?: () => void;
}

interface NumberFieldProps {
  label: string;
  value: string;
  onChangeValue: (value: string) => void;
  min?: number;
}

// Внешний вид TextField
const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  editable = true,
  autoFocus = false,
  onBlur,
}) => (
  <View className="mb-4">
    <Text className="text-gray-800 font-medium mb-2">{label}</Text>
    <TextInput
      className={`bg-gray-100 rounded-lg px-4 py-3 text-gray-800 ${
        !editable && "opacity-70"
      }`}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      editable={editable}
      autoFocus={autoFocus}
      onBlur={onBlur}
    />
  </View>
);

// Компонент для инкремента/декремента числовых значений
const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChangeValue,
  min = 0,
}) => {
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

const ItemDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { id, edit, scanned, barcode: scannedBarcode } = params;
  const isEditing = edit === "true";
  const isNewItem = id === "create";
  const isScanned = scanned === "true";
  const router = useRouter();

  const {
    data: item,
    isLoading: isItemLoading,
    error: itemError,
    refetch,
  } = useInventoryItem(isNewItem ? "" : id.toString());

  const addItemMutation = useAddInventoryItem();
  const updateItemMutation = useUpdateInventoryItem();
  const deleteItemMutation = useDeleteInventoryItem();

  const [saving, setSaving] = useState(false);
  const [itemNotFound, setItemNotFound] = useState(false);
  const [checkingBarcode, setCheckingBarcode] = useState(false);

  // Поля формы
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState(scannedBarcode?.toString() || "");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [price, setPrice] = useState("0");
  const [isFormValid, setIsFormValid] = useState(false);

  // Состояние для проверки существования штрихкода
  const [shouldCheckBarcode, setShouldCheckBarcode] = useState(false);
  const [originalBarcode, setOriginalBarcode] = useState("");

  // Используем хук для проверки штрихкода
  const {
    data: existingItemWithBarcode,
    isLoading: isCheckingBarcode,
    error: barcodeCheckError,
  } = useInventoryItemByBarcode(shouldCheckBarcode ? barcode : "", {
    // Отключаем автоматический запрос при монтировании
    enabled:
      shouldCheckBarcode &&
      barcode.trim().length > 0 &&
      barcode !== originalBarcode,
    // Сбрасываем запрос при изменении штрихкода
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
  });

  useEffect(() => {
    if (!isNewItem && itemError) {
      console.log(`Ошибка при получении товара с ID ${id}: ${itemError}`);

      // Устанавливаем флаг, что товар не найден
      setItemNotFound(true);

      // Показываем предупреждение пользователю
      Alert.alert(
        "Товар не найден",
        "Данный товар был удален или не существует. Хотите создать новый товар?",
        [
          {
            text: "Нет",
            style: "cancel",
            onPress: () => {
              router.back();
            },
          },
          {
            text: "Да",
            onPress: () => {
              // Если у нас есть штрихкод из параметров, используем его для создания нового товара
              if (scannedBarcode) {
                router.replace({
                  pathname: "/item/[id]",
                  params: {
                    id: "create",
                    barcode: scannedBarcode.toString(),
                    scanned: "true",
                  },
                });
              } else {
                router.replace("/item/create");
              }
            },
          },
        ]
      );
    }
  }, [isNewItem, itemError, id, router, scannedBarcode]);

  // Загрузка данных
  useEffect(() => {
    if (isNewItem) {
      return;
    }

    if (item) {
      setName(item.name);
      setBarcode(item.barcode);
      setOriginalBarcode(item.barcode); // Сохраняем оригинальный штрихкод
      setCategory(item.category);
      setQuantity(item.quantity.toString());
      setPrice(item.price.toString());
    }
  }, [id, isNewItem, item]);

  // Проверка валидности формы
  useEffect(() => {
    setIsFormValid(
      name.trim().length > 0 &&
        barcode.trim().length > 0 &&
        !isNaN(Number(quantity)) &&
        !isNaN(Number(price))
    );
  }, [name, barcode, quantity, price]);

  // Обработка результата проверки штрихкода
  useEffect(() => {
    // Если проверка активна и получены данные без ошибок
    if (
      shouldCheckBarcode &&
      !isCheckingBarcode &&
      existingItemWithBarcode &&
      barcode !== originalBarcode
    ) {
      setShouldCheckBarcode(false); // Сбрасываем флаг проверки

      // Если мы редактируем товар и существующий товар с таким штрихкодом - не наш текущий товар
      if (isEditing && existingItemWithBarcode.id !== id) {
        Alert.alert(
          "Штрихкод уже используется",
          `Товар "${existingItemWithBarcode.name}" уже использует этот штрихкод. Хотите перейти к этому товару?`,
          [
            {
              text: "Нет",
              style: "cancel",
            },
            {
              text: "Перейти",
              onPress: () => {
                router.replace(`/item/${existingItemWithBarcode.id}`);
              },
            },
          ]
        );
      }
      // Если создаем новый товар и нашли товар с таким штрихкодом
      else if (isNewItem && existingItemWithBarcode) {
        Alert.alert(
          "Штрихкод уже используется",
          `Товар "${existingItemWithBarcode.name}" уже использует этот штрихкод. Хотите перейти к этому товару?`,
          [
            {
              text: "Нет",
              style: "cancel",
            },
            {
              text: "Перейти",
              onPress: () => {
                router.replace(`/item/${existingItemWithBarcode.id}`);
              },
            },
          ]
        );
      }
    }
  }, [
    existingItemWithBarcode,
    isCheckingBarcode,
    shouldCheckBarcode,
    isEditing,
    isNewItem,
    id,
    router,
    barcode,
    originalBarcode,
  ]);

  // Функция для проверки штрихкода при потере фокуса
  const handleBarcodeBlur = () => {
    // Если штрихкод не пустой и отличается от оригинального, запускаем проверку
    if (barcode.trim() !== "" && barcode !== originalBarcode) {
      setShouldCheckBarcode(true);
    }
  };

  // Сохранение товара
  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert(
        "Ошибка",
        "Пожалуйста, заполните все обязательные поля корректно"
      );
      return;
    }

    // Проверка существования штрихкода перед сохранением
    if (barcode !== originalBarcode) {
      setCheckingBarcode(true);

      try {
        // Используем аналогичный запрос вручную для проверки перед сохранением
        const response = await fetch(
          `/api/inventory/barcode/${barcode.trim()}`
        );
        const existingItem = await response.json();

        if (
          existingItem &&
          existingItem.id &&
          (!isEditing || existingItem.id.toString() !== id.toString())
        ) {
          setCheckingBarcode(false);
          Alert.alert(
            "Штрихкод уже используется",
            `Товар "${existingItem.name}" уже использует этот штрихкод. Хотите перейти к этому товару?`,
            [
              {
                text: "Нет",
                style: "cancel",
              },
              {
                text: "Перейти",
                onPress: () => {
                  router.replace(`/item/${existingItem.id}`);
                },
              },
            ]
          );
          return;
        }
      } catch (error) {
        console.error("Ошибка при проверке штрихкода:", error);
        // Продолжаем сохранение, даже если проверка не удалась
      } finally {
        setCheckingBarcode(false);
      }
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
        await addItemMutation.mutateAsync(itemData);
      } else {
        await updateItemMutation.mutateAsync({
          id: id.toString(),
          updates: itemData,
        });
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
              await deleteItemMutation.mutateAsync(id.toString());
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

  // Изменение количества в режиме просмотра
  const handleQuantityChange = async (newQuantity: number) => {
    try {
      await updateItemMutation.mutateAsync({
        id: id.toString(),
        updates: { quantity: newQuantity },
      });
    } catch (error) {
      console.error("Ошибка при обновлении количества:", error);
      Alert.alert("Ошибка", "Не удалось обновить количество товара.");
    }
  };

  // Отображение загрузки
  if (isItemLoading && !isNewItem && !itemNotFound) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#F5F7FA]">
        <ActivityIndicator size="large" color="#5B67CA" />
      </SafeAreaView>
    );
  }

  if (itemNotFound && !isNewItem) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#F5F7FA]">
        <Icon
          name="alert-circle-outline"
          size={80}
          color="#ef4444"
          style={{ marginBottom: 16 }}
        />
        <Text className="text-lg text-center text-gray-800 mb-2">
          Товар не найден
        </Text>
        <Text className="text-center text-gray-600 mb-4 px-6">
          Данный товар был удален или не существует в базе данных.
        </Text>
        <View className="flex-row">
          <TouchableOpacity
            className="bg-gray-300 px-4 py-2 rounded-lg mr-2"
            onPress={() => router.back()}
          >
            <Text className="text-gray-800 font-medium">Вернуться назад</Text>
          </TouchableOpacity>

          {scannedBarcode && (
            <TouchableOpacity
              className="bg-primary px-4 py-2 rounded-lg"
              onPress={() => {
                router.replace({
                  pathname: "/item/[id]",
                  params: {
                    id: "create",
                    barcode: scannedBarcode.toString(),
                    scanned: "true",
                  },
                });
              }}
            >
              <Text className="text-white font-medium">Создать новый</Text>
            </TouchableOpacity>
          )}
        </View>
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
                onBlur={handleBarcodeBlur} // Добавляем обработчик потери фокуса
              />

              {isCheckingBarcode && (
                <View className="flex-row items-center mb-2">
                  <ActivityIndicator
                    size="small"
                    color="#5B67CA"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-gray-500">Проверка штрихкода...</Text>
                </View>
              )}

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
                label="Цена (Сом)"
                value={price}
                onChangeText={setPrice}
                placeholder="Введите цену"
                keyboardType="decimal-pad"
              />
            </View>

            <TouchableOpacity
              className={`rounded-xl py-4 px-6 mb-4 items-center ${
                isFormValid ? "bg-primary" : "bg-gray-300"
              }`}
              onPress={handleSave}
              disabled={
                !isFormValid || saving || checkingBarcode || isCheckingBarcode
              }
            >
              {saving || checkingBarcode ? (
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
        ) : item ? (
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
                    onPress={() => {
                      if (item.quantity > 0) {
                        Haptics.selectionAsync();
                        handleQuantityChange(item.quantity - 1);
                      }
                    }}
                  >
                    <Icon name="minus" size={20} color="#374151" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-primary w-10 h-10 rounded-lg items-center justify-center"
                    onPress={() => {
                      Haptics.selectionAsync();
                      handleQuantityChange(item.quantity + 1);
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
                {item.price.toLocaleString()} Сом
              </Text>
            </View>

            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-500 mb-2">Общая стоимость</Text>
              <Text className="text-primary text-xl font-bold">
                {(item.price * item.quantity).toLocaleString()} Сом
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
        ) : (
          // Обработка случая, когда item равен undefined или null
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500 text-center">
              Товар не найден или произошла ошибка при загрузке
            </Text>
            <TouchableOpacity
              className="mt-4 bg-primary px-4 py-2 rounded-lg"
              onPress={() => router.back()}
            >
              <Text className="text-white font-medium">Вернуться назад</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ItemDetailScreen;
