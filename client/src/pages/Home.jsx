import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  VStack,
  Image,
  Flex,
  Grid,
  GridItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-image.jpg'; // Your PNG for hero section
import assetIcon from '../assets/asset-icon.png'; // Icon for the assets feature
import chartIcon from '../assets/chart-icon.png'; // Icon for the charts feature
import portfolioIcon from '../assets/portfolio-icon.png'; // Icon for portfolio management

function HomePage() {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box>
      {/* Hero Section */}
      <Flex
        w='100%'
        h={{ base: '400px', md: '500px' }}
        bgImage={`url(${heroImage})`}
        bgPos='center'
        bgSize='cover'
        justify='center'
        align='center'
        flexDir='column'
        color='white'
        textAlign='center'
      >
        <Heading size='2xl' mb={4}>
          Welcome to Your Finance Hub
        </Heading>
        <Text fontSize='lg' mb={8}>
          Manage your portfolio, track real-time prices, and stay updated with
          your assets.
        </Text>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <Button
            as={Link}
            to='/balance'
            colorScheme='pink'
            size='lg'
            _hover={{ bg: 'pink.300' }}
          >
            View Balance
          </Button>
          <Button
            as={Link}
            to='/stock-charts'
            colorScheme='teal'
            size='lg'
            _hover={{ bg: 'teal.300' }}
          >
            Explore Stock Charts
          </Button>
        </Stack>
      </Flex>

      {/* Features Section */}
      <Box py={16} bg={bgColor} textAlign='center'>
        <Heading mb={6} color={textColor}>
          What We Offer
        </Heading>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={8}
          px={8}
        >
          {/* Feature 1: Track Your Assets */}
          <GridItem>
            <VStack
              bg={useColorModeValue('white', 'gray.700')}
              shadow='lg'
              p={8}
              borderRadius='md'
            >
              <Image
                src={assetIcon}
                alt='Track your assets'
                boxSize='80px'
                mb={4}
              />
              <Heading size='md' color={textColor}>
                Track Your Assets
              </Heading>
              <Text fontSize='sm' color={textColor}>
                Monitor and manage your assets in real-time with detailed
                analysis and statistics.
              </Text>
              <Button
                as={Link}
                to='/dashboard/portfolio'
                colorScheme='teal'
                size='sm'
                mt={4}
              >
                View Your Assets
              </Button>
            </VStack>
          </GridItem>

          {/* Feature 2: Real-Time Stock Charts */}
          <GridItem>
            <VStack
              bg={useColorModeValue('white', 'gray.700')}
              shadow='lg'
              p={8}
              borderRadius='md'
            >
              <Image src={chartIcon} alt='Stock charts' boxSize='80px' mb={4} />
              <Heading size='md' color={textColor}>
                Real-Time Stock Charts
              </Heading>
              <Text fontSize='sm' color={textColor}>
                Analyze the latest stock trends with our interactive and
                real-time charts.
              </Text>
              <Button
                as={Link}
                to='/dashboard/detailedanalysis/Quaalude'
                colorScheme='pink'
                size='sm'
                mt={4}
              >
                Explore Charts
              </Button>
            </VStack>
          </GridItem>

          {/* Feature 3: Manage Your Portfolio */}
          <GridItem>
            <VStack
              bg={useColorModeValue('white', 'gray.700')}
              shadow='lg'
              p={8}
              borderRadius='md'
            >
              <Image
                src={portfolioIcon}
                alt='Portfolio management'
                boxSize='80px'
                mb={4}
              />
              <Heading size='md' color={textColor}>
                Manage Your Portfolio
              </Heading>
              <Text fontSize='sm' color={textColor}>
                Take control of your investments and get personalized insights.
              </Text>
              <Button
                as={Link}
                to='/dashboard/portfolio'
                colorScheme='orange'
                size='sm'
                mt={4}
              >
                Manage Portfolio
              </Button>
            </VStack>
          </GridItem>
        </Grid>
      </Box>

      {/* Footer Section */}
      <Box
        py={8}
        textAlign='center'
        bg={useColorModeValue('gray.200', 'gray.800')}
      >
        <Text fontSize='sm' color={textColor}>
          © 2024 Your Finance Hub. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}

export default HomePage;
