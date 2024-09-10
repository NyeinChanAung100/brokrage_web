import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

const ListItem = () => {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <Box
        bg={useColorModeValue('white', 'gray.900')}
        p={8}
        boxShadow="lg"
        rounded="lg"
        width="100%"
        maxWidth="600px"
      >
        <form>
          <VStack spacing={4} align="stretch">
            <FormControl id="asset" isRequired>
              <FormLabel>Select Asset</FormLabel>
              <Select placeholder="Select Asset">
                {/* {marketData.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))} */}
              </Select>
            </FormControl>

            <FormControl id="amount" isRequired>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                // onChange={(e) => {
                //   setAmount(e.target.value);
                // }}
                placeholder="Enter amount"
              />
            </FormControl>

            <HStack justify="space-between">
              <Button colorScheme="blue" type="submit" width="100%">
                List Item
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default ListItem;
