import {
  Box,
  Button,
  Flex,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { itemAtom } from '../atoms/itemAtom';
// import InitialFocus from './BuySellModal';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

// import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

function Propertylist(props) {
  const { colorMode } = useColorMode();
  const textColor = props.tran === 'up' ? 'green' : 'red';
  const upordown = props.tran === 'up' ? 'increase' : 'decrease';
  const itemInfo = useSetRecoilState(itemAtom);
  const itemvalue = useRecoilValue(itemAtom);
  console.log('props:', props);
  const handleClick = () => {
    itemInfo({
      name: props.item,
      price: props.price,
      unitprice: props.unitprice,
      unit: props.tran,
    });
  };
  console.log('iteminfo:', itemvalue);

  return (
    <Flex
      width='100%'
      height='80px'
      alignItems='center'
      // borderRadius='8px'
      paddingLeft='15px'
      bg={useColorModeValue('white', 'gray.900')}
      marginTop='10px'
      justifyContent='space-between'
      borderBottom={colorMode === 'dark' ? '2px solid #444' : '2px solid #ccc'}
    >
      <Flex alignItems='center'>
        <Stat>
          <StatLabel>{props.item}</StatLabel>
          <StatNumber fontSize={'20px'} color={textColor}>
            {props.price}
          </StatNumber>
          <StatHelpText>
            <StatArrow type={upordown} />
            23.36%
          </StatHelpText>
        </Stat>
      </Flex>
      <Box width='100px' height={'100%'}>
        <Stat>
          <StatLabel>Unit price</StatLabel>
          <StatNumber fontSize={'20px'} color={textColor}>
            {props.unitprice}
          </StatNumber>

          <Button
            // onClick={handleOpenModal}
            colorScheme='teal'
            size='xs'
            border={'2px outset rgb(252,249,250)'}
            onClick={handleClick}
          >
            <Link to={'/sell'}>sell</Link>
          </Button>
          {/* <InitialFocus isOpen={isModalOpen} onClose={handleCloseModal} /> */}
        </Stat>
      </Box>
    </Flex>
  );
}

export default Propertylist;
