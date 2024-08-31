// import { Flex, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';

// function Propertylist(props) {
//   const { colorMode } = useColorMode();
//   const textColor = props.tran === 'up' ? 'green' : 'red';

//   return (
//     <Flex
//       width='100%'
//       height='50px'
//       alignItems='center'
//       paddingLeft='15px'
//       pt={'20px'}
//       bg={useColorModeValue('white', 'gray.900')}
//       marginTop='10px'
//       justifyContent='space-between'
//       borderBottom={colorMode === 'dark' ? '2px solid #444' : '2px solid #ccc'}
//     >
//       <Text width='200px' height='50px' fontWeight={'bold'}>
//         {props.item}
//       </Text>
//       <Text width='100px' height='50px' color={textColor} fontWeight={'bold'}>
//         {props.price}
//       </Text>
//     </Flex>
//   );
// }

// export default Propertylist;
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
// import InitialFocus from './BuySellModal';
import { useState } from 'react';
// Adjust the import path as needed

// import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

function Propertylist(props) {
  const { colorMode } = useColorMode();
  const textColor = props.tran === 'up' ? 'green' : 'red';
  const upordown = props.tran === 'up' ? 'increase' : 'decrease';
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };
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
          >
            sell now
          </Button>
          {/* <InitialFocus isOpen={isModalOpen} onClose={handleCloseModal} /> */}
        </Stat>
      </Box>
    </Flex>
  );
}

export default Propertylist;
