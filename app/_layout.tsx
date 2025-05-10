// app/_layout.tsx
import { Stack, SplashScreen } from "expo-router";
import "./global.css";
import React, { useEffect, useState } from "react";
import { StatusBar, View, Text, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { initializeAppwrite } from "@/services/inventoryService";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [isAppwriteInitialized, setIsAppwriteInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(
    null
  );
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const setupAppwrite = async () => {
      try {
        setIsInitializing(true);
        console.log("Начинаем простую инициализацию Appwrite...");
        const success = await initializeAppwrite();
        console.log("Результат инициализации Appwrite:", success);
        setIsAppwriteInitialized(success);
        if (!success) {
          setInitializationError(
            "Не удалось подключиться к базе данных. Проверьте настройки и подключение к интернету."
          );
        }
      } catch (error) {
        console.error("Ошибка при инициализации:", error);
        setInitializationError(
          `Ошибка при инициализации: ${
            error instanceof Error ? error.message : "Неизвестная ошибка"
          }`
        );
        setIsAppwriteInitialized(false);
      } finally {
        setIsInitializing(false);
      }
    };

    setupAppwrite();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (isInitializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5F7FA",
        }}
      >
        <ActivityIndicator size="large" color="#5B67CA" />
        <Text style={{ marginTop: 16, color: "#666" }}>
          Подключение к базе данных...
        </Text>
      </View>
    );
  }

  if (initializationError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5F7FA",
          padding: 20,
        }}
      >
        <Text
          style={{
            color: "#EF4444",
            marginBottom: 10,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Ошибка подключения
        </Text>
        <Text style={{ color: "#666", textAlign: "center" }}>
          {initializationError}
        </Text>
        <Text style={{ color: "#666", marginTop: 20, textAlign: "center" }}>
          Проверьте настройки подключения к Appwrite в переменных окружения:
        </Text>
        <Text style={{ color: "#666", marginTop: 10, textAlign: "center" }}>
          EXPO_PUBLIC_APPWRITE_DATABASE_ID{"\n"}
          EXPO_PUBLIC_APPWRITE_COLLECTION_ID{"\n"}
          EXPO_PUBLIC_APPWRITE_PROJECT_ID
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="item/[id]"
              options={{
                headerShown: false,
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
