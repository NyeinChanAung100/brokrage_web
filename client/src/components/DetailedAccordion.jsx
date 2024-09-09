import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { TbDeviceDesktopAnalytics } from 'react-icons/tb';
import { viewAssets } from '../services/userService';
import userAtom from '../atoms/userAtom';
import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { allItemAtom } from '../atoms/allItemAtom';

function DetailedAccordion() {
  const userData = useRecoilValue(userAtom);
  const [marketData, setMarketData] = useState([]);
  const [allItem, setAllItemAtom] = useRecoilState(allItemAtom); // Correct use of Recoil state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = userData.id; // Replace with the actual user ID
        const data = await viewAssets(userId);
        console.log('Fetched Assets:', data); // Log the fetched data
        setMarketData(data); // Set the fetched data to state
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };

    fetchData();
  }, [userData]);

  return (
    <Accordion defaultIndex={[]} allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Flex
              as='span'
              flex='1'
              justifyContent={'space-between'}
              w={'87px'}
            >
              <TbDeviceDesktopAnalytics />
              <Text>Analysis</Text>
            </Flex>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        {marketData?.map((data) => (
          <AccordionPanel pb={1} key={data.id}>
            <Link
              to={`/dashboard/detailedanalysis/${data.name}`}
              style={{ textDecoration: 'none' }} // Remove default underline
              onClick={() => setAllItemAtom(data)} // Set the atom to the clicked item's data
            >
              <Text
                borderRadius={'5px'}
                pl={'5px'}
                _hover={{
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                  color: 'black',
                  bg: '#03cafc', // Change color on hover
                }}
              >
                {data.name}
              </Text>
            </Link>
          </AccordionPanel>
        ))}
      </AccordionItem>
    </Accordion>
  );
}

export default DetailedAccordion;
