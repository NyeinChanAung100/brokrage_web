import { Box, Flex, StackDivider, VStack } from '@chakra-ui/react';
import marketdata from '../data/testmarketdata.json';
import { useColorModeValue } from '@chakra-ui/react';
function EachItem({ name, price, tran }) {
  return (
    <Flex width={'90%'} h={'100%'} justifyContent={'space-between'}>
      <Box w={'200px'} textAlign={'start'}>
        {name}
      </Box>
      <Box w={'150px'} textAlign={'end'}>
        ${price}
      </Box>
    </Flex>
  );
}

function MarketOverview() {
  return (
    <VStack
      divider={<StackDivider borderColor='gray.200' />}
      spacing={4}
      align='stretch'
      w={'100%'}
      ml={'10px'}
      p={'10px'}
      bg={useColorModeValue('white', 'gray.900')}
    >
      {marketdata?.map((data) => (
        <EachItem name={data.name} price={data.price} tran={data.tran} />
      ))}
    </VStack>
  );
}

export default MarketOverview;
