import {
  Box,
  Button,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stat,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { viewBalance } from '../services/userService';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

function TotalAsset() {
  const [balance, setBalance] = useState(0);
  const user = useRecoilValue(userAtom);
  const userId = parseInt(user.id, 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await viewBalance(userId);
        if (data.success) {
          setBalance(data.balance); // Accessing the balance from the object
        } else {
          console.error('Failed to fetch balance:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <Card
      align='center'
      width={'48%'}
      padding='20px'
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
            {balance}
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
