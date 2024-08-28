import { Box, Flex, StackDivider, Text, VStack } from '@chakra-ui/react';

function WatchList() {
  return (
    <Flex width={'90%'} h={'100%'} justifyContent={'space-between'}>
      <Box w={'200px'} textAlign={'start'}>
        <Text>
          <p>name</p>
          <p>name</p>
          <p>name</p>
          <p>name</p>
          <p>name</p>
        </Text>
      </Box>
      <Box w={'150px'} textAlign={'end'}>
        <Text>
          <p>price</p>
        </Text>
      </Box>
      <Box>
        <Text>
          <p>chart</p>
        </Text>
      </Box>
      <Box>
        <Text>
          <p>change in percentage</p>
        </Text>
      </Box>
      <Box></Box>
      <Box></Box>
    </Flex>
  );
}

export default WatchList;
