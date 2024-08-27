import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-stockcharts';
import { useColorMode } from '@chakra-ui/react';

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

function StockChart() {
  const { colorMode } = useColorMode(); // Get the current color mode
  const [dataPoints1, setDataPoints1] = useState([]);
  const [dataPoints2, setDataPoints2] = useState([]);
  const [dataPoints3, setDataPoints3] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('https://canvasjs.com/data/docs/ltcusd2018.json')
      .then((res) => res.json())
      .then((data) => {
        const dps1 = [];
        const dps2 = [];
        const dps3 = [];
        data.forEach((entry) => {
          dps1.push({
            x: new Date(entry.date),
            y: [
              Number(entry.open),
              Number(entry.high),
              Number(entry.low),
              Number(entry.close),
            ],
          });
          dps2.push({
            x: new Date(entry.date),
            y: Number(entry.volume_usd),
          });
          dps3.push({ x: new Date(entry.date), y: Number(entry.close) });
        });
        setDataPoints1(dps1);
        setDataPoints2(dps2);
        setDataPoints3(dps3);
        setIsLoaded(true);
      });
  }, []);

  const options = {
    theme: colorMode === 'dark' ? 'dark1' : 'light2', // Dynamic theme based on color mode
    // title: {
    //   text: 'Detailed Analysis',
    // },
    // subtitles: [
    //   {
    //     text: 'Price-Volume Trend',
    //   },
    // ],
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
          title: 'Litecoin Price',
          prefix: '$',
          tickLength: 0,
        },
        toolTip: {
          shared: true,
        },
        data: [
          {
            name: 'Price (in USD)',
            yValueFormatString: '$#,###.##',
            type: 'candlestick',
            dataPoints: dataPoints1,
          },
        ],
      },
      {
        height: 100,
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
          },
        },
        axisY: {
          title: 'Volume',
          prefix: '$',
          tickLength: 0,
        },
        toolTip: {
          shared: true,
        },
        data: [
          {
            name: 'Volume',
            yValueFormatString: '$#,###.##',
            type: 'column',
            dataPoints: dataPoints2,
          },
        ],
      },
    ],
    navigator: {
      data: [
        {
          dataPoints: dataPoints3,
        },
      ],
      slider: {
        minimum: new Date('2018-05-01'),
        maximum: new Date('2018-07-01'),
      },
    },
  };

  //   const containerProps = {
  //     width: '100%',
  //     height: '450px',
  //     margin: 'auto',
  //   };
  const containerProps = {
    width: '100%', // Set to 100% to take the full width of the parent
    height: '100%',
    margin: 'auto',
  };

  return (
    <div>
      {isLoaded && (
        <CanvasJSStockChart containerProps={containerProps} options={options} />
      )}
    </div>
  );
}

export default StockChart;
