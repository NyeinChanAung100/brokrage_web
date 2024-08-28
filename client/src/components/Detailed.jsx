import React from 'react';

import { Flex } from '@chakra-ui/react';
import StockChart from './stockChart';

function Transactions() {
  return (
    <Flex flexDirection={'column'} w={'100%'} h={'100%'}>
      <StockChart />
    </Flex>
  );
}

export default Transactions;
