import { v4 as uuidv4 } from 'uuid';

const USER_NAME_KEY = 'user_name';
const DEVICE_ID_KEY = 'device_id';

export const getOrGenerateDeviceId = (): string => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = uuidv4(); // 使用 UUID 生成唯一 ID
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

export const getUserName = (): string => {
  return localStorage.getItem(USER_NAME_KEY) || '';
};

export const setUserName = (userName: string): void => {
  localStorage.setItem(USER_NAME_KEY, userName);
};
