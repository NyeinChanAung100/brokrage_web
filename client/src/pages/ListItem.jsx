import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { listItems } from '../services/marketService';

const ListItem = () => {
  // State to handle input changes
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [supply, setSupply] = useState('');
  const [unit, setUnit] = useState('');
  const [symbol, setSymbol] = useState('');

  // Handler to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logic to process form data
    console.log({ itemName, price, supply, unit, symbol });
    try {
      const data = await listItems({
        name: itemName,
        price,
        supply,
        unit,
        symbol,
      });
      alert('item is Listed');
      console.log(data);
    } catch (error) {
      alert('failed');
    }
  };

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <Box
        bg={useColorModeValue('white', 'gray.900')}
        p={8}
        boxShadow="lg"
        rounded="lg"
        width="100%"
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="itemName" isRequired>
              <FormLabel>Item name</FormLabel>
              <Input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter item name"
              />
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
              />
              <FormLabel>Supply</FormLabel>
              <Input
                type="number"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                placeholder="Enter supply"
              />
              <FormLabel>Unit</FormLabel>
              <Input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Enter unit"
              />
              <FormLabel>Symbol</FormLabel>
              <Input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Enter symbol"
              />
            </FormControl>

            <HStack justify="space-between">
              <Button colorScheme="blue" type="submit" width="100%">
                List Item
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default ListItem;
