// import { Box, Flex } from '@chakra-ui/react';
// import SimpleSidebar from '../components/sidebar';
// import { Outlet } from 'react-router-dom';

// function Dashboard() {
//   return (
//     <Box w='100%' minH='100vh' display='flex'>
//       <div>
//         {' '}
//         <SimpleSidebar />
//       </div>
//       <Flex flex='1' p={4} ml={'245px'} border={'3px solid white'}>
//         <Outlet />
//       </Flex>
//     </Box>
//   );
// }

// export default Dashboard;
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import SimpleSidebar from '../components/sidebar';
import { Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <Box width='100%' height='100vh' display='flex'>
      <SimpleSidebar />
      <Flex
        flex='1'
        // p={4}
        ml={{ base: '5px', md: '250px' }}
        paddingTop={'20px'}
        // border={'5px solid yellow'}
        // bg={useColorModeValue('gray.200', 'gray.700')}
      >
        <Outlet />
      </Flex>
    </Box>
  );
}

export default Dashboard;
