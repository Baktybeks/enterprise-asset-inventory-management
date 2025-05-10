// components/IconButton.tsx
import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { IconName, IoniconName, getIoniconName } from "@/constants/ionIcons";

// Варианты размеров кнопок
export type IconButtonSize = "small" | "medium" | "large";

// Варианты типов кнопок
export type IconButtonType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "transparent";

// Интерфейс пропсов компонента
interface IconButtonProps extends Omit<TouchableOpacityProps, "style"> {
  icon: IconName | IoniconName;
  size?: IconButtonSize;
  type?: IconButtonType;
  circle?: boolean;
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
  haptic?: boolean;
  hapticType?: "selection" | "impact" | "notification";
  hapticOptions?: {
    impact?: Haptics.ImpactFeedbackStyle;
    notification?: Haptics.NotificationFeedbackType;
  };
  onPress?: (event: GestureResponderEvent) => void;
}

/**
 * Компонент IconButton - кнопка с иконкой
 *
 * @example
 * <IconButton
 *   icon="trash"
 *   type="danger"
 *   size="medium"
 *   circle
 *   onPress={handleDelete}
 *   haptic
 * />
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = "medium",
  type = "primary",
  circle = false,
  style,
  iconColor,
  haptic = true,
  hapticType = "selection",
  hapticOptions = {
    impact: Haptics.ImpactFeedbackStyle.Medium,
    notification: Haptics.NotificationFeedbackType.Success,
  },
  onPress,
  ...otherProps
}) => {
  // Определяем размер иконки и кнопки в зависимости от переданного размера
  const dimensions = {
    small: { button: 32, icon: 16 },
    medium: { button: 40, icon: 20 },
    large: { button: 48, icon: 24 },
  };

  const buttonSize = dimensions[size].button;
  const iconSize = dimensions[size].icon;

  // Определяем цвета в зависимости от типа кнопки
  const colors = {
    primary: { bg: "#5B67CA", color: "#FFFFFF" },
    secondary: { bg: "#E0E7FF", color: "#5B67CA" },
    tertiary: { bg: "#F5F7FA", color: "#6B7280" },
    danger: { bg: "#FEE2E2", color: "#EF4444" },
    transparent: { bg: "transparent", color: "#6B7280" },
  };

  // Получаем имя иконки из Ionicons
  const iconName = getIoniconName(icon);

  // Определяем цвет иконки
  const color = iconColor || colors[type].color;

  // Обработчик нажатия с тактильной обратной связью
  const handlePress = (event: GestureResponderEvent): void => {
    if (haptic) {
      // Применяем тактильную обратную связь в зависимости от типа
      switch (hapticType) {
        case "selection":
          Haptics.selectionAsync();
          break;
        case "impact":
          Haptics.impactAsync(
            hapticOptions.impact || Haptics.ImpactFeedbackStyle.Medium
          );
          break;
        case "notification":
          Haptics.notificationAsync(
            hapticOptions.notification ||
              Haptics.NotificationFeedbackType.Success
          );
          break;
      }
    }

    // Вызываем оригинальный обработчик нажатия, если он есть
    if (onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors[type].bg,
          width: buttonSize,
          height: buttonSize,
          borderRadius: circle ? buttonSize / 2 : 8,
        },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      {...otherProps}
    >
      <Ionicons name={iconName} size={iconSize} color={color} />
    </TouchableOpacity>
  );
};

// Стили
const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IconButton;
