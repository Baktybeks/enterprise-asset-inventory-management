import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
};

const Button = ({
  title,
  onPress,
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
}: ButtonProps) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-500";
      case "secondary":
        return "bg-gray-200";
      case "danger":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return "text-white";
      case "secondary":
        return "text-gray-800";
      case "danger":
        return "text-white";
      default:
        return "text-white";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`py-3 px-4 rounded-lg items-center justify-center ${getButtonStyle()} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "secondary" ? "#4B5563" : "#FFFFFF"}
        />
      ) : (
        <Text className={`font-medium ${getTextStyle()}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
