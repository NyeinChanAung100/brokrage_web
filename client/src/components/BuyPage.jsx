// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   Select,
//   SimpleGrid,
//   Text,
//   VStack,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import InitialFocus from './BuySellModal';
// import useModal from '../hooks/UseModal';
// import { useRecoilState, useRecoilValue } from 'recoil';
// import { allItemAtom } from '../atoms/allItemAtom.js';
// import marketdata from '../data/testmarketdata.json';
// import { viewItems } from '../services/userService.js';

// function BuyPage() {
//   const [selectedItem, setSelectedItem] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [itemInfo, setItemInfo] = useRecoilState(allItemAtom);
//   const [total, setTotal] = useState('');
//   const bgColor = useColorModeValue('white', 'gray.800');
//   const textColor = useColorModeValue('gray.800', 'white');
//   const { isOpen, onOpen, onClose } = useModal();
//   const allitem = useRecoilValue(allItemAtom);
//   const [marketData, setMarketData] = useState([]);
//   const [itemId, setItemId] = useState(1);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await viewItems();
//         console.log('Fetched Assets:', data);
//         setMarketData(data);
//       } catch (error) {
//         console.error('Failed to fetch assets:', error);
//       }
//     };

//     fetchData();
//   }, []);
//   console.log(allitem);
//   useEffect(() => {

//     setSelectedItem(itemInfo.name);
//   }, [itemInfo]);

//   const handleItemChange = (event) => {
//     const newItem = event.target.value;
//     const newItemData = marketData.find((data) => data.name === newItem);

//     if (newItemData) {
//       setItemInfo({
//         name: newItem,
//         price: newItemData.price,
//         unit: newItemData.unit,
//       });
//       setItemId(newItemData.id);
//     }
//   };

//   useEffect(() => {
//     if (quantity && itemInfo.price !== undefined && itemInfo.price !== null) {
//       const parsedQuantity = parseFloat(quantity);
//       const unitPrice = itemInfo.price;

//       if (!isNaN(parsedQuantity) && !isNaN(unitPrice)) {
//         const totalValue = parsedQuantity * unitPrice;
//         setTotal(totalValue);
//       } else {
//         setTotal(0);
//       }
//     } else {
//       setTotal(0);
//     }
//   }, [quantity, itemInfo.price]);
//   return (
//     <Box
//       w='100%'
//       h='100%'
//       p={6}
//       bg={bgColor}
//       color={textColor}
//       boxShadow='lg'
//       borderRadius='md'
//       maxW={{ base: '100%', md: '80%', lg: '60%' }}
//       mx='auto'
//     >
//       <Text fontSize='2xl' fontWeight='bold' mb={6} textAlign='center'>
//         Buy Assets
//       </Text>
//       <VStack spacing={6}>
//         <FormControl id='item' isRequired>
//           <FormLabel>Select Item/Asset</FormLabel>
//           <Select value={selectedItem} onChange={handleItemChange}>
//             {marketData.map((data) => (
//               <option key={data.id} value={data.name}>
//                 {data.name}
//               </option>
//             ))}
//           </Select>
//         </FormControl>

//         <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w='100%'>
//           <FormControl id='quantity' isRequired>
//             <FormLabel>Quantity</FormLabel>
//             <Input
//               type='number'
//               placeholder='Enter quantity'
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//             />
//           </FormControl>

//           <FormControl id='price' isReadOnly>
//             <FormLabel>Price per Unit</FormLabel>
//             <Input type='text' value={itemInfo.price || ''} readOnly />
//           </FormControl>
//         </SimpleGrid>

//         <FormControl id='total' isReadOnly>
//           <FormLabel>Total Price</FormLabel>
//           <Input
//             type='text'
//             value={`$${
//               !isNaN(total) && total !== '' ? total.toFixed(2) : '0.00'
//             }`}
//             readOnly
//           />
//         </FormControl>

//         <FormControl id='payment-method' isRequired>
//           <FormLabel>Payment Method</FormLabel>
//           <Select placeholder='Select payment method'>
//             <option value='deposited'>Deposited Money</option>
//             <option value='rewards'>Rewards</option>
//           </Select>
//         </FormControl>

