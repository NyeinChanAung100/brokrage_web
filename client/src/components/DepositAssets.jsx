import React from 'react';
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

const DepositAssets = () => {
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
            <FormControl id='asset' isRequired>
              <FormLabel>Select Asset</FormLabel>
              <Select placeholder='Select Asset'>
                <option value='asset1'>Asset 1</option>
                <option value='asset2'>Asset 2</option>
                <option value='asset3'>Asset 3</option>
              </Select>
            </FormControl>

            <FormControl id='amount' isRequired>
              <FormLabel>Amount</FormLabel>
              <Input type='number' placeholder='Enter amount' />
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
