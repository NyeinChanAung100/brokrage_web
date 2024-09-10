import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { fetchAllItemsWithDetails, viewAssets } from '../services/userService';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

function HomeUserOr() {
  const userData = useRecoilValue(userAtom);

  //   const [marketData, setMarketData] = useState([]);

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const userId = userData.id;
  //         const data = await fetchAllItemsWithDetails(userId);
  //         console.log('Fetched Assets:', data);
  //         setMarketData(data);
  //       } catch (error) {
  //         console.error('Failed to fetch assets:', error);
  //       }
  //     };

  //     fetchData();
  //   }, []);
  //   console.log('wgat', marketData);
  return (
    <Flex
      flex={1}
      flexDirection={'column'}
      padding={'20px'}
      h={'100vh'}
      marginTop={'20px'}
      borderRadius={'5px'}
      ml={'10px'}
      backgroundImage={`url('/aaaa.jpg')`}
      backgroundSize='cover'
      backgroundPosition='center'
      justifyContent={'center'}
      alignItems={'center'}
      color={'wheat'}
      textAlign={'center'}
      //   textShadow={'5px 5px 5px white'}
    >
      <Heading fontSize={'20px'} mb={4}>
        Want to make money?
      </Heading>
      <Heading size={'2xl'} mb={4}>
        Register right now
      </Heading>
      <Text fontSize={'lg'} mb={6} maxW={'400px'}>
        Start your journey towards financial freedom by investing today. Join
        our platform to access numerous trading opportunities that can help you
        grow your wealth.
      </Text>
      <Button
        colorScheme='purple'
        size='lg'
        width={'150px'}
        mt={'20px'}
        _hover={{ bg: 'purple.600' }}
      >
        <Link
          style={{
            display: 'inline',
            width: '100%',
            height: '100%',
            paddingTop: '15px',
          }}
        >
          Register
        </Link>
      </Button>
    </Flex>
  );
}

export default HomeUserOr;
