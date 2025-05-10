export const colors = {
  primary: "#3B82F6", // Синий
  secondary: "#F5F7FF", // Светло-синий
  background: "#FFFFFF", // Белый
  text: "#1F2937", // Темно-серый
  textSecondary: "#6B7280", // Серый
  border: "#E5E7EB", // Светло-серый
  success: "#10B981", // Зеленый
  warning: "#F59E0B", // Желтый
  error: "#EF4444", // Красный
  transparent: "transparent",
  textLight: "#fff",
  shadowColor: "#000",
  surface: "transparent",
};

export const getCategoryColor = (category: string) => {
  const colors = [
    "#5B67CA", // primary
    "#F97316", // orange
    "#22C55E", // green
    "#06B6D4", // cyan
    "#8B5CF6", // violet
    "#EC4899", // pink
    "#F43F5E", // rose
    "#FACC15", // yellow
  ];

  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};
