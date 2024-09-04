// import React from 'react';
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
// import { useRecoilValue } from 'recoil';
// import { itemAtom } from '../atoms/itemAtom';
// import assetList from '../data/assetList.json';

// function SellPage() {
//   const itemInfo = useRecoilValue(itemAtom);
//   const bgColor = useColorModeValue('white', 'gray.800');
//   const textColor = useColorModeValue('gray.800', 'white');
//   const { isOpen, onOpen, onClose } = useModal();
//   console.log(itemInfo);
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
//         Sell Assets
//       </Text>
//       <VStack spacing={6}>
//         <FormControl id='asset' isRequired>
//           <FormLabel>Select Item/Asset to Sell</FormLabel>
//           <Select placeholder='Select item/asset'>
//             {assetList?.map((data) => (
//               <option value={data.item}>{data.item}</option>
//             ))}
//           </Select>
//         </FormControl>

//         <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w='100%'>
//           <FormControl id='quantity' isRequired>
//             <FormLabel>Quantity</FormLabel>
//             <Input type='number' placeholder='Enter quantity to sell' />
//           </FormControl>

//           <FormControl id='price' isRequired>
//             <FormLabel>Selling Price per Unit</FormLabel>
//             <Input
//               type='number'
//               placeholder='Enter your selling price per unit'
//               value={itemInfo.unitprice.replace(/\$/, '') || ''} // Removes the $ symbol for numerical input
//             />
//           </FormControl>
//         </SimpleGrid>

//         <FormControl id='total' isReadOnly>
//           <FormLabel>Total Selling Price</FormLabel>
//           <Input type='text' value='$100.00' readOnly />
//         </FormControl>

//         <FormControl id='payment-method' isRequired>
//           <FormLabel>Payment Method (Receive Payment)</FormLabel>
//           <Select placeholder='Select payment method'>
//             <option value='bank'>Bank Transfer</option>
//             <option value='wallet'>Wallet</option>
//             <option value='crypto'>Cryptocurrency</option>
//           </Select>
//         </FormControl>

//         <Button colorScheme='green' w='100%' size='lg' onClick={onOpen}>
//           Sell
//         </Button>
//         <InitialFocus
//           isOpen={isOpen}
//           onClose={onClose}
//           bors={'Are you sure you want to sell this.'}
//         />
//         <Text mt={4} textAlign='center'>
//           Available Balance:{' '}
//           <Text as='span' fontWeight='bold'>
//             $500.00
//           </Text>
//         </Text>
//       </VStack>
//     </Box>
//   );
// }

// export default SellPage;
import React, { useState, useEffect } from 'react';
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
import { useRecoilState } from 'recoil';
import { userItem } from '../atoms/userItem.js';
import assetList from '../data/assetList.json';

function SellPage() {
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [itemInfo, setItemInfo] = useRecoilState(userItem);
  const [total, setTotal] = useState(''); // State for total selling price

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const { isOpen, onOpen, onClose } = useModal();
  // console.log(itemAtom.unitprice, ' : unitprice');
  // console.log(itemAtom, ' : item');
  useEffect(() => {
    // When the component mounts, set the selected item to match the item in Recoil state
    setSelectedItem(itemInfo.name);
  }, [itemInfo]);

  // Update Recoil atom and unit price when a new item is selected
  const handleItemChange = (event) => {
    const newItem = event.target.value;
    const newItemData = assetList.find((data) => data.item === newItem);

    if (newItemData) {
      setItemInfo({
        name: newItem,
        price: newItemData.price,
        unitprice: newItemData.unitPrice, // Match the key from JSON
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
        Sell Assets
      </Text>
      <VStack spacing={6}>
        <FormControl id='asset' isRequired>
          <FormLabel>Select Item/Asset to Sell</FormLabel>
          <Select value={selectedItem} onChange={handleItemChange}>
            {assetList.map((data) => (
              <option key={data.item} value={data.item}>
                {data.item}
              </option>
            ))}
          </Select>
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w='100%'>
          <FormControl id='quantity' isRequired>
            <FormLabel>Quantity</FormLabel>
            <Input
              type='number'
              placeholder='Enter quantity to sell'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </FormControl>

          <FormControl id='price' isRequired>
            <FormLabel>Selling Price per Unit</FormLabel>
            <Input
              type='number'
              placeholder='Enter your selling price per unit'
              value={itemInfo.unitprice || ''}
              readOnly
            />
          </FormControl>
        </SimpleGrid>

        <FormControl id='total' isReadOnly>
          <FormLabel>Total Selling Price</FormLabel>
          <Input
            type='text'
            value={`$${
              !isNaN(total) && total !== '' ? total.toFixed(2) : '0.00'
            }`}
            readOnly
          />
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
