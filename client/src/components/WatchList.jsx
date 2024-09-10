import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  useColorModeValue,
} from '@chakra-ui/react';
import { viewAssets } from '../services/userService';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useEffect, useState } from 'react';

function WatchList() {
  const user = useRecoilValue(userAtom);
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user.id;
        console.log('ig', userId);
        const data = await viewAssets(userId);
        console.log('Fetched Assets:', data);
        setMarketData(data);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <TableContainer
      bg={useColorModeValue('white', 'gray.900')}
      w={'100%'}
      borderRadius={'5px'}
    >
      <Table size='lg'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Market cap</Th>
            <Th>Supply</Th>
          </Tr>
        </Thead>

        <Tbody>
          {/* Filter the data to display only items where isWatchlist is true */}
          {marketData
            ?.filter((data) => data.isWatchlist === true) // Only show watchlist items
            .map((data) => (
              <Tr key={data.id}>
                <Th>{data.name}</Th>
                <Th>{data.price}</Th>
                <Th>{data.market_cap}</Th>
                <Th>{data.supply}</Th>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default WatchList;
