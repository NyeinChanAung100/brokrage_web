import axiosInstance from '../api/axiosInstance';

export const listItems = async () => {
  return await axiosInstance.get('/market/listItems.php');
};

export const tradeItem = async (tradeData) => {
  return await axiosInstance.post('/market/trade.php', tradeData);
};

// Add other market-related operations as needed
