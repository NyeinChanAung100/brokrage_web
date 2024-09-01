import { useEffect, useState } from 'react';
// import { listItems, tradeItem } from './services/marketService';
import {
  registerUser,
  viewBalance,
  depositMoney,
} from './services/userService';
import { Button } from '@chakra-ui/react';

const MyComponent = () => {
  //   const [items, setItems] = useState([]);
  //   const [balance, setBalance] = useState(null);

  // useEffect(() => {
  //   const fetchItems = async () => {
  //     const response = await listItems();
  //     setItems(response.data);
  //   };

  //   fetchItems();
  // }, []);

  //   const handleTrade = async () => {
  //     const tradeData = {
  //       user_id: 1,
  //       item_id: 1,
  //       trade_type: 'buy',
  //       quantity: 1,
  //     };
  //     await tradeItem(tradeData);

  //   };

  const handleRegister = async () => {
    const userData = {
      username: 'nilar',
      password: 'abc456',
      email: 'nilar@gmail.com',
    };
    await registerUser(userData);
    // Handle response or update state as needed
  };

  return (
    <div>
      {/* Render items, balance, and handle user actions */}
      <Button onClick={handleRegister}>register</Button>
    </div>
  );
};

export default MyComponent;
