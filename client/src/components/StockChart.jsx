import { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-stockcharts';
import {
  useBreakpointValue,
  useColorMode,
  Button,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { allItemAtom } from '../atoms/allItemAtom';

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

function StockChart() {
  const itemDetail = useRecoilValue(allItemAtom);
  // console.log('itemDetail:', itemDetail);
  const [activeInterval, setActiveInterval] = useState(null);

  const parsedId = parseInt(itemDetail.id, 10); // Output: 123

  const containerWidth = useBreakpointValue({
    base: '100%', // for small screens
    md: '75%', // for medium screens
    lg: '80%', // for large screens
  });
  const { colorMode } = useColorMode();
  const [dataPoints, setDataPoints] = useState([]);
  const [interval, setInterval] = useState(5); // Default interval is 2 minutes
  const [isLoaded, setIsLoaded] = useState(false);
  const itemName = itemDetail.name;
  // console.log(itemDetail, 'fggf');
  useEffect(() => {
    // Fetch data from your server
    fetch(
      `http://localhost/brokrage_web/server/user/view-price-log.php?item_id=${parsedId}`,
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.success && Array.isArray(response.data)) {
          const rawData = response.data.map((entry) => ({
            price: Number(entry.price),
            log_time: new Date(entry.log_time),
          }));
          updateCandleData(rawData, interval);
        }
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, [interval, itemDetail]);

  const updateCandleData = (rawData, interval) => {
    const candles = [];
    let open = rawData[0].price;
    let high = rawData[0].price;
    let low = rawData[0].price;
    let close = rawData[0].price;
    let startTime = rawData[0].log_time;

    rawData.forEach((entry) => {
      const timeDiff = (entry.log_time - startTime) / (60 * 1000); // in minutes

      if (timeDiff < interval) {
        high = Math.max(high, entry.price);
        low = Math.min(low, entry.price);
        close = entry.price;
      } else {
        candles.push({
          x: startTime,
          y: [open, high, low, close],
        });
        open = entry.price;
        high = entry.price;
        low = entry.price;
        close = entry.price;
        startTime = entry.log_time;
      }
    });

    // Push the last candle
    candles.push({
      x: startTime,
      y: [open, high, low, close],
    });

    setDataPoints(candles);
    setIsLoaded(true);
  };

  const options = {
    theme: colorMode === 'dark' ? 'dark1' : 'light2',
    backgroundColor: colorMode === 'dark' ? '#171923' : '#FFFFFF',
    charts: [
      {
        axisX: {
          lineThickness: 5,
          tickLength: 0,
          labelFormatter: () => '',
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            labelFormatter: () => '',
          },
        },
        axisY: {
          title: 'Price',
          prefix: '$',
          tickLength: 0,
        },
        toolTip: {
          shared: true,
        },
        title: {
          text: itemName,
          // more attributes
        },
        data: [
          {
            name: 'Price (in USD)',
            yValueFormatString: '$#,###.##',
            type: 'candlestick',
            dataPoints: dataPoints,
            risingColor: colorMode === 'dark' ? '#00FF00' : '#008000',
            color: colorMode === 'dark' ? '#FF0000' : '#FF6347',
          },
        ],
      },
    ],
    rangeSelector: {
      enabled: false,
    },
  };

  const containerProps = {
    width: containerWidth,
    height: 'calc(100% - 140px)',
    margin: 'auto',
    position: 'fixed',
    borderRadius: '8px',
    top: '180px',
    bottom: '60px',
  };

  return (
    <div>
      <HStack
        spacing={4}
        marginBottom={4}
        position={'fixed'}
        top={'70px'}
        w={'100%'}
        bg={useColorModeValue('white', 'gray.900')}
        borderRadius={'10px'}
        padding={'8px'}
      >
        <Button
          bg={interval === 1 ? '#ff30d6' : 'transparent'}
          color={interval === 1 ? 'white' : 'black'}
          border='1px solid #ff30d6'
          _hover={{ bg: '#ff30d6', color: 'white' }}
          onClick={() => setInterval(1)}
        >
          1 mins
        </Button>

        <Button
          bg={interval === 5 ? '#ff30d6' : 'transparent'}
          color={interval === 5 ? 'white' : 'black'}
          border='1px solid #ff30d6'
          _hover={{ bg: '#ff30d6', color: 'white' }}
          onClick={() => setInterval(5)}
        >
          5 mins
        </Button>

        <Button
          bg={interval === 15 ? '#ff30d6' : 'transparent'}
          color={interval === 15 ? 'white' : 'black'}
          border='1px solid #ff30d6'
          _hover={{ bg: '#ff30d6', color: 'white' }}
          onClick={() => setInterval(15)}
        >
          15 mins
        </Button>
        <Button
          bg={interval === 30 ? '#ff30d6' : 'transparent'}
          color={interval === 30 ? 'white' : 'black'}
          border='1px solid #ff30d6'
          _hover={{ bg: '#ff30d6', color: 'white' }}
          onClick={() => setInterval(30)}
        >
          30 mins
        </Button>
        <Button
          bg={interval === 60 ? '#ff30d6' : 'transparent'}
          color={interval === 60 ? 'white' : 'black'}
          border='1px solid #ff30d6'
          _hover={{ bg: '#ff30d6', color: 'white' }}
          onClick={() => setInterval(60)}
        >
          1 hr
        </Button>
        <Button
          bg={interval === 240 ? '#ff30d6' : 'transparent'}
          color={interval === 240 ? 'white' : 'black'}
          border='1px solid #ff30d6'
          _hover={{ bg: '#ff30d6', color: 'white' }}
          onClick={() => setInterval(240)}
        >
          4 hrs
        </Button>
        <Button
          bg={interval === 1440 ? '#ff30d6' : 'transparent'}
          color={interval === 1440 ? 'white' : 'black'}
          border='1px solid #ff30d6'
          _hover={{ bg: '#ff30d6', color: 'white' }}
          onClick={() => setInterval(1440)}
        >
          daily
        </Button>
        <Button
          bg={interval === 10080 ? '#ff30d6' : 'transparent'}
          color={interval === 10080 ? 'white' : 'black'}
          border='1px solid #ff30d6'
          _hover={{ bg: '#ff30d6', color: 'white' }}
          onClick={() => setInterval(10080)}
        >
          weekly
        </Button>
      </HStack>

      {isLoaded && (
        <CanvasJSStockChart containerProps={containerProps} options={options} />
      )}
    </div>
  );
}

export default StockChart;
