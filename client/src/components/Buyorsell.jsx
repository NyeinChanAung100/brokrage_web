import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { buyorsellAtom } from '../atoms/buyorsellAtom';

function Buyorsell() {
  const [trade, setTrade] = useRecoilState(buyorsellAtom);
  const index = trade == 'buy' ? 0 : 1;
  return (
    <Tabs isFitted variant='enclosed' defaultIndex={index}>
      <TabList mb='1em'>
        <Tab
          _selected={{ color: 'white', bg: 'blue.500' }}
          fontSize={'20px'}
          fontWeight={'bold'}
          onClick={() => setTrade('buy')}
        >
          Buy
        </Tab>
        <Tab
          _selected={{ color: 'white', bg: 'blue.500' }}
          fontSize={'20px'}
          fontWeight={'bold'}
          onClick={() => setTrade('sell')}
        >
          Sell
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Heading size={'xl'}>Buy Assets</Heading>
        </TabPanel>
        <TabPanel>
          <Heading size={'xl'}>Sell Assets</Heading>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Buyorsell;
