// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   TouchableOpacity, 
//   Alert,
//   ActivityIndicator,
//   SafeAreaView
// } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { useRouter } from 'expo-router';
// import { useInventory } from '@/context/InventoryContext';
// import { Icon } from '@/constants/ionIcons';

// const ScanScreen = () => {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [scanning, setScanning] = useState(true);
//   const [scanned, setScanned] = useState(false);
//   const [flashOn, setFlashOn] = useState(false);
//   const router = useRouter();
  
//   const { getItemByBarcode } = useInventory();

//   // Запрос разрешения на использование камеры
//   useEffect(() => {
//     const getBarCodeScannerPermissions = async () => {
//       try {
//         const { status } = await BarCodeScanner.requestPermissionsAsync();
//         setHasPermission(status === 'granted');
//       } catch (error) {
//         console.error('Ошибка при запросе разрешений:', error);
//         Alert.alert('Ошибка', 'Не удалось получить доступ к камере');
//       }
//     };

//     getBarCodeScannerPermissions();
//   }, []);

//   // Обработчик сканирования штрихкода
//   const handleBarCodeScanned = ({ type, data }) => {
//     if (scanned || !scanning) return;
    
//     setScanned(true);
    
//     // Вибрация для обратной связи
//     try {
//       // Если доступна вибрация на устройстве
//       if (navigator.vibrate) {
//         navigator.vibrate(100);
//       }
//     } catch (e) {
//       // Игнорируем ошибки вибрации
//     }
    
//     // Проверяем, существует ли товар с таким штрихкодом
//     const existingItem = getItemByBarcode(data);
    
//     if (existingItem) {
//       // Если товар существует, перенаправляем на экран детализации
//       router.push(`/item/${existingItem.id}?scanned=true`);
//     } else {
//       // Если товар не существует, перенаправляем на экран создания нового товара
//       router.push({
//         pathname: '/item/create',
//         params: { barcode: data, type, scanned: true }
//       });
//     }
//   };

//   const toggleFlash = () => {
//     setFlashOn(!flashOn);
//   };

//   const renderCameraView = () => {
//     if (hasPermission === null) {
//       return (
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color="#5B67CA" />
//           <Text className="mt-4 text-gray-600">Запрос разрешений...</Text>
//         </View>
//       );
//     }
    
//     if (hasPermission === false) {
//       return (
//         <View className="flex-1 justify-center items-center p-5">
//           <Icon 
//             name="noCamera" 
//             size={80}
//             color="#9CA3AF" 
//             style={{ marginBottom: 16 }}
//           />
//           <Text className="text-lg text-center text-gray-800 mb-2">
//             Нет доступа к камере
//           </Text>
//           <Text className="text-center text-gray-600 mb-4">
//             Пожалуйста, предоставьте разрешение на использование камеры в настройках устройства
//           </Text>
//           <TouchableOpacity 
//             className="bg-primary px-6 py-3 rounded-full"
//             onPress={() => {
//               Alert.alert(
//                 'Разрешения',
//                 'Перейдите в настройки приложения, чтобы предоставить доступ к камере',
//                 [
//                   { text: 'OK' }
//                 ]
//               );
//             }}
//           >
//             <Text className="text-white font-medium">Настройки</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }

//     return (
//       <View className="flex-1">
//         <BarCodeScanner
//           barCodeTypes={[
//             BarCodeScanner.Constants.BarCodeType.ean13,
//             BarCodeScanner.Constants.BarCodeType.ean8,
//             BarCodeScanner.Constants.BarCodeType.upc_a,
//             BarCodeScanner.Constants.BarCodeType.upc_e,
//             BarCodeScanner.Constants.BarCodeType.code39,
//             BarCodeScanner.Constants.BarCodeType.code128,
//             BarCodeScanner.Constants.BarCodeType.qr,
//           ]}
//           onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//           style={StyleSheet.absoluteFillObject}
//           flashMode={flashOn ? BarCodeScanner.Constants.FlashMode.torch : BarCodeScanner.Constants.FlashMode.off}
//         />
        
//         {/* Оверлей для сканирования */}
//         <View className="flex-1 justify-center items-center">
//           {/* Верхняя часть затемнения */}
//           <View className="absolute top-0 left-0 right-0 bottom-1/3 bg-black/50" />
          
//           {/* Левая часть затемнения */}
//           <View className="absolute top-1/3 left-0 width-1/6 h-1/3 bg-black/50" />
          
//           {/* Правая часть затемнения */}
//           <View className="absolute top-1/3 right-0 width-1/6 h-1/3 bg-black/50" />
          
//           {/* Нижняя часть затемнения */}
//           <View className="absolute bottom-0 left-0 right-0 top-2/3 bg-black/50" />
          
//           {/* Рамка для сканирования */}
//           <View className="w-2/3 h-1/3 border-2 border-primary rounded-lg">
//             <View className="border-l-4 border-t-4 border-primary w-8 h-8 absolute top-0 left-0 rounded-tl-lg" />
//             <View className="border-r-4 border-t-4 border-primary w-8 h-8 absolute top-0 right-0 rounded-tr-lg" />
//             <View className="border-l-4 border-b-4 border-primary w-8 h-8 absolute bottom-0 left-0 rounded-bl-lg" />
//             <View className="border-r-4 border-b-4 border-primary w-8 h-8 absolute bottom-0 right-0 rounded-br-lg" />
//           </View>
          
//           {/* Текст с инструкциями */}
//           <Text className="absolute top-1/4 text-white text-center text-lg font-medium px-5">
//             Наведите камеру на штрихкод товара
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-black">
//       {renderCameraView()}
      
//       {/* Верхняя панель */}
//       <View className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-4">
//         <TouchableOpacity 
//           className="w-10 h-10 bg-black/50 rounded-full items-center justify-center"
//           onPress={() => router.back()}
//         >
//           <Icon name="close" size={20} color="#FFFFFF" />
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           className="w-10 h-10 bg-black/50 rounded-full items-center justify-center"
//           onPress={toggleFlash}
//         >
//           <Icon 
//             name={flashOn ? "flashOn" : "flashOff"} 
//             size={20} 
//             color="#FFFFFF" 
//           />
//         </TouchableOpacity>
//       </View>
      
//       {/* Нижняя панель */}
//       <View className="absolute bottom-8 left-0 right-0 items-center">
//         {scanned && (
//           <TouchableOpacity 
//             className="bg-primary px-6 py-3 rounded-full mb-4"
//             onPress={() => setScanned(false)}
//           >
//             <Text className="text-white font-medium">Сканировать снова</Text>
//           </TouchableOpacity>
//         )}
        
//         <TouchableOpacity 
//           className="bg-white/20 px-6 py-3 rounded-full flex-row items-center"
//           onPress={() => router.push('/search')}
//         >
//           <Icon name="keyboard" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
//           <Text className="text-white">Ввести штрихкод вручную</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ScanScreen;
import { View, Text } from 'react-native'
import React from 'react'

export default function scan() {
  return (
    <View>
      <Text>scan</Text>
    </View>
  )
}