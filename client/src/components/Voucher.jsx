import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { userItem } from '../atoms/userItem.js';

function Voucher() {
  const itemValue = useRecoilValue(userItem);
  console.log(itemValue);
  return (
    <Flex width='100%' bg='red' border={'10px solid black'}>
      fdgsh
    </Flex>
  );
}

export default Voucher;
