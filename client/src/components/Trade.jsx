import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import assetList from '../data/assetList.json';
import Propertylist from './propertylist';

function Trade() {
  return (
    <Tabs
      isFitted
      w={'100%'}
      maxHeight={'calc(100%-60px)'}
      // border={'10px solid yellow'}
    >
      <TabList
        bg={useColorModeValue('white', 'gray.900')}
        position={'sticky'}
        top={'65px'}
      >
        <Tab
          _selected={{ color: 'white', bg: 'blue.500', fontWeight: 'bolder' }}
        >
          Buy
        </Tab>
        <Tab
          _selected={{ color: 'white', bg: 'blue.500', fontWeight: 'bolder' }}
        >
          Sell
        </Tab>
      </TabList>

      <TabPanels w={'100%'} h={'100%'}>
        <TabPanel w={'100%'} h={'100%'}>
          <Flex
            flexDirection={'column'}
            // height={'calc(100%-60px)'}
            height={'100%'}
            overflow={'scroll'}
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              '-ms-overflow-style': 'none', // IE and Edge
              'scrollbar-width': 'none', // Firefox
            }}
            // border={'10px solid red'}
          >
            {assetList?.map((data) => (
              <Propertylist
                key={data.item}
                item={data.item}
                price={data.price}
                tran={data.tran}
                unitprice={data.unitPrice}
              />
            ))}{' '}
          </Flex>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Trade;
