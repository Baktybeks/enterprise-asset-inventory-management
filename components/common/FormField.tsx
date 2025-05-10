// components/FormField.tsx
import React, { ReactNode } from "react";
import { View, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { IconName, IoniconName, Icon } from "@/constants/ionIcons";

interface FormFieldProps {
  label: string;
  icon?: IconName | IoniconName;
  error?: string;
  hint?: string;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<TextStyle>;
  hintStyle?: StyleProp<TextStyle>;
  children: ReactNode;
}

/**
 * Компонент FormField - поле формы с иконкой и подписью
 *
 * @example
 * <FormField
 *   label="Название товара"
 *   icon="create"
 *   required
 *   error={errors.name}
 * >
 *   <TextInput
 *     value={name}
 *     onChangeText={setName}
 *     placeholder="Введите название товара"
 *   />
 * </FormField>
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  icon,
  error,
  hint,
  required = false,
  containerStyle,
  labelStyle,
  inputContainerStyle,
  errorStyle,
  hintStyle,
  children,
}) => {
  return (
    <View className="mb-4" style={containerStyle}>
      {/* Метка поля с индикатором обязательности */}
      <View className="flex-row items-center mb-1">
        <Text className="text-gray-700 font-medium" style={labelStyle}>
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      </View>

      {/* Контейнер для ввода с иконкой */}
      <View
        className={`flex-row items-center rounded-lg px-3 py-2 ${
          error ? "bg-red-50 border border-red-300" : "bg-gray-100"
        }`}
        style={inputContainerStyle}
      >
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={error ? "#EF4444" : "#6B7280"}
            style={{ marginRight: 8 }}
          />
        )}
        {children}
      </View>

      {/* Сообщение об ошибке */}
      {error && (
        <Text className="text-red-500 text-xs mt-1" style={errorStyle}>
          {error}
        </Text>
      )}

      {/* Подсказка */}
      {hint && !error && (
        <Text className="text-gray-500 text-xs mt-1" style={hintStyle}>
          {hint}
        </Text>
      )}
    </View>
  );
};

export default FormField;
