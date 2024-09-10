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
import { userItem } from '../atoms/userItem.js';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Link } from 'react-router-dom';
import { buyorsellAtom } from '../atoms/buyorsellAtom.js';
import { useState } from 'react';
import assetIdsAtom from '../atoms/assetIdsAtom.js';

function Propertylist(props) {
  const tran = 'up';
  const { colorMode } = useColorMode();
  const textColor = tran === 'up' ? 'green' : 'red';
  const upordown = tran === 'up' ? 'increase' : 'decrease';
  const setItemInfo = useSetRecoilState(userItem);
  const itemvalue = useRecoilValue(userItem);
  const setTrade = useSetRecoilState(buyorsellAtom);
  const [priceLogs, setPriceLogs] = useState({});
  // console.log('props.price', props.price);
  const parsedPrice = parseInt(props.price, 10);
  const ide = useRecoilValue(assetIdsAtom);

  // console.log('props.existing', props.existing);
  const handleClick = () => {
    setItemInfo({
      name: props.name,
      price: parsedPrice,
      total: parsedPrice * props.existing,
      unit: props.unit,
    });
    setTrade('sell');
  };
  // console.log('itemvalue', itemvalue);
  return (
    <Flex
      width='100%'
      height='100px'
      alignItems='center'
      paddingLeft='15px'
      bg={useColorModeValue('white', 'gray.900')}
      marginTop='10px'
      justifyContent='space-between'
      borderBottom={colorMode === 'dark' ? '2px solid #444' : '2px solid #ccc'}
      // onClick={() => props.setidc(props.id)}
    >
      <Flex alignItems='center'>
        <Stat>
          <StatLabel>{props.name}</StatLabel>
          <StatNumber fontSize='20px' color={textColor}>
            {`Total-$${parsedPrice * props.existing}`}
          </StatNumber>
          <Text fontSize={'14px'} color={textColor}>
            {`Quantity-${props.existing} ${props.unit}`}
          </Text>

          <StatHelpText>
            <StatArrow type={upordown} />
            23.36%
          </StatHelpText>
        </Stat>
      </Flex>
      <Box width='100px' height='100%'>
        <Stat>
          <StatLabel>Unit price</StatLabel>
          <StatNumber fontSize='20px' color={textColor}>
            {props.price}
          </StatNumber>

          <Button
            colorScheme='teal'
            size='sm'
            border='2px outset rgb(252,249,250)'
            onClick={handleClick}
          >
            <Link
              to='/dashboard/trade'
              style={{
                display: 'inline',
                width: '100%',
                height: '100%',
                paddingTop: '5px',
                // border: '1px solid black',
              }}
            >
              sell
            </Link>
          </Button>
        </Stat>
      </Box>
    </Flex>
  );
}

export default Propertylist;
