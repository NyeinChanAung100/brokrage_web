import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userItem } from '../atoms/userItem.js';
import { buyorsellAtom } from '../atoms/buyorsellAtom.js';

function Voucher() {
  const [trade, setTrade] = useRecoilState(buyorsellAtom);
  console.log(trade);
  const itemValue = useRecoilValue(userItem);
  console.log(itemValue);
  return (
    <Flex width='100%' bg='red' border={'10px solid black'}>
      fdgsh
      <Button onClick={() => setTrade('sell')}>change to sell</Button>
      <Button onClick={() => setTrade('buy')}>change to buy</Button>
    </Flex>
  );
}

export default Voucher;
