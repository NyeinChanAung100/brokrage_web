// src/services/marketService.js

import axiosInstance from '../api/axiosInstance';

export const listItems = async () => {
  try {
    const response = await axiosInstance.get('/market/listItems.php');
    return response.data;
  } catch (error) {
    console.error('Error listing items:', error);
    throw error;
  }
};

export const tradeItem = async (tradeData) => {
  try {
    const response = await axiosInstance.post('/market/trade.php', tradeData);
    return response.data;
  } catch (error) {
    console.error('Error trading item:', error);
    throw error;
  }
};

// Additional market-related operations can be added here as needed.
