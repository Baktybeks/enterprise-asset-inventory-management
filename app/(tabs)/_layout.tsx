// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Icon, IconAliasName } from '@/constants/ionIcons';

// Интерфейс для пропсов компонента TabBarIcon
interface TabBarIconProps {
  name: IconAliasName;
  color: string;
  size: number;
  focused: boolean;
  title: string;
}

// Компонент для отображения иконки вкладки
const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, size, focused, title }) => {
  // Создаем контейнер с эффектом выделения для активной вкладки
  if (focused) {
    return (
      <View className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 
        justify-center items-center rounded-full overflow-hidden bg-primary/20">
        <Icon name={name} size={size} color={color} />
        <Text className="text-primary text-base font-semibold ml-2">
          {title}
        </Text>
      </View>
    );
  }
  
  // Простая иконка для неактивной вкладки
  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Icon name={name} size={size} color={color} />
    </View>
  );
};

// Стиль для фона вкладок
const tabBarBackground: React.FC = () => (
  <BlurView
    tint="light"
    intensity={80}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 50,
      overflow: 'hidden',
    }}
  />
);

// Компонент layout для вкладок
const TabsLayout: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#F5F7FA",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#E0E7FF",
        } as StyleProp<ViewStyle>,
        tabBarActiveTintColor: "#5B67CA",
        tabBarInactiveTintColor: "#A8B5DB",
        headerShown: false,
        tabBarBackground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Инвентарь",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon 
              focused={focused} 
              name="package" 
              color={color} 
              size={24} 
              title="Инвентарь" 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Сканировать",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon 
              focused={focused} 
              name="scan" 
              color={color} 
              size={24} 
              title="Сканировать" 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Поиск",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon 
              focused={focused} 
              name="search" 
              color={color} 
              size={24} 
              title="Поиск" 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Панель",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon 
              focused={focused} 
              name="dashboard" 
              color={color} 
              size={24} 
              title="Панель" 
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;