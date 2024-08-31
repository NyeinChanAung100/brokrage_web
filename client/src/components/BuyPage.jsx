import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import InitialFocus from './BuySellModal';
import useModal from '../hooks/UseModal';

function BuyPage() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <Box
      w='100%'
      h='100%'
      p={6}
      bg={bgColor}
      color={textColor}
      boxShadow='lg'
      borderRadius='md'
      maxW={{ base: '100%', md: '80%', lg: '60%' }}
      mx='auto'
    >
      <Text fontSize='2xl' fontWeight='bold' mb={6} textAlign='center'>
        Buy Assets
      </Text>
      <VStack spacing={6}>
        <FormControl id='item' isRequired>
          <FormLabel>Select Item/Asset</FormLabel>
          <Select placeholder='Select item/asset'>
            <option value='item1'>Item 1</option>
            <option value='item2'>Item 2</option>
            <option value='item3'>Item 3</option>
          </Select>
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w='100%'>
          <FormControl id='quantity' isRequired>
            <FormLabel>Quantity</FormLabel>
            <Input type='number' placeholder='Enter quantity' />
          </FormControl>

          <FormControl id='price' isReadOnly>
            <FormLabel>Price per Unit</FormLabel>
            <Input type='text' value='$10.00' readOnly />
          </FormControl>
        </SimpleGrid>

        <FormControl id='total' isReadOnly>
          <FormLabel>Total Price</FormLabel>
          <Input type='text' value='$100.00' readOnly />
        </FormControl>

        <FormControl id='payment-method' isRequired>
          <FormLabel>Payment Method</FormLabel>
          <Select placeholder='Select payment method'>
            <option value='deposited'>Deposited Money</option>
            <option value='rewards'>Rewards</option>
          </Select>
        </FormControl>

        <Button colorScheme='blue' w='100%' size='lg' onClick={onOpen}>
          Purchase
        </Button>
        <InitialFocus
          isOpen={isOpen}
          onClose={onClose}
          bors={'Are you sure you want to buy this.'}
        />

        <Text mt={4} textAlign='center'>
          Current Balance:{' '}
          <Text as='span' fontWeight='bold'>
            $500.00
          </Text>
        </Text>
      </VStack>
    </Box>
  );
}

export default BuyPage;
