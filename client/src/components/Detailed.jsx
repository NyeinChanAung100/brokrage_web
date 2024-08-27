import React from 'react';
import UserAssetsValue from './UserAssetsValue';
import { Flex } from '@chakra-ui/react';
import StockChart from './stockChart';

function Transactions() {
  return (
    <Flex flexDirection={'column'} w={'100%'} h={'100%'}>
      {/* <UserAssetsValue /> */}
      <StockChart />
    </Flex>
  );
}

export default Transactions;
