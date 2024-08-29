import {
  Box,
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
import marketdata from '../data/testmarketdata.json';
import { useColorModeValue } from '@chakra-ui/react';
import UserAssetsValue from './UserAssetsValue';
// import { CiBookmarkPlus, CiBookmarkMinus } from 'react-icons/ci';
import { IoBookmarks, IoCheckmarkCircle } from 'react-icons/io5';

function EachItem({ name, price, tran, mark, unit }) {
  const { colorMode } = useColorMode();
  const textColor = tran === 'up' ? 'green' : 'red';
  const upordown = tran === 'up' ? 'increase' : 'decrease'; // Access the current color mode
  return (
    <Flex width={'100%'} h={'100%'} justifyContent={'space-between'}>
      {/* <Box w={'200px'} textAlign={'left'}>
        {name}
      </Box> */}
      <Stat>
        <StatLabel>Unit-{unit}</StatLabel>
        <StatNumber>{name}</StatNumber>
        <StatHelpText>
          <StatArrow type={upordown} />
          23.36%
        </StatHelpText>
      </Stat>
      <Flex w={'200px'} textAlign={'right'} justifyContent={'space-between'}>
        <Text w={'150px'} color={textColor}>
          ${price}
        </Text>
        <Box>
          {mark ? (
            <IoCheckmarkCircle color="green" />
          ) : (
            <IoBookmarks
            //   color={colorMode === 'dark' ? '2px solid #444' : '2px solid #ccc'}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  );
}

function MarketOverview() {
  return (
    <Flex flexDirection={'column'} w={'100%'}>
      <UserAssetsValue />
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
        w={'95%'}
        //   ml={'5px'}
        p={'30px'}
        // pl={'100px'}
        // pr={'100px'}
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
        {marketdata?.map((data) => (
          <EachItem
            key={data.name}
            name={data.name}
            price={data.price}
            tran={data.tran}
            mark={data.mark}
            unit={data.unit}
          />
        ))}
      </VStack>
    </Flex>
  );
}

export default MarketOverview;
