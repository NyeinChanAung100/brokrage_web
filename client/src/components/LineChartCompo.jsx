import {
  Flex,
  FormControl,
  FormLabel,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import revenuedata from '../data/revenuedata.json';
import { Chart as ChartJs, defaults } from 'chart.js/auto';
import Propertylist from './propertylist';
import TotalAsset from './TotalAsset';
import './lich.css';
import { viewUserAssets, viewPriceLog } from '../services/userService';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import assetIdsAtom from '../atoms/assetIdsAtom';
import { useEffect, useState } from 'react';
import { userItem } from '../atoms/userItem';
import idAtom from '../atoms/idAtom';

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
  const [logprice, setlogprice] = useState([]); // Local state for storing price logs
  const [logtime, setlogtime] = useState([]); // Local state for storing time logs
  const [temp, setTemp] = useState([]); // State for storing the last 100 prices
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [timeTemp, setTimeTemp] = useState([]); // State for storing the last 100 prices
  const [selectedTimes, setSelectedTimes] = useState([]);
  const idd = useRecoilValue(assetIdsAtom);
  const [idc, setidc] = useState(idd[0]);
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // const [io, setio] = useRecoilState(idAtom);

  // const useritem = useRecoilValue(userItem);
  // console.log('useritemId:', idc);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = userData.id;
        const fetchedAssets = await viewUserAssets(userId);
        setAssets(fetchedAssets);
        // console.log(fetchedAssets, 'jkjk');

        const assetIds = fetchedAssets.map((asset) => asset.item_id);
        setAssetIds(assetIds);

        // Fetch price logs for each asset
        const logsPromises = assetIds.map(async (id) => {
          const log = await viewPriceLog(id);
          return { id, log };
        });

        const fetchedLogs = await Promise.all(logsPromises);

        const logsObject = fetchedLogs.reduce((acc, { id, log }) => {
          acc[id] = log;
          return acc;
        }, {});

        setPriceLogs(logsObject);

        if (logsObject[idc]) {
          const p = logsObject[idc].data?.map((item) => item.price);
          const t = logsObject[idc].data?.map((item) => item.log_time);

          setlogprice(p);
          setlogtime(t);
        }
      } catch (error) {
        console.error('Failed to fetch assets or price logs:', error);
      }
    };

    fetchData();
  }, [userData, setAssetIds, idc]); // Optionally add priceLogs here if needed
  // console.log('aaaaa', assets[1].item_id);
  // if (assets) {
  //   const idd = assets[1].item_id;
  //   const [idc, setidc] = useState(iid);
  //   console.log(idc, 'opop');
  // }

  // console.log('price::', logprice);
  // console.log('time::', logtime);
  useEffect(() => {
    if (logprice.length > 0 && logtime.length > 0) {
      // console.log('Original logprice:', logprice);
      // console.log('Original logtime:', logtime);

      // Step 1: Get the last 3600 records
      const last1HrPrices = logprice.slice(-360); // last 1 hour of prices
      const last1HrTimes = logtime.slice(-360); // last 1 hour of timestamps
      console.log(last1HrTimes);
      // Step 2: Filter data at 5-minute intervals (every 300 seconds)
      const tempPrices = last1HrPrices.filter(
        (_, index) => (index + 1) % 20 === 0,
      );
      const tempTimes = last1HrTimes
        .filter((_, index) => (index + 1) % 20 === 0)
        .map((time) => {
          // Convert timestamps to HH:MM:SS format dynamically
          const date = new Date(time);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = date.getSeconds().toString().padStart(2, '0');
          return `${hours}:${minutes}:${seconds}`;
        });

      // Step 3: Update state with filtered and formatted data
      setTemp(last1HrPrices); // Optional: store last 3600 prices (1 hour)
      setTimeTemp(last1HrTimes); // Optional: store last 3600 times (1 hour)
      setSelectedPrices(tempPrices); // Store filtered prices (at 5-minute intervals)
      setSelectedTimes(tempTimes); // Store filtered and formatted times (at 5-minute intervals)
    }
  }, [logprice, logtime, idc, setidc]); // Dependencies
  // Run this effect when the prices array changes
  // console.log(':::::::', selectedPrices);
  // console.log('ioiooio:', idc);
  // console.log('selected times', selectedTimes);

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
            // idc={idc}
            // setidc={setidc}
          />
        ))}
      </Flex>

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
        <Flex justifyContent={'space-between'}>
          <TotalAsset />
          <Flex
            width={'49%'}
            bg={useColorModeValue('white', '#475C6C')}
            borderRadius={'15px'}
          >
            <Doughnut
              data={{
                labels: assets.map((item) => item.name),
                datasets: [
                  {
                    label: 'Total price',
                    data: assets.map((item) => item.quantity * item.price),
                    backgroundColor: assets.map(() => generateRandomColor()), // Generate random colors
                    borderColor: 'white',
                  },
                  {
                    label: 'Quantity',
                    data: assets.map((item) => item.quantity),
                    backgroundColor: assets.map(() => generateRandomColor()), // Generate random colors
                    borderColor: 'black',
                  },
                ],
              }}
              options={{
                tooltips: { mode: 'index', intersect: false },
                hover: { mode: 'index', intersect: false },
                plugins: { title: { text: 'Quantity and Total price' } },
              }}
            />
          </Flex>
        </Flex>
        <Flex
          justifyContent={'flex-end'}
          marginTop={'10px'}
          bg={useColorModeValue('white', 'gray.900')}
          padding={'20px'}
          borderRadius={'10px'}
        >
          <FormControl id='item' isRequired w={'300px'} alignContent={'left'}>
            <FormLabel>Select to see the chart of</FormLabel>
            <Select value={idc} onChange={(e) => setidc(e.target.value)}>
              {assets?.map((data, index) => (
                <option key={index} value={data.item_id}>
                  {`${data.name}${data.item_id}`}
                </option>
              ))}
            </Select>
          </FormControl>
        </Flex>
        <Flex>
          <Line
            data={{
              labels: selectedTimes, // Using selected times from the last hour
              datasets: [
                {
                  label: 'Price (Last Hour)',
                  data: selectedPrices, // Using selected prices from the last hour
                  backgroundColor: '#ff3030',
                  borderColor: '#ff3030',
                  fill: false,
                },
              ],
            }}
            options={{
              scales: {
                x: { title: { display: true, text: 'Time (3 min intervals)' } },
                y: { title: { display: true, text: 'Price' } },
              },
              plugins: {
                title: {
                  text: 'Price Movement (Last Hour)',
                  display: true,
                },
                tooltip: { mode: 'index', intersect: false },
                hover: { mode: 'index', intersect: false },
              },
            }}
          />
        </Flex>

        <Flex>
          <Bar
            data={{
              labels: selectedTimes, // Using selected times from the last hour
              datasets: [
                {
                  label: 'Price (Last Hour)',
                  data: selectedPrices, // Using selected prices from the last hour
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              scales: {
                x: { title: { display: true, text: 'Time (3 min intervals)' } },
                y: { title: { display: true, text: 'Price' } },
              },
              plugins: {
                title: {
                  text: 'Price Distribution (Last Hour)',
                  display: true,
                },
                tooltip: { mode: 'index', intersect: false },
                hover: { mode: 'index', intersect: false },
              },
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default LineChartCompo;
