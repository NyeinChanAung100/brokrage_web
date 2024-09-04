import {
  Box,
  Button,
  Flex,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { userItem } from '../atoms/userItem.js';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Link } from 'react-router-dom';

function Propertylist(props) {
  const tran = 'up';
  const { colorMode } = useColorMode();
  const textColor = tran === 'up' ? 'green' : 'red';
  const upordown = tran === 'up' ? 'increase' : 'decrease';
  const setItemInfo = useSetRecoilState(userItem);
  const itemvalue = useRecoilValue(userItem);

  const handleClick = () => {
    setItemInfo({
      name: props.name,
      price: props.price,
      total: props.unit * props.existing,
      unit: props.unit,
    });
  };
  console.log('itemvalue', itemvalue);
  return (
    <Flex
      width='100%'
      height='80px'
      alignItems='center'
      paddingLeft='15px'
      bg={useColorModeValue('white', 'gray.900')}
      marginTop='10px'
      justifyContent='space-between'
      borderBottom={colorMode === 'dark' ? '2px solid #444' : '2px solid #ccc'}
    >
      <Flex alignItems='center'>
        <Stat>
          <StatLabel>{props.name}</StatLabel>
          <StatNumber fontSize='20px' color={textColor}>
            {itemvalue.total}
          </StatNumber>
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
            size='xs'
            border='2px outset rgb(252,249,250)'
            onClick={handleClick}
          >
            <Link to='/sell'>sell</Link>
          </Button>
        </Stat>
      </Box>
    </Flex>
  );
}

export default Propertylist;
