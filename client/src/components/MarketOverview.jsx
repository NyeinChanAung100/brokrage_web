// import {
//   Box,
//   Button,
//   Flex,
//   StackDivider,
//   Stat,
//   StatArrow,
//   StatHelpText,
//   StatLabel,
//   StatNumber,
//   Text,
//   useColorMode,
//   VStack,
// } from '@chakra-ui/react';
// import marketdata from '../data/testmarketdata.json';
// import { useColorModeValue } from '@chakra-ui/react';
// import UserAssetsValue from './UserAssetsValue';
// import { IoBookmarks, IoCheckmarkCircle } from 'react-icons/io5';
// import { Link } from 'react-router-dom';

// import { useSetRecoilState } from 'recoil';
// import { allItemAtom } from '../atoms/allItemAtom';

// function EachItem({ name, price, tran, mark, unit, unitprice }) {
//   const { colorMode } = useColorMode();
//   const textColor = tran === 'up' ? 'green' : 'red';
//   const upordown = tran === 'up' ? 'increase' : 'decrease';
//   const setAllItemInfo = useSetRecoilState(allItemAtom);

//   const handleClick = () => {
//     setAllItemInfo({
//       name: name,
//       price: price,
//       unitprice: unitprice,
//       unit: unit, // Fixed this to pass the correct unit instead of tran
//     });
//     // console.log('all item atom:', allItemAtom);
//   };

//   return (
//     <Flex width={'100%'} h={'100%'} justifyContent={'space-between'}>
//       <Stat>
//         <StatLabel>Unit-{unit}</StatLabel>
//         <StatNumber>{name}</StatNumber>
//         <StatHelpText>
//           <StatArrow type={upordown} />
//           23.36%
//         </StatHelpText>
//       </Stat>
//       <Flex
//         w={'100px'}
//         flexDirection={'column'}
//         justifyContent={'space-between'}
//       >
//         <Flex>
//           <Text w={'150px'} color={textColor}>
//             ${price}
//           </Text>
//           <Box>
//             {mark ? <IoCheckmarkCircle color='green' /> : <IoBookmarks />}
//           </Box>
//         </Flex>

//         <Button
//           colorScheme='red'
//           size='xs'
//           border={'2px outset rgb(252,249,250)'}
//           w={'70px'}
//           onClick={handleClick}
//         >
//           <Link to={'/purchase'}>Buy</Link>
//         </Button>
//       </Flex>
//     </Flex>
//   );
// }

// function MarketOverview() {
//   return (
//     <Flex flexDirection={'column'} w={'100%'}>
//       <UserAssetsValue />
//       <VStack
//         divider={<StackDivider borderColor='gray.200' />}
//         spacing={4}
//         align='stretch'
//         w={'95%'}
//         p={'30px'}
//         bg={useColorModeValue('white', 'gray.900')}
//         overflow={'scroll'}
//         borderRadius={'10px'}
//         css={{
//           '&::-webkit-scrollbar': {
//             display: 'none',
//           },
//           '-ms-overflow-style': 'none', // IE and Edge
//           'scrollbar-width': 'none', // Firefox
//         }}
//       >
//         {marketdata?.map((data) => (
//           <EachItem
//             key={data.name}
//             name={data.name}
//             price={data.price}
//             tran={data.tran}
//             mark={data.mark}
//             unit={data.unit}
//             unitprice={data.unitprice} // Pass the unitprice here
//           />
//         ))}
//       </VStack>
//     </Flex>
//   );
// }

// export default MarketOverview;
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  StackDivider,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import UserAssetsValue from './UserAssetsValue';
import { IoBookmarks, IoCheckmarkCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { allItemAtom } from '../atoms/allItemAtom.js';
import { viewAssets, setWatchList } from '../services/userService'; // Import the viewAssets function

function EachItem({ name, price, isWatchlist, marketCap, supply }) {
  // "id": "1",
  //   "name": "Sample Product",
  //   "description": "Sample description",
  //   "price": "29.99",
  //   "supply": "100.00",
  //   "market_cap": "2999.00",
  //   "isWatchlist": true
  // , tran, mark, unit, unitprice

  const { colorMode } = useColorMode();
  const tran = 'up';
  const textColor = tran === 'up' ? 'green' : 'red';
  const upordown = tran === 'up' ? 'increase' : 'decrease';
  const setAllItemInfo = useSetRecoilState(allItemAtom);

  const handleClick = () => {
    setAllItemInfo({
      name: name,
      // price: price,
      // unitprice: unitprice,
      // unit: unit,
    });
  };
  console.log('watchlist:', isWatchlist);
  return (
    <Flex width={'100%'} h={'100%'} justifyContent={'space-between'}>
      <Stat>
        <StatLabel>Unit-kg</StatLabel>
        <StatNumber>{name}</StatNumber>
        <StatHelpText>
          <StatArrow type={upordown} />
          23.36%
        </StatHelpText>
      </Stat>
      <Flex
        w={'100px'}
        flexDirection={'column'}
        justifyContent={'space-between'}
      >
        <Flex>
          <Text w={'150px'} color={textColor}>
            ${price}
          </Text>
          <Box>
            {isWatchlist ? (
              <IoCheckmarkCircle color='green' />
            ) : (
              <IoBookmarks />
            )}
          </Box>
        </Flex>

        <Button
          colorScheme='red'
          size='xs'
          border={'2px outset rgb(252,249,250)'}
          w={'70px'}
          onClick={handleClick}
        >
          <Link to={'/purchase'}>Buy</Link>
        </Button>
      </Flex>
    </Flex>
  );
}

function MarketOverview() {
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 1; // Replace with the actual user ID
        const data = await viewAssets(userId);
        console.log('Fetched Assets:', data); // Log the fetched data
        setMarketData(data); // Set the fetched data to state
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Flex flexDirection={'column'} w={'100%'}>
      <UserAssetsValue />
      <VStack
        divider={<StackDivider borderColor='gray.200' />}
        spacing={4}
        align='stretch'
        w={'95%'}
        p={'30px'}
        bg={useColorModeValue('white', 'gray.900')}
        overflow={'scroll'}
        borderRadius={'10px'}
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none', // IE and Edge
          'scrollbar-width': 'none', // Firefox
        }}
      >
        {marketData?.map((data) => (
          <EachItem
            key={data.id}
            name={data.name}
            price={data.price}
            supply={data.supply}
            isWatchlist={data.isWatchlist}
            marketCap={data.market_cap}
          />
        ))}
      </VStack>
    </Flex>
  );
}
export default MarketOverview;
