import { Camera } from "expo-camera";

export const requestCameraPermission = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === "granted";
};

export const checkCameraPermission = async () => {
  const { status } = await Camera.getPermissionsAsync();
  return status === "granted";
};

export const getSupportedBarCodeTypes = () => {
  return Camera.Constants.BarCodeType;
};
