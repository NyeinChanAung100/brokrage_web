import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-stockcharts';
import { position, useBreakpointValue, useColorMode } from '@chakra-ui/react';

var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

function StockChart() {
  const containerWidth = useBreakpointValue({
    base: '100%', // for small screens
    md: '75%', // for medium screens
    lg: '80%', // for large screens
  });
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
    theme: colorMode === 'dark' ? 'dark1' : 'light2',

    backgroundColor: colorMode === 'dark' ? '#171923' : '#FFFFFF', // Set background color based on color mode
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
            risingColor: colorMode === 'dark' ? '#00FF00' : '#008000', // Custom color for rising candles
            color: colorMode === 'dark' ? '#FF0000' : '#FF6347', // Custom color for falling candles
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
            color: colorMode === 'dark' ? '#90CDF4' : '#4299E1', // Custom color for volume bars
          },
        ],
      },
    ],
    navigator: {
      data: [
        {
          dataPoints: dataPoints3,
          color: colorMode === 'dark' ? '#63B3ED' : '#3182CE', // Custom color for navigator line
        },
      ],
      slider: {
        minimum: new Date('2018-05-01'),
        maximum: new Date('2018-07-01'),
      },
    },
  };

  // const options = {
  //   theme: colorMode === 'dark' ? 'dark1' : 'light2',
  // title: {
  //   text: 'Detailed Analysis',
  // },
  // subtitles: [
  //   {
  //     text: 'Price-Volume Trend',
  //   },
  // ],
  //   charts: [
  //     {
  //       axisX: {
  //         lineThickness: 5,
  //         tickLength: 0,
  //         labelFormatter: () => '',
  //         crosshair: {
  //           enabled: true,
  //           snapToDataPoint: true,
  //           labelFormatter: () => '',
  //         },
  //       },
  //       axisY: {
  //         title: 'Litecoin Price',
  //         prefix: '$',
  //         tickLength: 0,
  //       },
  //       toolTip: {
  //         shared: true,
  //       },
  //       data: [
  //         {
  //           name: 'Price (in USD)',
  //           yValueFormatString: '$#,###.##',
  //           type: 'candlestick',
  //           dataPoints: dataPoints1,
  //         },
  //       ],
  //     },
  //     {
  //       height: 100,
  //       axisX: {
  //         crosshair: {
  //           enabled: true,
  //           snapToDataPoint: true,
  //         },
  //       },
  //       axisY: {
  //         title: 'Volume',
  //         prefix: '$',
  //         tickLength: 0,
  //       },
  //       toolTip: {
  //         shared: true,
  //       },
  //       data: [
  //         {
  //           name: 'Volume',
  //           yValueFormatString: '$#,###.##',
  //           type: 'column',
  //           dataPoints: dataPoints2,
  //         },
  //       ],
  //     },
  //   ],
  //   navigator: {
  //     data: [
  //       {
  //         dataPoints: dataPoints3,
  //       },
  //     ],
  //     slider: {
  //       minimum: new Date('2018-05-01'),
  //       maximum: new Date('2018-07-01'),
  //     },
  //   },
  // };

  // const containerProps = {
  //   width: '100%',
  //   margin: 'auto',
  // };

  const containerProps = {
    width: containerWidth,
    height: 'calc(100% - 60px)',
    margin: 'auto',
    position: 'fixed',
    top: '60px',
    bottom: '0px',
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
