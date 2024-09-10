import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Select,
} from '@chakra-ui/react';
import { depositMoney, viewBalance } from '../services/userService';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const DepositMoney = () => {
  const [amount, setAmount] = useState('');
  const currentUser = useRecoilValue(userAtom);
  const [userAmount, setUserAmount] = useState('');
  console.log('userAmount:', userAmount);
  useEffect(() => {
    const fetchUserAmount = async () => {
      try {
        const data = await viewBalance(currentUser.id);
        setUserAmount(data.balance);
      } catch (error) {
        console.error('Failed to fetch user balance:', error);
      }
    };
    fetchUserAmount();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to deposit money?')) {
      try {
        const data = await depositMoney({ amount, user_id: currentUser.id });
        if (data.success) {
          alert(amount + '$ ' + data.message);
          setAmount('');
          setUserAmount(data.new_balance);
        }
        console.log(data.message);
      } catch (error) {
        console.error('Error depositing money:', error.response.data.error);
      }
    }
  };

  console.log(amount);
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
        <form>
          <VStack spacing={4} align='stretch'>
            <Box>
              <p>Current Balance: {userAmount}</p>
            </Box>
            <FormControl id='amount' isRequired>
              <FormLabel>Amount</FormLabel>
              <Input
                type='number'
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                value={amount}
                placeholder='Enter amount'
              />
            </FormControl>

            <FormControl id='paymentMethod' isRequired>
              <FormLabel>Payment Method</FormLabel>
              <Select placeholder='Select payment method'>
                <option value='bank'>Bank Transfer</option>
                <option value='creditCard'>Credit Card</option>
                <option value='paypal'>PayPal</option>
              </Select>
            </FormControl>

            <HStack justify='space-between'>
              <Button
                colorScheme='green'
                onClick={handleSubmit}
                type='submit'
                width='100%'
              >
                Deposit Money
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default DepositMoney;
