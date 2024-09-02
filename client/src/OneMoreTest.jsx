import { useEffect, useState } from 'react';
// import { listItems, tradeItem } from './services/marketService';
import {
  registerUser,
  viewBalance,
  depositMoney,
} from './services/userService';
import { Button } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';

const MyComponent = () => {
  const value = useRecoilValue(userAtom);
  console.log('value', value);
  const handleRegister = async () => {
    const userData = {
      username: 'jyQ11',
      password: '88UIUIUI',
      email: 'JJU11@gmail.com',
    };
    await registerUser(userData);
  };

  return (
    <div>
      {/* Render items, balance, and handle user actions */}
      <Button onClick={handleRegister}>register</Button>
    </div>
  );
};

export default MyComponent;
