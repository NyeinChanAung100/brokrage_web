import axiosInstance from '../api/axiosInstance';

export const registerUser = async (userData) => {
  return await axiosInstance.post('/user/register.php', userData);
};

export const viewBalance = async (userId) => {
  return await axiosInstance.post('/user/view-balance.php', {
    user_id: userId,
  });
};

export const depositMoney = async (depositData) => {
  return await axiosInstance.post('/user/deposit-money.php', depositData);
};

// Add other user-related operations as needed
