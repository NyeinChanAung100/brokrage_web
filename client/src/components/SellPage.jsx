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

function SellPage() {
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
        Sell Assets
      </Text>
      <VStack spacing={6}>
        <FormControl id='asset' isRequired>
          <FormLabel>Select Item/Asset to Sell</FormLabel>
          <Select placeholder='Select item/asset'>
            <option value='item1'>Item 1</option>
            <option value='item2'>Item 2</option>
            <option value='item3'>Item 3</option>
          </Select>
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w='100%'>
          <FormControl id='quantity' isRequired>
            <FormLabel>Quantity</FormLabel>
            <Input type='number' placeholder='Enter quantity to sell' />
          </FormControl>

          <FormControl id='price' isRequired>
            <FormLabel>Selling Price per Unit</FormLabel>
            <Input
              type='number'
              placeholder='Enter your selling price per unit'
            />
          </FormControl>
        </SimpleGrid>

        <FormControl id='total' isReadOnly>
          <FormLabel>Total Selling Price</FormLabel>
          <Input type='text' value='$100.00' readOnly />
        </FormControl>

        <FormControl id='payment-method' isRequired>
          <FormLabel>Payment Method (Receive Payment)</FormLabel>
          <Select placeholder='Select payment method'>
            <option value='bank'>Bank Transfer</option>
            <option value='wallet'>Wallet</option>
            <option value='crypto'>Cryptocurrency</option>
          </Select>
        </FormControl>

        <Button colorScheme='green' w='100%' size='lg' onClick={onOpen}>
          Sell
        </Button>
        <InitialFocus
          isOpen={isOpen}
          onClose={onClose}
          bors={'Are you sure you want to sell this.'}
        />
        <Text mt={4} textAlign='center'>
          Available Balance:{' '}
          <Text as='span' fontWeight='bold'>
            $500.00
          </Text>
        </Text>
      </VStack>
    </Box>
  );
}

export default SellPage;
