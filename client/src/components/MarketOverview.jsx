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
import marketdata from '../data/testmarketdata.json';
import { useColorModeValue } from '@chakra-ui/react';
import UserAssetsValue from './UserAssetsValue';
import { IoBookmarks, IoCheckmarkCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { itemAtom } from '../atoms/itemAtom';
import { useSetRecoilState } from 'recoil';

function EachItem({ name, price, tran, mark, unit, unitprice }) {
  const { colorMode } = useColorMode();
  const textColor = tran === 'up' ? 'green' : 'red';
  const upordown = tran === 'up' ? 'increase' : 'decrease';
  const setItemInfo = useSetRecoilState(itemAtom);

  const handleClick = () => {
    setItemInfo({
      name: name,
      price: price,
      unitprice: unitprice,
      unit: unit, // Fixed this to pass the correct unit instead of tran
    });
  };

  return (
    <Flex width={'100%'} h={'100%'} justifyContent={'space-between'}>
      <Stat>
        <StatLabel>Unit-{unit}</StatLabel>
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
            {mark ? <IoCheckmarkCircle color='green' /> : <IoBookmarks />}
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
        {marketdata?.map((data) => (
          <EachItem
            key={data.name}
            name={data.name}
            price={data.price}
            tran={data.tran}
            mark={data.mark}
            unit={data.unit}
            unitprice={data.unitprice} // Pass the unitprice here
          />
        ))}
      </VStack>
    </Flex>
  );
}

export default MarketOverview;
