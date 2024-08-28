'use client';

import React from 'react';

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Stack,
} from '@chakra-ui/react';
import { FaBoxesStacked } from 'react-icons/fa6';

import {
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiSettings,
  FiSidebar,
} from 'react-icons/fi';
// import { Link as RouterLink } from 'react-router-dom';

import { Link } from 'react-router-dom';
import DetailedAccordion from './DetailedAccordion';

const LinkItems = [
  { name: 'Portfolio', icon: FiHome },
  { name: 'Trade', icon: FiTrendingUp },
  { name: 'Detailed Analysis', icon: FiTrendingUp },

  { name: 'Market Overview', icon: FaBoxesStacked },
  { name: 'Watchlist', icon: FiUsers },
  { name: 'Settings', icon: FiSettings },

  // Additional items can be added here
];

export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      minH='100vh'
      bg={useColorModeValue('gray.100', '#101010')}
      position={'fixed'}
      top={'65px'}
      // overflow={'visible'}
    >
      <SidebarContent
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav
        display={{ base: 'flex', md: 'none' }}
        onOpen={onOpen}
        position={'fixed'}
      />
    </Box>
  );
}

const NavItem = ({ icon, children, path, ...rest }) => {
  return (
    <Box
      as={Link}
      to={path}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align='center'
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr='4'
            fontSize='16'
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      position='fixed'
      h='full'
      overflowY='auto' // Make the sidebar scrollable
      {...rest}
    >
      <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
        <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold'>
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Stack>
        <Flex marginLeft={'18px'}>
          {/* <Link to={'/dashboard/detailedanalysis/citra'}> */}
          <DetailedAccordion />
          {/* </Link> */}
        </Flex>

        {LinkItems.map((link) => {
          // Convert the link name to lowercase and remove spaces
          const formattedPath = link.name.toLowerCase().replace(/\s+/g, '');

          return (
            <NavItem
              key={link.name}
              icon={link.icon}
              path={`/dashboard/${formattedPath}`}
            >
              {link.name}
            </NavItem>
          );
        })}
      </Stack>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      justifyContent='flex-start'
      {...rest}
      onClick={onOpen}
      zIndex={1000}
    >
      <IconButton
        variant='outline'
        aria-label='open menu'
        icon={<FiSidebar />}
      />
    </Flex>
  );
};
