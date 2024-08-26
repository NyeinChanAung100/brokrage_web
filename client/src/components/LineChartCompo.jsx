import { Flex, useColorModeValue } from '@chakra-ui/react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import revenuedata from '../data/revenuedata.json';
import { Chart as ChartJs, defaults } from 'chart.js/auto';
import Propertylist from './propertylist';
import TotalAsset from './TotalAsset';

import './lich.css';

function LineChartCompo() {
  defaults.maintainAspectRatio = true;
  defaults.responsive = true;
  defaults.plugins.title.display = true;
  defaults.plugins.title.align = 'start';
  defaults.plugins.title.font.size = 20;
  defaults.plugins.title.color = useColorModeValue('black', 'white');
  return (
    <Flex
      w={'100%'}
      // border={'5px solid blue'}
      // wrap={'wrap'}
      // position={'fixed'}
      // top={'69px'}
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
        // border={'10px solid blue'}
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
        <Propertylist item={'Bitcoin'} price={'$64950'} tran={'up'} />
        <Propertylist item={'Ton'} price={'$3600'} tran={'up'} />
        <Propertylist item={'Citra'} price={'$930'} tran={'down'} />
        <Propertylist item={'Ocean'} price={'$467'} tran={'up'} />
        <Propertylist item={'Hamster'} price={'$10000'} tran={'down'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'up'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'up'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'up'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'down'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'up'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'down'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'down'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'down'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'down'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'up'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'up'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'up'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'down'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'up'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'down'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'down'} />
        <Propertylist item={'Not'} price={'$5950'} tran={'down'} />
      </Flex>

      {/* w={{ base: '100%', md: '69%' }} */}
      <Flex
        width={{ base: '100%', md: '65%' }}
        // border={'10px solid black'}
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
          {' '}
          <TotalAsset />
          <Flex
            width={'48%'}
            bg={useColorModeValue('white', '#475C6C')}
            borderRadius={'15px'}
            // alignItems={'center'}
            // paddingTop={'-20px'}
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
              plugins: {
                title: {
                  text: 'Montly revenue and cost',
                },
              },
            }}
          />
        </Flex>
        {/* <Flex w={{ base: '100%', md: '29%' }} flexDirection={'column'}> */}
        <Flex>
          <Bar
            data={{
              labels: ['A', 'B', 'C', 'D', 'E', 'F'],
              datasets: [
                {
                  label: 'profit',
                  data: [200, 300, 400, 350, 382, 550],
                  // backgroundColor: ['red', 'blue', 'green'],
                  // borderRadius: 5,
                },
                {
                  label: 'Loss',
                  data: [80, 90, 70, 100, 131, 95],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: 'profit and lost',
                },
              },
            }}
          />{' '}
        </Flex>
        {/* */}
      </Flex>

      {/* </Flex> */}
    </Flex>
  );
}

export default LineChartCompo;
