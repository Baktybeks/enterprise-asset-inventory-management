// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   Image,
//   StatusBar,
//   Dimensions,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { useInventory } from "@/context/InventoryContext";
// import { Icon } from "@/constants/ionIcons";

// // Получаем ширину экрана для адаптивности
// const { width } = Dimensions.get("window");

// // Функция для получения цвета из названия категории (консистентный цвет)
// const getCategoryColor = (category: string) => {
//   const colors = [
//     "#5B67CA", // primary
//     "#F97316", // orange
//     "#22C55E", // green
//     "#06B6D4", // cyan
//     "#8B5CF6", // violet
//     "#EC4899", // pink
//     "#F43F5E", // rose
//     "#FACC15", // yellow
//   ];

//   // Хэш-функция для строки
//   let hash = 0;
//   for (let i = 0; i < category.length; i++) {
//     hash = category.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   // Выбираем цвет из массива
//   return colors[Math.abs(hash) % colors.length];
// };

// const DashboardScreen = () => {
//   const { items } = useInventory();
//   const [totalValue, setTotalValue] = useState(0);
//   const [categoryStats, setCategoryStats] = useState([]);
//   const [lowStockItems, setLowStockItems] = useState([]);
//   const router = useRouter();

//   // Расчет статистики при изменении списка товаров
//   useEffect(() => {
//     if (items.length > 0) {
//       // Общая стоимость
//       const total = items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );
//       setTotalValue(total);

//       // Статистика по категориям
//       const categories = {};
//       items.forEach((item) => {
//         const category = item.category || "Без категории";
//         if (!categories[category]) {
//           categories[category] = {
//             name: category,
//             count: 0,
//             value: 0,
//             items: [],
//           };
//         }

//         categories[category].count += item.quantity;
//         categories[category].value += item.price * item.quantity;
//         categories[category].items.push(item);
//       });

//       // Сортировка категорий по стоимости (от большей к меньшей)
//       const sortedCategories = Object.values(categories).sort(
//         (a, b) => b.value - a.value
//       );
//       setCategoryStats(sortedCategories);

//       // Товары с низким запасом (менее 5 штук)
//       const lowStock = items
//         .filter((item) => item.quantity < 5)
//         .sort((a, b) => a.quantity - b.quantity);

//       setLowStockItems(lowStock);
//     }
//   }, [items]);

//   return (
//     <SafeAreaView className="flex-1 bg-[#F5F7FA]">
//       <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

//       {/* Заголовок */}
//       <View className="px-4 pt-12 pb-2">
//         <Text className="text-2xl font-bold text-gray-800">
//           Панель управления
//         </Text>
//         <Text className="text-gray-500 mt-1">
//           Статистика и показатели инвентаря
//         </Text>
//       </View>

//       <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//         {/* Общая стоимость инвентаря */}
//         <View className="bg-white rounded-xl mx-4 mt-4 p-4 shadow-sm">
//           <Text className="text-gray-500 mb-1">Общая стоимость инвентаря</Text>
//           <Text className="text-3xl font-bold text-primary">
//             {totalValue.toLocaleString()} ₽
//           </Text>

//           <View className="flex-row mt-3 items-center">
//             <Text className="text-gray-500">Всего типов товаров:</Text>
//             <Text className="ml-1 font-medium text-gray-800">
//               {items.length}
//             </Text>
//           </View>

//           <View className="flex-row mt-1 items-center">
//             <Text className="text-gray-500">Всего единиц:</Text>
//             <Text className="ml-1 font-medium text-gray-800">
//               {items.reduce((sum, item) => sum + item.quantity, 0)}
//             </Text>
//           </View>
//         </View>

//         {/* Распределение по категориям */}
//         <View className="mt-4">
//           <View className="flex-row justify-between items-center px-4 mb-2">
//             <Text className="text-lg font-bold text-gray-800">Категории</Text>
//           </View>

//           {categoryStats.map((category, index) => {
//             const categoryColor = getCategoryColor(category.name);
//             const percentage =
//               totalValue > 0 ? (category.value / totalValue) * 100 : 0;

