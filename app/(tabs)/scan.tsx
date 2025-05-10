// app/(tabs)/scan.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useInventoryItemByBarcode } from "@/services/inventoryService";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@/constants/ionIcons";

const ScanScreen: React.FC = () => {
  const [flashOn, setFlashOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [currentBarcode, setCurrentBarcode] = useState<string | null>(null);
  const [processingNavigate, setProcessingNavigate] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: existingItem, isLoading } = useInventoryItemByBarcode(
    currentBarcode || "",
    {
      refetchOnMount: true,
      staleTime: 0,
      cacheTime: 0, // Полностью отключаем кеширование для этого запроса
    }
  );

  useFocusEffect(
    React.useCallback(() => {
      setScanned(false);
      setCurrentBarcode(null);
      setProcessingNavigate(false);
      if (queryClient) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "inventory" &&
            query.queryKey[1] === "barcode",
        });
      }

      return () => {};
    }, [queryClient])
  );

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (scanned || processingNavigate) return;

    setScanned(true);
    setCurrentBarcode(data);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  useEffect(() => {
    if (!currentBarcode || !scanned || processingNavigate) return;

    if (!isLoading) {
      setProcessingNavigate(true);
      if (existingItem && existingItem.id) {
        router.push(`/item/${existingItem.id}?scanned=true`);
      } else {
        router.push({
          pathname: "/item/[id]",
          params: {
            id: "create",
            barcode: currentBarcode,
            scanned: "true",
          },
        });
      }
    }
  }, [
    existingItem,
    isLoading,
    currentBarcode,
    scanned,
    router,
    processingNavigate,
  ]);

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  const goToManualEntry = () => {
    router.push("/search");
  };

  const resetScanner = () => {
    if (queryClient && currentBarcode) {
      queryClient.invalidateQueries({
        queryKey: ["inventory", "barcode", currentBarcode],
      });
    }

    setScanned(false);
    setCurrentBarcode(null);
    setProcessingNavigate(false);
  };

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-[#F5F7FA]">
        <ActivityIndicator size="large" color="#5B67CA" />
        <Text className="mt-4 text-gray-600">Запрос разрешений...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-[#F5F7FA]">
        <Icon
          name="camera-outline"
          size={80}
          color="#9CA3AF"
          style={{ marginBottom: 16 }}
        />
        <Text className="text-lg text-center text-gray-800 mb-2">
          Нет доступа к камере
        </Text>
        <Text className="text-center text-gray-600 mb-4">
          Пожалуйста, предоставьте разрешение на использование камеры для
          сканирования штрихкодов
        </Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-full"
          onPress={requestPermission}
        >
          <Text className="text-white font-medium">Разрешить доступ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading && scanned) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-[#F5F7FA]">
        <ActivityIndicator size="large" color="#5B67CA" />
        <Text className="mt-4 text-gray-600">Поиск товара...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <CameraView
        enableTorch={flashOn}
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_e", "code39", "code128", "qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View className="flex-1 justify-center items-center">
          <View className="absolute top-0 left-0 right-0 h-1/3 bg-black/50" />
          <View className="absolute top-1/3 left-0 w-1/6 h-1/3 bg-black/50" />
          <View className="absolute top-1/3 right-0 w-1/6 h-1/3 bg-black/50" />
          <View className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/50" />
          <View className="w-2/3 h-1/3 border-2 border-primary rounded-lg">
            <View className="border-l-4 border-t-4 border-primary w-8 h-8 absolute top-0 left-0 rounded-tl-lg" />
            <View className="border-r-4 border-t-4 border-primary w-8 h-8 absolute top-0 right-0 rounded-tr-lg" />
            <View className="border-l-4 border-b-4 border-primary w-8 h-8 absolute bottom-0 left-0 rounded-bl-lg" />
            <View className="border-r-4 border-b-4 border-primary w-8 h-8 absolute bottom-0 right-0 rounded-br-lg" />
          </View>
          <Text className="absolute top-1/4 text-white text-center text-lg font-medium px-5">
            Наведите камеру на штрихкод товара
          </Text>
        </View>
        <View className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-4">
          <TouchableOpacity
            className="w-10 h-10 bg-black/50 rounded-full items-center justify-center"
            onPress={() => router.back()}
          >
            <Icon name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-10 h-10 bg-black/50 rounded-full items-center justify-center"
            onPress={toggleFlash}
          >
            <Icon
              name={flashOn ? "flash" : "flash-off"}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-8 left-0 right-0 items-center">
          {scanned && (
            <TouchableOpacity
              className="bg-primary px-6 py-3 rounded-full mb-4"
              onPress={resetScanner}
            >
              <Text className="text-white font-medium">Сканировать снова</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="bg-white/20 px-6 py-3 rounded-full flex-row items-center"
            onPress={goToManualEntry}
          >
            <Icon
              name="keypad"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white">Ввести штрихкод вручную</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

export default ScanScreen;
