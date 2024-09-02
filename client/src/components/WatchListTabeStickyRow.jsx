import { Th, Tr } from '@chakra-ui/react';
import React from 'react';

const StickyTableWithReactSticky = () => {
  return (
    <Tr position="sticky" top="50" bg="white" zIndex="10">
      <Th>Name</Th>
      <Th>Price</Th>

      <Th>%Change</Th>
      <Th>Volume</Th>
    </Tr>
  );
};

export default StickyTableWithReactSticky;
