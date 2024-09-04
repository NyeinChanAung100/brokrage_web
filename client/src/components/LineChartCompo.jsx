import { Flex, useColorModeValue } from '@chakra-ui/react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import revenuedata from '../data/revenuedata.json';
import { Chart as ChartJs, defaults } from 'chart.js/auto';
import Propertylist from './propertylist';
import TotalAsset from './TotalAsset';
// import assetList from '../data/assetList.json';

import './lich.css';
import { viewUserAssets } from '../services/userService';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useEffect, useState } from 'react';

function LineChartCompo() {
  defaults.maintainAspectRatio = true;
  defaults.responsive = true;
  defaults.plugins.title.display = true;
  defaults.plugins.title.align = 'start';
  defaults.plugins.title.font.size = 20;
  defaults.plugins.title.color = useColorModeValue('black', 'white');
  const userData = useRecoilValue(userAtom);
  const [assets, setAssets] = useState([]);

  console.log(userData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = userData.id;
        const data = await viewUserAssets(userId);
        console.log('Fetched Assets:', data);
        setAssets(data);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <Flex
      w={'100%'}
      flexDirection={{ base: 'column', md: 'row-reverse' }}
      h={'100%'}
      overflow={'hidden'}
      mt={'-20px'}
    >
      <Flex
        flexDirection={'column'}
        h={'100%'}
        width={{ base: '100%', md: '35%' }}
        padding={'5px'}
        className='lichcom'
        overflow={'scroll'}
        bg={useColorModeValue('white', 'gray.900')}
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none', // IE and Edge
          'scrollbar-width': 'none', // Firefox
        }}
      >
        {assets?.map((data) => (
          <Propertylist
            key={data.item_id}
            name={data.name}
            existing={data.quantity}
            symbol={data.symbol}
            id={data.item_id}
            unit={data.unit}
            price={data.price}
          />
        ))}
      </Flex>

      <Flex
        width={{ base: '100%', md: '65%' }}
        flexDirection={'column'}
        overflow={'scroll'}
        marginRight={'10px'}
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none', // IE and Edge
          'scrollbar-width': 'none', // Firefox
        }}
      >
        <Flex justifyContent={'space-evenly'}>
          <TotalAsset />
          <Flex
            width={'48%'}
            bg={useColorModeValue('white', '#475C6C')}
            borderRadius={'15px'}
          >
            <Doughnut
              data={{
                labels: ['A', 'B', 'C'],
                datasets: [
                  {
                    label: 'Revenue',
                    data: [200, 300, 400],
                    backgroundColor: ['red', 'blue', 'green'],
                    borderColor: ['red', 'blue', 'green'],
                  },
                  {
                    label: 'Loss',
                    data: [80, 90, 70],
                  },
                ],
              }}
              options={{
                tooltips: {
                  mode: 'index',
                  intersect: false,
                },
                hover: {
                  mode: 'index',
                  intersect: false,
                },
                plugins: {
                  title: {
                    text: 'Revenue Breakdown',
                  },
                },
              }}
            />
          </Flex>
        </Flex>
        <Flex>
          <Line
            data={{
              labels: revenuedata?.map((data) => data.label),
              datasets: [
                {
                  label: 'Revenue',
                  data: revenuedata?.map((data) => data.revenue),
                  backgroundColor: '#ff3030',
                  borderColor: '#ff3030',
                },
                {
                  label: 'Cost',
                  data: revenuedata?.map((data) => data.cost),
                  backgroundColor: '#064ff0',
                  borderColor: '#064ff0',
                },
              ],
            }}
            options={{
              tooltips: {
                mode: 'index',
                intersect: false,
              },
              hover: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                title: {
                  text: 'Monthly Revenue and Cost',
                },
              },
            }}
          />
        </Flex>
        <Flex>
          <Bar
            data={{
              labels: ['A', 'B', 'C', 'D', 'E', 'F'],
              datasets: [
                {
                  label: 'Profit',
                  data: [200, 300, 400, 350, 382, 550],
                  borderRadius: 5,
                },
                {
                  label: 'Loss',
                  data: [80, 90, 70, 100, 131, 95],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              tooltips: {
                mode: 'index',
                intersect: false,
              },
              hover: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                title: {
                  text: 'Profit and Loss',
                },
              },
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default LineChartCompo;