//         <Button colorScheme='blue' w='100%' size='lg' onClick={onOpen}>
//           Purchase
//         </Button>
//         <InitialFocus
//           isOpen={isOpen}
//           onClose={onClose}
//           trade='buy'
//           total={total}
//           quantity={quantity}
//           itemId={itemId}
//           name={itemInfo.name}
//           bors={'Are you sure you want to buy this.'}
//         />

//         <Text mt={4} textAlign='center'>
//           Current Balance:{' '}
//           <Text as='span' fontWeight='bold'>
//             $500.00
//           </Text>
//         </Text>
//       </VStack>
//     </Box>
//   );
// }

// export default BuyPage;
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
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [itemInfo, setItemInfo] = useRecoilState(allItemAtom);
  const [total, setTotal] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const { isOpen, onOpen, onClose } = useModal();
  // const allitem = useRecoilValue(allItemAtom);
  const tradeType = useRecoilValue(buyorsellAtom);

  const [marketData, setMarketData] = useState([]);
  const [itemId, setItemId] = useState(1);
  // const [refresh, setRefresh] = useState(false);
  const [afterPrice, setAfterPrice] = useState(0);
  const currentUser = useRecoilValue(userAtom);
  // console.log('cuser', currentUser);
  // console.log('ttype', tradeType);
  const handleMinMaxButton = (e) => {
    let value = parseInt(e.target.value, 10);

    if (isNaN(value)) {
      setQuantity('');
    } else if (value < 1) {
      setQuantity(1);
    } else if (value > itemInfo.supply) {
      setQuantity(itemInfo.supply);
    } else {
      setQuantity(value);
    }
  };

  const showToast = useShowToast();
  // const handleRefresh = () => {
  //   setRefresh(!refresh);
  // };
  // Fetch market data
  const fetchData = async () => {
    try {
      let data;

      if (tradeType === 'buy') {
        data = await viewItems();
      } else {
        data = await viewUserAssets(currentUser.id);
      }

      setMarketData(data);
    } catch (error) {
      showToast('Error', error, 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [marketData]);

  useEffect(() => {
    // When the component mounts, set the selected item to match the item in Recoil state
    setSelectedItem(itemInfo.name);
  }, [itemInfo]);

  const handleItemChange = (event) => {
    const newItem = event.target.value;
    const newItemData = marketData.find((data) => data.name === newItem);
    console.log(newItemData);
    if (newItemData) {
      setItemInfo(newItemData);
      setItemId(newItemData.id);
      // console.log(itemId);
    } else {
      console.log('first');
    }
  };

  useEffect(() => {
    // console.log(itemId);
    // console.log(quantity, itemInfo.price);
    if (quantity && itemInfo.price !== undefined && itemInfo.price !== null) {
      // console.log('hi');
      const parsedQuantity = parseFloat(quantity);
      const unitPrice = itemInfo.price;

      if (!isNaN(parsedQuantity) && !isNaN(unitPrice)) {
        // console.log(itemId);
        // console.log('first', marketData);
        const currentItem = marketData.find((item) => item.id == itemId);
        // const price
        // const { supply, market_cap } = currentItem;
        // console.log(supply, marketData);
        // console.log(currentItem);
        let market_cap = parseFloat(currentItem.market_cap);
        let supply = parseFloat(currentItem.supply);
        let price = parseFloat(currentItem.price);
        let totalPrice = 0;
        // console.log('mc', market_cap);
        // console.log('sp', supply);
        // console.log('p', price);
        for (let i = 0; i < quantity; i++) {
          market_cap += price;
          supply -= 1;
          price = market_cap / supply;
          totalPrice += price;
        }
        setAfterPrice(price);
        // const totalValue = parsedQuantity * unitPrice;

        setTotal(totalPrice);
      } else {
        setTotal(0);
      }
    } else {
      setTotal(0);
    }
  }, [quantity, itemInfo.price, itemId, itemInfo]);

  // Refresh function to be passed to InitialFocus

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
      {/* <Text fontSize='2xl' fontWeight='bold' mb={6} textAlign='center'>
        Buy Assets
      </Text> */}
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
          // trade={tradeType}
          total={total}
          quantity={quantity}
          itemId={itemId}
          name={itemInfo.name}
          bors={'Are you sure you want to buy this.'}
          // onRefresh={handleRefresh}
          // refresh={refresh}
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
