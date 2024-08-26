import { Flex } from '@chakra-ui/react';
import React from 'react';
import LineChartCompo from './LineChartCompo';

function Portfolio() {
  return (
    <Flex width={'100%'} height={'100%'} flexDirection={'column'}>
      <LineChartCompo />
    </Flex>
  );
}

export default Portfolio;
