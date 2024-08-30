import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';
import productData from '../data/watchList.json';

function WatchList() {
  return (
    <TableContainer>
      <Table size="lg">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Price</Th>

            <Th>%Change</Th>
            <Th>Volume</Th>
          </Tr>
        </Thead>
        <Tbody>
          {productData?.map((data) => {
            return (
              <>
                <Tr>
                  <Th key={data.productName}>{data.productName}</Th>
                  <Th key={data.lastPrice}>{data.lastPrice}</Th>
                  <Th key={data.percentChangeDay}>{data.percentChangeDay}</Th>
                  <Th key={data.volume30DayRange}>{data.volume30DayRange}</Th>
                </Tr>
              </>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default WatchList;
