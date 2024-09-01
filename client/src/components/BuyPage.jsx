import React, { useEffect, useState } from 'react';
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
import { useRecoilState, useRecoilValue } from 'recoil';
import { allItemAtom } from '../atoms/allItemAtom';
import marketdata from '../data/testmarketdata.json';

function BuyPage() {
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [itemInfo, setItemInfo] = useRecoilState(allItemAtom);
  const [total, setTotal] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const { isOpen, onOpen, onClose } = useModal();
  const allitem = useRecoilValue(allItemAtom);
  console.log(allitem);
  useEffect(() => {
    // When the component mounts, set the selected item to match the item in Recoil state
    setSelectedItem(itemInfo.name);
  }, [itemInfo]);

  // Update Recoil atom and unit price when a new item is selected
  const handleItemChange = (event) => {
    const newItem = event.target.value;
    const newItemData = marketdata.find((data) => data.name === newItem);

    if (newItemData) {
      setItemInfo({
        name: newItem,
        price: newItemData.price,
        unitprice: newItemData.unitprice, // Match the key from JSON
        unit: newItemData.unit,
      });
    }
  };

  // Calculate the total value whenever quantity or unit price changes
  useEffect(() => {
    if (
      quantity &&
      itemInfo.unitprice !== undefined &&
      itemInfo.unitprice !== null
    ) {
      const parsedQuantity = parseFloat(quantity);
      const unitPrice = itemInfo.unitprice;

      if (!isNaN(parsedQuantity) && !isNaN(unitPrice)) {
        const totalValue = parsedQuantity * unitPrice;
        setTotal(totalValue);
      } else {
        setTotal(0);
      }
    } else {
      setTotal(0);
    }
  }, [quantity, itemInfo.unitprice]);
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
          <Select value={selectedItem} onChange={handleItemChange}>
            {marketdata.map((data) => (
              <option key={data.name} value={data.name}>
                {data.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w='100%'>
          <FormControl id='quantity' isRequired>
            <FormLabel>Quantity</FormLabel>
            <Input
              type='number'
              placeholder='Enter quantity'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </FormControl>

          <FormControl id='price' isReadOnly>
            <FormLabel>Price per Unit</FormLabel>
            <Input type='text' value={itemInfo.unitprice || ''} readOnly />
          </FormControl>
        </SimpleGrid>

        <FormControl id='total' isReadOnly>
          <FormLabel>Total Price</FormLabel>
          <Input
            type='text'
            value={`$${
              !isNaN(total) && total !== '' ? total.toFixed(2) : '0.00'
            }`}
            readOnly
          />
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
