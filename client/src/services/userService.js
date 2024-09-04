// src/services/userService.js

import axiosInstance from '../api/axiosInstance';

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/user/register.php', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const viewBalance = async (userId) => {
  try {
    const response = await axiosInstance.post('/user/view-money.php', {
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error viewing balance:', error);
    throw error;
  }
};

export const depositMoney = async (depositData) => {
  try {
    const response = await axiosInstance.post(
      '/user/deposit-money.php',
      depositData,
    );
    return response.data;
  } catch (error) {
    console.error('Error depositing money:', error);
    throw error;
  }
};
export const setWatchList = async (watchListData) => {
  try {
    const response = await axiosInstance.post(
      '/user/watch-list-controller.php',
      watchListData,
    );
    return response.data;
  } catch (error) {
    console.error('Error depositing money:', error);
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post('/user/login.php', loginData);
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post('/user/logout.php');
    return response.data;
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};

export const viewAssets = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/user/view-assests.php?user_id=${userId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error viewing assets:', error);
    throw error;
  }
};

export const depositAssets = async (depositData) => {
  try {
    const response = await axiosInstance.post(
      '/user/deposit-assest.php',
      depositData,
    );
    return response.data;
  } catch (error) {
    console.error('Error depositing assets:', error);
    throw error;
  }
};

export const viewUserAssets = async (userId) => {
  try {
    const response = await axiosInstance.post('/user/view-user-assests.php', {
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error viewing user assets:', error);
    throw error;
  }
};

export const viewItemPrice = async (itemId) => {
  try {
    const response = await axiosInstance.get('/user/view-item-price.php', {
      item_id: itemId,
    });
    return response.data;
  } catch (error) {
    console.error('Error viewing item price:', error);
    throw error;
  }
};

export const viewPriceLog = async (itemId) => {
  try {
    const response = await axiosInstance.get('/user/view-price-log.php', {
      params: { item_id: itemId },
    });
    return response.data;
  } catch (error) {
    console.error('Error viewing price log:', error);
    throw error;
  }
};
export const viewItems = async () => {
  try {
    const response = await axiosInstance.get('user/view-assests.php');
    return response.data;
  } catch (error) {
    console.error('Error viewing price log:', error);
    throw error;
  }
};
