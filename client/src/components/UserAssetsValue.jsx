import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  useColorModeValue,
} from '@chakra-ui/react';
function UserAssetsValue() {
  return (
    // <Stat>
    //   <StatLabel>Collected Fees</StatLabel>
    //   <StatNumber>£0.00</StatNumber>
    //   <StatHelpText>Feb 12 - Feb 28</StatHelpText>
    // </Stat>
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
        <StatNumber>345,670</StatNumber>
        <StatHelpText>
          <StatArrow type='increase' />
          23.36%
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Remaining Balance</StatLabel>
        <StatNumber>45</StatNumber>
        <StatHelpText>
          <StatArrow type='decrease' />
          9.05%
        </StatHelpText>
      </Stat>
    </StatGroup>
  );
}

export default UserAssetsValue;
