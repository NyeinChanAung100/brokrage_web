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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log('Error:', error);
    console.log('Error Info:', info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const TradePage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const [itemInfo, setItemInfo] = useRecoilState(allItemAtom);
  const [selectedItem, setSelectedItem] = useState(itemInfo.name);
  const [marketData, setMarketData] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [afterPrice, setAfterPrice] = useState(0);
  const [total, setTotal] = useState('');
  const { isOpen, onOpen, onClose } = useModal();
  const tradeType = useRecoilValue(buyorsellAtom);
  const parseid = parseInt(itemInfo?.id ? itemInfo.id : itemInfo.item_id, 10);
  const [itemId, setItemId] = useState(parseid);
  console.log('itemInfo:', itemInfo);
  console.log('item_id:', itemId);
  const currentUser = useRecoilValue(userAtom);
  console.log(currentUser);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [tradeType]);

  // useEffect(() => {
  //   console.log('iid:', itemId);
  // }, [itemId]);

  useEffect(() => {
    if (quantity && itemInfo.price !== undefined && itemInfo.price !== null) {
      const parsedQuantity = parseFloat(quantity);
      const unitPrice = itemInfo.price;
      if (!isNaN(parsedQuantity) && !isNaN(unitPrice)) {
        console.log('maeketdata:', marketData);
        console.log('ideee:', itemId);
        const currentItem = marketData.find((item) => item.id == itemId);
        console.log('ccitemm:', currentItem);
        let market_cap = parseFloat(currentItem.market_cap);
        let supply = parseFloat(currentItem.supply);
        let price = parseFloat(currentItem.price);
        let totalPrice = 0;
        console.log('tradeType:', tradeType);
        console.log('supply:', supply);
        console.log('market_cap:', market_cap);
        console.log('price:', price);

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
  // useEffect(() => {
  //   console.log('quantity::', quantity);
  // }, [quantity, marketData]);

  const handleItemChange = (event) => {
    const newItem = event.target.value;
    const newItemData = marketData.find((data) => data.name === newItem);
    setSelectedItem(newItem);

    if (newItemData) {
      setItemInfo(newItemData);
      setItemId(newItemData.item_id);
      setTotal(0);
      setQuantity('');
      setAfterPrice(0);
    } else {
      console.log('error:errorljkljlj');
    }
  };

  const handleMinMaxButton = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
    console.log('value:', value);
    if (value === '') {
      setQuantity('');
    } else {
      value = parseInt(value, 10);
      if (isNaN(value)) {
        setQuantity('');
      } else if (value < 1) {
        setQuantity(1);
      } else if (value > itemInfo.supply) {
        setQuantity(parseInt(itemInfo.supply - 1));
      } else {
        setQuantity(value);
      }
    }
  };

  const fetchData = async () => {
    try {
      let data;
      console.log('tradeType:', tradeType);
      data = await viewItems();
      if (tradeType.trim() == 'sell') {
        console.log('first');
        const userAssest = await viewUserAssets(currentUser.id);
        console.log(userAssest);
        const userAssestItemsId = userAssest.map((item) => item.item_id);
        console.log('userAssestItemsId', userAssestItemsId);
        data = data.filter((item) => userAssestItemsId.includes(item.id));
        data = data.map((item) => {
          return {
            ...item,
            quantity: userAssest.find(
              (userItem) => userItem.item_id == item.item_id
            ).quantity,
          };
        });
      }
      console.log(data);
      setMarketData(data);
    } catch (error) {
      console.log(error);
      //   showToast('Error', error, 'error');
    }
  };

  return (
    <ErrorBoundary>
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
              {marketData?.map((data, index) => (
                <option key={index} value={data.name}>
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
              // readOnly
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
            {tradeType?.trade == 'buy' ? 'Buy' : 'Sell'}
          </Button>
          <InitialFocus
            isOpen={isOpen}
            onClose={onClose}
            total={total}
            quantity={quantity}
            itemId={itemId ?? ''}
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
    </ErrorBoundary>
  );
};

export default TradePage;
