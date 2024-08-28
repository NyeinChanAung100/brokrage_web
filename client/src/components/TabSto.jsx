import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';
import StockChart from './stockChart';
import assetList from '../data/assetList.json';
function TabSto() {
  return (
    <Tabs w={'100%'} overflowX={'scroll'}>
      <TabList bg={useColorModeValue('white', 'gray.900')}>
        {assetList?.map((data) => (
          <Tab>{data.item}</Tab>
        ))}
      </TabList>

      <TabPanels>
        <TabPanel>
          <StockChart />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default TabSto;