//             return (
//               <TouchableOpacity
//                 key={index}
//                 className="bg-white rounded-xl mx-4 mb-3 p-4 shadow-sm"
//                 onPress={() => {
//                   // Здесь можно добавить навигацию на список с фильтром по категории
//                   router.push({
//                     pathname: "/index",
//                     params: { category: category.name },
//                   });
//                 }}
//               >
//                 <View className="flex-row justify-between items-center mb-2">
//                   <View className="flex-row items-center">
//                     <View
//                       style={{ backgroundColor: categoryColor }}
//                       className="w-3 h-3 rounded-full mr-2"
//                     />
//                     <Text className="font-medium text-gray-800">
//                       {category.name}
//                     </Text>
//                   </View>
//                   <Text className="text-gray-500 text-sm">
//                     {category.count} шт.
//                   </Text>
//                 </View>

//                 <View className="bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
//                   <View
//                     style={{
//                       width: `${Math.min(100, percentage)}%`,
//                       backgroundColor: categoryColor,
//                     }}
//                     className="h-full rounded-full"
//                   />
//                 </View>

//                 <View className="flex-row justify-between items-center">
//                   <Text className="text-sm text-gray-500">
//                     {percentage.toFixed(1)}%
//                   </Text>
//                   <Text className="text-sm font-medium text-gray-800">
//                     {category.value.toLocaleString()} ₽
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>

//         {/* Товары с низким запасом */}
//         <View className="mt-4 mb-24">
//           <View className="flex-row justify-between items-center px-4 mb-2">
//             <Text className="text-lg font-bold text-gray-800">
//               Низкий запас
//             </Text>
//             {lowStockItems.length > 0 && (
//               <View className="bg-red-500 px-2 py-1 rounded-full">
//                 <Text className="text-xs text-white font-medium">
//                   {lowStockItems.length}
//                 </Text>
//               </View>
//             )}
//           </View>

//           {lowStockItems.length === 0 ? (
//             <View className="bg-white rounded-xl mx-4 p-4 items-center py-6 shadow-sm">
//               <Icon
//                 name="checkCircle"
//                 size={40}
//                 color="#22C55E"
//                 style={{ marginBottom: 8 }}
//               />
//               <Text className="text-gray-500 text-center">
//                 Нет товаров с низким запасом
//               </Text>
//             </View>
//           ) : (
//             lowStockItems.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 className="bg-white rounded-xl mx-4 mb-3 p-4 shadow-sm"
//                 onPress={() => router.push(`/item/${item.id}`)}
//               >
//                 <View className="flex-row items-center">
//                   <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center mr-3">
//                     {item.image ? (
//                       <Image
//                         source={{ uri: item.image }}
//                         className="w-full h-full rounded-lg"
//                       />
//                     ) : (
//                       <Icon
//                         name="package"
//                         size={24}
//                         color="#6B7280"
//                       />
//                     )}
//                   </View>

//                   <View className="flex-1">
//                     <Text className="font-medium text-gray-800">
//                       {item.name}
//                     </Text>
//                     <View className="bg-primary/10 px-2 py-1 rounded-full self-start mt-1">
//                       <Text className="text-xs text-primary font-medium">
//                         {item.category}
//                       </Text>
//                     </View>
//                   </View>

//                   <View className="items-end">
//                     <View
//                       className={`px-2 py-1 rounded ${
//                         item.quantity === 0 ? "bg-red-500" : "bg-amber-500"
//                       }`}
//                     >
//                       <Text className="text-white font-medium">
//                         {item.quantity === 0
//                           ? "Нет в наличии"
//                           : `${item.quantity} шт.`}
//                       </Text>
//                     </View>
//                     <TouchableOpacity
//                       className="bg-primary px-2 py-1 rounded mt-2 flex-row items-center"
//                       onPress={() => {
//                         // Увеличение количества товара
//                         router.push(`/item/${item.id}?edit=true`);
//                       }}
//                     >
//                       <Icon
//                         name="plus"
//                         size={16}
//                         color="#FFFFFF"
//                         style={{ marginRight: 4 }}
//                       />
//                       <Text className="text-white font-medium text-xs">
//                         Добавить
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             ))
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default DashboardScreen;

import { View, Text } from 'react-native'
import React from 'react'

export default function dashboard() {
  return (
    <View>
      <Text>dashboard</Text>
    </View>
  )
}