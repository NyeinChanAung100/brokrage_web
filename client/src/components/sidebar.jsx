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
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiArrowRight,
  FiSidebar,
  FiUsers,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const LinkItems = [
  { name: 'voucher', icon: FiHome },
  { name: 'transactions', icon: FiTrendingUp },
  { name: 'Inventory', icon: FaBoxesStacked },
  { name: 'users', icon: FiUsers },
  { name: 'suppliers', icon: FiTrendingUp },
  { name: 'Customers', icon: FaBoxesStacked },
  { name: 'Shareholders', icon: FiUsers },
  { name: 'Settings', icon: FiSettings },
];

export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      minH='100vh'
      bg={useColorModeValue('gray.100', '#101010')}
      position={'fixed'}
      top={'70px'}
      //   border={'5px solid red'}
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
      {/* <Box ml={{ base: 0, md: 60 }} p='4'> */}
      {/* Content */}
      {/* </Box> */}
    </Box>
  );
}

const NavItem = ({ icon, children, path, ...rest }) => {
  return (
    <Box
      as={Link} // Use Link from react-router-dom
      to={path} // Navigate to the correct path
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

// SidebarContent component:
const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}
    >
      <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
        <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold'>
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Stack>
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            path={`/dashboard/${link.name}`}
          >
            {link.name}
          </NavItem>
        ))}
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
    >
      <IconButton
        variant='outline'
        onClick={onOpen}
        aria-label='open menu'
        icon={<FiSidebar />}
      />

      {/* <Text fontSize='2xl' ml='8' fontFamily='monospace' fontWeight='bold'>
        Logo
      </Text> */}
    </Flex>
  );
};
