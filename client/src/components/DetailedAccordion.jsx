import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import assetList from '../data/assetList.json';
import { Link } from 'react-router-dom';
import { TbDeviceDesktopAnalytics } from 'react-icons/tb';

function DetailedAccordion() {
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
        {assetList?.map((data) => (
          <AccordionPanel pb={1} key={data.item}>
            <Link
              to={`/dashboard/detailedanalysis/${data.item}`}
              style={{ textDecoration: 'none' }} // Remove default underline
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
                {data.item}
              </Text>
            </Link>
          </AccordionPanel>
        ))}
      </AccordionItem>
    </Accordion>
  );
}

export default DetailedAccordion;
