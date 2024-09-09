// import { Flex, useColorModeValue } from '@chakra-ui/react';
// import { Bar, Doughnut, Line } from 'react-chartjs-2';
// import revenuedata from '../data/revenuedata.json';
// import { Chart as ChartJs, defaults } from 'chart.js/auto';
// import Propertylist from './propertylist';
// import TotalAsset from './TotalAsset';
// import './lich.css';
// import { viewUserAssets, viewPriceLog } from '../services/userService';
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import userAtom from '../atoms/userAtom';
// import assetIdsAtom from '../atoms/assetIdsAtom';
// import { useEffect, useState } from 'react';
// import moment from 'moment';

// function LineChartCompo() {
//   defaults.maintainAspectRatio = true;
//   defaults.responsive = true;
//   defaults.plugins.title.display = true;
//   defaults.plugins.title.align = 'start';
//   defaults.plugins.title.font.size = 20;
//   defaults.plugins.title.color = useColorModeValue('black', 'white');

//   const userData = useRecoilValue(userAtom); // Get user data from Recoil
//   const [assets, setAssets] = useState([]); // Local state for storing assets
//   const setAssetIds = useSetRecoilState(assetIdsAtom); // Setter for asset IDs in Recoil
//   const [priceLogs, setPriceLogs] = useState({}); // Local state for storing price logs

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userId = userData.id;
//         const fetchedAssets = await viewUserAssets(userId);
//         setAssets(fetchedAssets); // Store fetched assets in local state

//         const assetIds = fetchedAssets.map((asset) => asset.item_id);
//         setAssetIds(assetIds);

//         assetIds.forEach(async (id) => {
//           const log = await viewPriceLog(id); // Fetch price log for each item
//           setPriceLogs((prevLogs) => ({
//             ...prevLogs,
//             [id]: log, // Store the price log for each asset by its ID
//           }));
//         });
//       } catch (error) {
//         console.error('Failed to fetch assets or price logs:', error);
//       }
//     };
//     fetchData(); // Fetch assets and price logs when component mounts
//   }, [userData, setAssetIds]); // Dependencies: userData and setAssetIds

//   const aggregatePriceLog = (priceLog) => {
//     // Check if priceLog is an array
//     if (!Array.isArray(priceLog)) {
//       console.error('Invalid priceLog data, expected an array:', priceLog);
//       return [];
//     }

//     const oneHourAgo = moment().subtract(1, 'hour'); // Get timestamp for 1 hour ago

//     // Filter to get only the records from the last hour
//     const lastHourLogs = priceLog.filter((log) =>
//       moment(log.timestamp).isAfter(oneHourAgo),
//     );

//     // Aggregate data for every 5-minute intervals
//     const aggregatedLogs = [];
//     const interval = 5; // 5 minutes
//     let currentTime = moment().startOf('minute');

//     while (currentTime.isAfter(oneHourAgo)) {
//       // Find logs within the current 5-minute interval
//       const logsInInterval = lastHourLogs.filter((log) =>
//         moment(log.timestamp).isBetween(
//           currentTime.subtract(interval, 'minutes'),
//           currentTime,
//         ),
//       );

//       const averagePrice =
//         logsInInterval.reduce((acc, log) => acc + log.price, 0) /
//           logsInInterval.length || 0;

//       aggregatedLogs.push({
//         time: currentTime.format('HH:mm'),
//         averagePrice,
//       });

//       currentTime = moment(currentTime).subtract(interval, 'minutes');
//     }

//     return aggregatedLogs.reverse();
//   };

//   const aggregatedPriceLogs = priceLogs[assets[0]?.item_id]
//     ? aggregatePriceLog(priceLogs[assets[0].item_id])
//     : [];

//   return (
//     <Flex
//       w={'100%'}
//       flexDirection={{ base: 'column', md: 'row-reverse' }}
//       h={'100%'}
//       overflow={'hidden'}
//       mt={'-20px'}
//     >
//       <Flex
//         flexDirection={'column'}
//         h={'100%'}
//         width={{ base: '100%', md: '35%' }}
//         padding={'5px'}
//         className='lichcom'
//         overflow={'scroll'}
//         bg={useColorModeValue('white', 'gray.900')}
//         css={{
//           '&::-webkit-scrollbar': { display: 'none' },
//           '-ms-overflow-style': 'none', // IE and Edge
//           'scrollbar-width': 'none', // Firefox
//         }}
//       >
//         {assets?.map((asset) => (
//           <Propertylist
//             key={asset.item_id}
//             name={asset.name}
//             existing={asset.quantity}
//             symbol={asset.symbol}
//             id={asset.item_id}
//             unit={asset.unit}
//             price={asset.price}
//           />
//         ))}
//       </Flex>

//       <Flex
//         width={{ base: '100%', md: '65%' }}
//         flexDirection={'column'}
//         overflow={'scroll'}
//         marginRight={'10px'}
//         css={{
//           '&::-webkit-scrollbar': { display: 'none' },
//           '-ms-overflow-style': 'none', // IE and Edge
//           'scrollbar-width': 'none', // Firefox
//         }}
//       >
//         <Flex>
//           <Line
//             data={{
//               labels: aggregatedPriceLogs.map((log) => log.time), // 5-minute intervals
//               datasets: [
//                 {
//                   label: 'Price (Last Hour)',
//                   data: aggregatedPriceLogs.map((log) => log.averagePrice), // Aggregated price data
//                   backgroundColor: '#ff3030',
//                   borderColor: '#ff3030',
//                   fill: false,
//                 },
//               ],
//             }}
//             options={{
//               scales: {
//                 x: { title: { display: true, text: 'Time (5 min intervals)' } },
//                 y: { title: { display: true, text: 'Price' } },
//               },
//               plugins: {
//                 title: {
//                   text: 'Last Hour Price Logs',
//                   display: true,
//                 },
//                 tooltip: { mode: 'index', intersect: false },
//                 hover: { mode: 'index', intersect: false },
//               },
//             }}
//           />
//         </Flex>

