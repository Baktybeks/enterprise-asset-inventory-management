// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   SafeAreaView,
//   Image,
//   StatusBar,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { useInventory } from "@/context/InventoryContext";
// import { Icon } from "@/constants/ionIcons";
// import { images } from "@/constants/images";

// const SearchScreen = () => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const { searchItems } = useInventory();
//   const router = useRouter();

//   // Обновление результатов поиска при изменении запроса
//   useEffect(() => {
//     if (query.trim().length > 0) {
//       setResults(searchItems(query));
//     } else {
//       setResults([]);
//     }
//   }, [query, searchItems]);

//   // Рендер элемента результатов поиска
//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       className="bg-white rounded-xl mx-3 mb-3 p-3 shadow-sm flex-row"
//       onPress={() => router.push(`/item/${item.id}`)}
//     >
//       <View className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center mr-3">
//         {item.image ? (
//           <Image
//             source={{ uri: item.image }}
//             className="w-full h-full rounded-lg"
//           />
//         ) : (
//           <Icon name="package" size={24} color="#6B7280" />
//         )}
//       </View>

//       <View className="flex-1 justify-center">
//         <Text className="text-base font-medium text-gray-800">{item.name}</Text>
//         <View className="flex-row items-center mt-1">
//           <Icon
//             name="barcode"
//             size={16}
//             color="#9CA3AF"
//             style={{ marginRight: 4 }}
//           />
//           <Text className="text-xs text-gray-500">{item.barcode}</Text>
//         </View>
//         <View className="flex-row justify-between mt-1">
//           <View className="bg-primary/10 px-2 py-1 rounded-full">
//             <Text className="text-xs text-primary font-medium">
//               {item.category}
//             </Text>
//           </View>
//           <Text className="text-sm font-bold text-primary">
//             {item.quantity} шт.
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderEmptyResults = () => (
//     <View className="items-center justify-center py-10">
//       {query.trim().length > 0 ? (
//         <>
//           <Image
//             source={images.noResults}
//             className="w-40 h-40"
//             tintColor="#D1D5DB"
//           />
//           <Text className="text-gray-400 text-base mt-4">
//             Товары не найдены
//           </Text>
//         </>
//       ) : (
//         <>
//           <Image
//             source={images.search}
//             className="w-40 h-40"
//             tintColor="#D1D5DB"
//           />
//           <Text className="text-gray-400 text-base mt-4">
//             Введите запрос для поиска товаров
//           </Text>
//         </>
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-[#F5F7FA]">
//       <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

//       {/* Заголовок */}
//       <View className="px-4 pt-12 pb-4">
//         <Text className="text-2xl font-bold text-gray-800">Поиск товаров</Text>
//         <Text className="text-gray-500 mt-1">
//           Найдите товары по названию, категории или штрихкоду
//         </Text>
//       </View>

//       {/* Строка поиска */}
//       <View className="px-4 pb-4">
//         <View className="flex-row bg-white rounded-xl px-4 py-3 items-center shadow-sm">
//           <Icon
//             name="search"
//             size={20}
//             color="#9CA3AF"
//             style={{ marginRight: 12 }}
//           />
//           <TextInput
//             className="flex-1 text-gray-800"
//             placeholder="Введите название или штрихкод"
//             value={query}
//             onChangeText={setQuery}
//             autoFocus={false}
//           />
//           {query.length > 0 && (
//             <TouchableOpacity onPress={() => setQuery("")}>
//               <Icon name="close" size={20} color="#9CA3AF" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {/* Результаты поиска */}
//       <FlatList
//         data={results}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         ListEmptyComponent={renderEmptyResults}
//       />

//       {/* Кнопка добавления товара вручную */}
//       <TouchableOpacity
//         className="absolute bottom-24 right-5 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
//         onPress={() => router.push("/item/create")}
//       >
//         <Icon name="plus" size={24} color="#FFFFFF" />
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// export default SearchScreen;
import { View, Text } from "react-native";
import React from "react";

export default function search() {
  return (
    <View>
      <Text>search</Text>
    </View>
  );
}
