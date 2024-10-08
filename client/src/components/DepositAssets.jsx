import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { allItemAtom } from '../atoms/allItemAtom.js';
import {
  depositAssets,
  viewAssets,
  viewUserAssets,
} from '../services/userService.js';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';

const DepositAssets = () => {
  const [marketData, setMarketData] = useState([]);
  const [item_id, setItem_id] = useState('');
  const [amount, setAmount] = useState('');
  const currentUser = useRecoilValue(userAtom);
  const [userItems, setUserItems] = useState([]);
  const [currentItemAmount, setCurrentItemAmount] = useState('');

  const fetchUserItems = async () => {
    try {
      const data = await viewUserAssets(currentUser.id);
      console.log('Fetched User Assets:', data);
      setUserItems(data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
    fetchUserItems();
  }, []);

  const fetchData = async () => {
    try {
      const data = await viewAssets();
      setMarketData(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  console.log(item_id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to deposit this asset?')) {
      if (item_id === '' || amount === '') {
        alert('Please fill all fields');
        return;
      }

      const data = await depositAssets({
        item_id,
        quantity: amount,
        user_id: currentUser.id,
      });

      if (data.success) {
        alert(amount + ' ' + data.message);
        setCurrentItemAmount(currentItemAmount + parseInt(amount));
      }
    }
  };

  const handleItemChange = (e) => {
    setItem_id(e.target.value);
    console.log(userItems);
    const item = userItems.find((item) => item.item_id == e.target.value);
    console.log(item);
    setCurrentItemAmount(item?.quantity ?? 0);
    // const item = marketData.find((item) => item.id === e.target.value);
    // setCurrentItemAmount(item.quantity);
    setItem_id(e.target.value);
  };

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      justifyContent='center'
      alignItems='center'
      p={4}
    >
      <Box
        bg={useColorModeValue('white', 'gray.900')}
        p={8}
        boxShadow='lg'
        rounded='lg'
        width='100%'
        maxWidth='600px'
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align='stretch'>
            <Box>
              <p>Current item balance: {currentItemAmount}</p>
            </Box>
            <FormControl id='asset' isRequired>
              <FormLabel>Select Asset</FormLabel>
              <Select placeholder='Select Asset' onChange={handleItemChange}>
                {marketData.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id='amount' isRequired>
              <FormLabel>Amount</FormLabel>
              <Input
                type='number'
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                placeholder='Enter amount'
              />
            </FormControl>

            <HStack justify='space-between'>
              <Button colorScheme='blue' type='submit' width='100%'>
                Deposit Asset
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default DepositAssets;