//         <Flex>
//           <Bar
//             data={{
//               labels: aggregatedPriceLogs.map((log) => log.time), // 5-minute intervals
//               datasets: [
//                 {
//                   label: 'Price (Last Hour)',
//                   data: aggregatedPriceLogs.map((log) => log.averagePrice), // Aggregated price data
//                   backgroundColor: 'rgba(75, 192, 192, 0.6)',
//                   borderColor: 'rgba(75, 192, 192, 1)',
//                   borderRadius: 5,
//                 },
//               ],
//             }}
//             options={{
//               scales: {
//                 x: { title: { display: true, text: 'Time (5 min intervals)' } },
//                 y: { title: { display: true, text: 'Price' } },
//               },
//               plugins: {
//                 title: {
//                   text: 'Price in Last Hour (5 min Intervals)',
//                   display: true,
//                 },
//                 tooltip: { mode: 'index', intersect: false },
//                 hover: { mode: 'index', intersect: false },
//               },
//             }}
//           />
//         </Flex>
//       </Flex>
//     </Flex>
//   );
// }

// export default LineChartCompo;
import { Flex, useColorModeValue } from '@chakra-ui/react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import revenuedata from '../data/revenuedata.json';
import { Chart as ChartJs, defaults } from 'chart.js/auto';
import Propertylist from './propertylist';
import TotalAsset from './TotalAsset';
import './lich.css';
import { viewUserAssets, viewPriceLog } from '../services/userService';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import assetIdsAtom from '../atoms/assetIdsAtom';
import { useEffect, useState } from 'react';

function LineChartCompo() {
  // Setting up default chart configuration
  defaults.maintainAspectRatio = true;
  defaults.responsive = true;
  defaults.plugins.title.display = true;
  defaults.plugins.title.align = 'start';
  defaults.plugins.title.font.size = 20;
  defaults.plugins.title.color = useColorModeValue('black', 'white');

  const userData = useRecoilValue(userAtom); // Get user data from Recoil
  const [assets, setAssets] = useState([]); // Local state for storing assets
  const setAssetIds = useSetRecoilState(assetIdsAtom); // Setter for asset IDs in Recoil
  const [priceLogs, setPriceLogs] = useState({}); // Local state for storing price logs

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch assets using the userId
        const userId = userData.id;
        const fetchedAssets = await viewUserAssets(userId);
        setAssets(fetchedAssets); // Store fetched assets in local state

        // Extract asset IDs and store in Recoil atom
        const assetIds = fetchedAssets.map((asset) => asset.item_id);
        setAssetIds(assetIds);

        // Fetch price logs for each asset ID
        assetIds.forEach(async (id) => {
          const log = await viewPriceLog(id); // Fetch price log for each item
          setPriceLogs((prevLogs) => ({
            ...prevLogs,
            [id]: log, // Store the price log for each asset by its ID
          }));
        });
      } catch (error) {
        console.error('Failed to fetch assets or price logs:', error);
      }
    };
    console.log('id handling:');
    fetchData(); // Fetch assets and price logs when component mounts
  }, [userData, setAssetIds]); // Dependencies: userData and setAssetIds
  console.log('log:', priceLogs);
  return (
    <Flex
      w={'100%'}
      flexDirection={{ base: 'column', md: 'row-reverse' }}
      h={'100%'}
      overflow={'hidden'}
      mt={'-20px'}
    >
      {/* Sidebar with asset details */}
      <Flex
        flexDirection={'column'}
        h={'100%'}
        width={{ base: '100%', md: '35%' }}
        padding={'5px'}
        className='lichcom'
        overflow={'scroll'}
        bg={useColorModeValue('white', 'gray.900')}
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none', // IE and Edge
          'scrollbar-width': 'none', // Firefox
        }}
      >
        {assets?.map((asset) => (
          <Propertylist
            key={asset.item_id}
            name={asset.name}
            existing={asset.quantity}
            symbol={asset.symbol}
            id={asset.item_id}
            unit={asset.unit}
            price={asset.price}
          />
        ))}
      </Flex>

      {/* Main content with charts */}
      <Flex
        width={{ base: '100%', md: '65%' }}
        flexDirection={'column'}
        overflow={'scroll'}
        marginRight={'10px'}
        css={{
          '&::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none', // IE and Edge
          'scrollbar-width': 'none', // Firefox
        }}
      >
        {/* Charts and data visualizations */}
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
                tooltips: { mode: 'index', intersect: false },
                hover: { mode: 'index', intersect: false },
                plugins: { title: { text: 'Revenue Breakdown' } },
              }}
            />
          </Flex>
        </Flex>

        {/* Line Chart */}
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
              tooltips: { mode: 'index', intersect: false },
              hover: { mode: 'index', intersect: false },
              plugins: { title: { text: 'Monthly Revenue and Cost' } },
            }}
          />
        </Flex>

        {/* Bar Chart */}
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
              tooltips: { mode: 'index', intersect: false },
              hover: { mode: 'index', intersect: false },
              plugins: { title: { text: 'Profit and Loss' } },
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default LineChartCompo;
