import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
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
import { allItemAtom } from '../atoms/allItemAtom.js';
import { viewItems, viewUserAssets } from '../services/userService.js';
import useShowToast from '../hooks/useShowToast.js';
import Buyorsell from './buyorsell.jsx';
import { buyorsellAtom } from '../atoms/buyorsellAtom.js';
import userAtom from '../atoms/userAtom.js';

function BuyPage() {
  const [quantity, setQuantity] = useState('');
  const [itemInfo, setItemInfo] = useRecoilState(allItemAtom);
  const [selectedItem, setSelectedItem] = useState(itemInfo.name);
  const [total, setTotal] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const { isOpen, onOpen, onClose } = useModal();

  const tradeType = useRecoilValue(buyorsellAtom);

  const [marketData, setMarketData] = useState([]);
  const parseid = parseInt(itemInfo.id, 10);

  const [itemId, setItemId] = useState(parseid);

  const [afterPrice, setAfterPrice] = useState(0);
  const currentUser = useRecoilValue(userAtom);
  console.log('iteminfooo:', itemInfo);
  console.log('selectedItem', selectedItem);

  const handleMinMaxButton = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setQuantity('');
    } else if (value < 1) {
      setQuantity(1);
    } else if (value > itemInfo.supply) {
      setQuantity(itemInfo.supply);
    } else {
      console.log('ittttt:', itemInfo);
      setQuantity(value);
    }
  };

  const showToast = useShowToast();

  const fetchData = async () => {
    try {
      let data;

      if (tradeType === 'buy') {
        data = await viewItems();
      } else {
        data = await viewUserAssets(currentUser.id);
      }

      setMarketData(data);
      console.log('mdata:', data);
    } catch (error) {
      showToast('Error', error, 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [tradeType]);

  const handleItemChange = (event) => {
    const newItem = event.target.value;
    const newItemData = marketData.find((data) => data.name === newItem);
    console.log('newitemdata id', newItemData);
    setSelectedItem(newItem);

    if (newItemData) {
      setItemInfo(newItemData);
      console.log('newitemdata han', newItemData);

      setItemId(newItemData.id);
      setTotal(0);
      setQuantity('');
      setAfterPrice(0);
    } else {
      console.log('error:errorljkljlj');
    }
    console.log('marketDate', marketData);
  };
  useEffect(() => {
    console.log('iid:', itemId);
  }, [itemId]);

  useEffect(() => {
    console.log('mmmddd:', marketData);
    if (
      quantity &&
      // quantity != '' &&
      itemInfo.price !== undefined &&
      itemInfo.price !== null
    ) {
      const parsedQuantity = parseFloat(quantity);
      const unitPrice = itemInfo.price;
      if (!isNaN(parsedQuantity) && !isNaN(unitPrice)) {
        console.log('ideee:', itemId);

        const currentItem = marketData.find((item) => item.id == itemId);
        console.log('rrtttrr:', marketData);

        console.log('ccitemm:', currentItem);
        let market_cap = parseFloat(currentItem.market_cap);
        let supply = parseFloat(currentItem.supply);
        let price = parseFloat(currentItem.price);
        let totalPrice = 0;

        for (let i = 0; i < quantity; i++) {
          if (tradeType == 'buy') {
            market_cap += price;
            supply -= 1;
            price = market_cap / supply;
            totalPrice += price;
          } else if (tradeType == 'sell') {
            market_cap -= price;
            supply += 1;
            price = market_cap / supply;
            totalPrice += price;
          }
        }

        setAfterPrice(price);
        setTotal(totalPrice);
      } else {
        setTotal(0);
        setAfterPrice(itemInfo.price);
      }
    } else {
      setTotal(0);
    }
  }, [quantity, selectedItem, itemInfo]);
  useEffect(() => {
    console.log('quantity::', quantity);
  }, [quantity, marketData]);
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
      <Buyorsell />

      <VStack spacing={6}>
        <FormControl id='item' isRequired>
          <FormLabel>Select Item/Asset</FormLabel>
          <Select value={selectedItem} onChange={handleItemChange}>
            {marketData.map((data) => (
              <option key={data.id} value={data.name}>
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
              onChange={handleMinMaxButton}
            />
          </FormControl>

          <FormControl id='price' isReadOnly>
            <HStack>
              <Box>
                <FormLabel>Before Price:</FormLabel>
                {/* <Input type='number' value={itemInfo.price || ''} readOnly /> */}
                <Text> {itemInfo.price || ''}</Text>
              </Box>
              <Box>
                <FormLabel>After Price:</FormLabel>
                {/* <Input
                  type='number'
                  value={afterPrice ? afterPrice.toFixed(2) : itemInfo.price}
                  readOnly
                /> */}
                <Text>
                  {' '}
                  {afterPrice ? afterPrice.toFixed(2) : itemInfo.price}
                </Text>
              </Box>
            </HStack>
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
          {tradeType}
        </Button>
        <InitialFocus
          isOpen={isOpen}
          onClose={onClose}
          total={total}
          quantity={quantity}
          itemId={itemId}
          userId={currentUser.id}
          name={itemInfo.name}
          fetchData={fetchData}
          handleItemChange={handleItemChange}
          // refreshPage={refreshPage}
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
