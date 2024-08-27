import {
  Box,
  Button,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { FaDollarSign } from 'react-icons/fa';

function TotalAsset() {
  return (
    <Card
      align='center'
      width={'48%'}
      //   width='100%'
      // maxW='400px'
      padding='20px'
      //   bgGradient='linear(to-r, teal.500, green.500)'
      borderRadius='15px'
      boxShadow='lg'
    >
      <CardHeader width='100%' align='left'>
        <Heading size='md'>Total Assets</Heading>
      </CardHeader>
      <CardBody>
        <Box display='flex' alignItems='center'>
          <FaDollarSign size={24} style={{ marginRight: '8px' }} />
          <Heading size='lg' fontWeight='bold'>
            $965,482
          </Heading>
        </Box>
        <Stat mt={4}>
          <StatHelpText>
            <StatArrow type='increase' />
            Up 5% from last month
          </StatHelpText>
        </Stat>
      </CardBody>
      <CardFooter>
        <Button colorScheme='blue'>View Details</Button>
      </CardFooter>
    </Card>
  );
}

export default TotalAsset;
