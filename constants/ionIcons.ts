import React from "react";
import { StyleProp, ViewStyle, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];
export const IconAlias = {
  home: "home-outline" as IoniconName,
  scan: "scan-outline" as IoniconName,
  search: "search-outline" as IoniconName,
  dashboard: "stats-chart-outline" as IoniconName,
  plus: "add-outline" as IoniconName,
  minus: "remove-outline" as IoniconName,
  edit: "create-outline" as IoniconName,
  delete: "trash-outline" as IoniconName,
  trash: "trash-outline" as IoniconName,
  back: "arrow-back-outline" as IoniconName,
  close: "close-outline" as IoniconName,
  barcode: "barcode-outline" as IoniconName,
  package: "cube-outline" as IoniconName,
  flashOn: "flash-outline" as IoniconName,
  flashOff: "flash-off-outline" as IoniconName,
  keyboard: "keypad-outline" as IoniconName,
  checkCircle: "checkmark-circle-outline" as IoniconName,
  noCamera: "camera-off-outline" as IoniconName,
  settings: "settings-outline" as IoniconName,
  filter: "filter-outline" as IoniconName,
  sort: "funnel-outline" as IoniconName,
  calendar: "calendar-outline" as IoniconName,
  info: "information-circle-outline" as IoniconName,
  warning: "warning-outline" as IoniconName,
  error: "alert-circle-outline" as IoniconName,
  success: "checkmark-circle-outline" as IoniconName,
  upload: "cloud-upload-outline" as IoniconName,
  download: "cloud-download-outline" as IoniconName,
  user: "person-outline" as IoniconName,
  users: "people-outline" as IoniconName,
  cart: "cart-outline" as IoniconName,
  menu: "menu-outline" as IoniconName,
  notifications: "notifications-outline" as IoniconName,
  star: "star-outline" as IoniconName,
  starFilled: "star" as IoniconName,
  heart: "heart-outline" as IoniconName,
  heartFilled: "heart" as IoniconName,
  bookmark: "bookmark-outline" as IoniconName,
  bookmarkFilled: "bookmark" as IoniconName,
  share: "share-outline" as IoniconName,
  print: "print-outline" as IoniconName,
  save: "save-outline" as IoniconName,
  refresh: "refresh-outline" as IoniconName,
  lock: "lock-closed-outline" as IoniconName,
  unlock: "lock-open-outline" as IoniconName,
  eye: "eye-outline" as IoniconName,
  eyeOff: "eye-off-outline" as IoniconName,
  pin: "pin-outline" as IoniconName,
  layers: "layers-outline" as IoniconName,
  list: "list-outline" as IoniconName,
  grid: "grid-outline" as IoniconName,
  camera: "camera-outline" as IoniconName,
  image: "image-outline" as IoniconName,
  time: "time-outline" as IoniconName,
  clock: "time-outline" as IoniconName,
  attach: "attach-outline" as IoniconName,
  link: "link-outline" as IoniconName,
  money: "cash-outline" as IoniconName,
  card: "card-outline" as IoniconName,
  send: "send-outline" as IoniconName,
  mail: "mail-outline" as IoniconName,
  phone: "call-outline" as IoniconName,
  location: "location-outline" as IoniconName,
  compass: "compass-outline" as IoniconName,
  exit: "exit-outline" as IoniconName,
  help: "help-circle-outline" as IoniconName,
  question: "help-circle-outline" as IoniconName,
  category: "folder-outline" as IoniconName,
} as const;

export type IconAliasName = keyof typeof IconAlias;

export interface IconProps {
  name: IconAliasName | IoniconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}
export const Icon = (props: IconProps): React.ReactElement => {
  const { name, size = 24, color = "#000", style = {} } = props;
  const iconName =
    name in IconAlias
      ? IconAlias[name as IconAliasName]
      : (name as IoniconName);
  return React.createElement(Ionicons, {
    name: iconName,
    size,
    color,
    style: style as unknown as StyleProp<TextStyle>,
  });
};
