import React from 'react';
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

const DepositMoney = () => {
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
            <FormControl id='amount' isRequired>
              <FormLabel>Amount</FormLabel>
              <Input type='number' placeholder='Enter amount' />
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
              <Button colorScheme='green' type='submit' width='100%'>
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
