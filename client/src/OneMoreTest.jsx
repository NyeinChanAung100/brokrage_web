import { useEffect, useState } from 'react';
// import { listItems, tradeItem } from './services/marketService';
import {
  registerUser,
  depositMoney,
  viewBalance,
} from './services/userService';
import { Button } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';

const MyComponent = () => {
  // console.log('value', value);
  const handleRegister = async () => {
    const data = await viewBalance(1);
    console.log('first:', data);
    // const userData = {
    //   username: 'jyQ11',
    //   password: '88UIUIUI',
    //   email: 'JJU11@gmail.com',
    // };
    // await registerUser(userData);
  };

  return (
    <div>
      {/* Render items, balance, and handle user actions */}
      <Button onClick={handleRegister}>register</Button>
    </div>
  );
};

export default MyComponent;
