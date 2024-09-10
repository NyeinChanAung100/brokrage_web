import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { viewBalance, viewUserAssets } from '../services/userService';

function UserAssetsValue() {
  const [balance, setBalance] = useState(0);
  const user = useRecoilValue(userAtom);
  const userId = parseInt(user.id, 10);
  const [assets, setAssets] = useState([]); // Local state for storing assets
  const [totalPrice, setTotalPrice] = useState(0); // State to store total price

  // Fetch balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await viewBalance(userId);
        if (data.success) {
          setBalance(data.balance);
        } else {
          console.error('Failed to fetch balance:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };

    fetchBalance();
  }, [userId]);

  // Fetch assets and calculate total price
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await viewUserAssets(userId);
        if (data) {
          setAssets(data); // Store assets in state

          // Calculate total price after fetching assets
          const total = data.reduce((sum, item) => {
            return sum + parseFloat(item.price) * parseInt(item.quantity);
          }, 0);

          setTotalPrice(total); // Update total price state
        } else {
          console.error('Failed to fetch assets:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };

    fetchAssets();
  }, [userId]);

  return (
    <StatGroup
      w={'95%'}
      bg={useColorModeValue('white', 'gray.900')}
      mb={'10px'}
      borderRadius={'15px'}
      p={'40px 20px'}
      mt={'-10px'}
    >
      <Stat>
        <StatLabel>Total Asset Values</StatLabel>
        <StatNumber>
          {parseFloat(totalPrice) + parseFloat(balance)}
        </StatNumber>{' '}
        {/* Use totalPrice here */}
        <StatHelpText>
          <StatArrow type='increase' />
          23.36%
        </StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Total Value</StatLabel>
        <StatNumber>{totalPrice}</StatNumber> {/* Use totalPrice here */}
        <StatHelpText>
          <StatArrow type='increase' />
          23.36%
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Remaining Balance</StatLabel>
        <StatNumber>{balance}</StatNumber> {/* Use balance here */}
        <StatHelpText>
          <StatArrow type='decrease' />
          9.05%
        </StatHelpText>
      </Stat>
    </StatGroup>
  );
}

export default UserAssetsValue;
