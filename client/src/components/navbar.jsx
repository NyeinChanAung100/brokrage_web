'use client';

import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

const Links = ['Home', 'Dashboard', 'Market', 'Help'];

const NavLink = ({ path, children }) => (
  <Box
    as='a'
    px={2}
    py={1}
    rounded='md'
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={path}
    zIndex={1000}
  >
    {children}
  </Box>
);

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg={useColorModeValue('#99bab9', '#000a0a')}
      px={4}
      position={'sticky'}
      top={'0px'}
      boxShadow={'0 4px 6px rgba(0, 0, 0, 0.1)'}
      zIndex={1000}
    >
      <Flex h={16} alignItems='center' justifyContent='space-between'>
        <IconButton
          size='md'
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label='Open Menu'
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems='center'>
          <Box>Logo</Box>
          <HStack as='nav' spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link} path={`/${link.toLowerCase()}`}>
                {link}
              </NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems='center'>
          <Stack direction='row' spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rounded='full'
                variant='link'
                cursor='pointer'
                minW={0}
              >
                <Avatar
                  size='sm'
                  src='https://avatars.dicebear.com/api/male/username.svg'
                />
              </MenuButton>
              <MenuList alignItems='center'>
                <br />
                <Center>
                  <Avatar
                    size='2xl'
                    src='https://avatars.dicebear.com/api/male/username.svg'
                  />
                </Center>
                <br />
                <Center>
                  <Text>Username</Text>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem>Your Servers</MenuItem>
                <MenuItem>Account Settings</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as='nav' spacing={4}>
            {Links.map((link) => (
              <NavLink key={link} path={`/${link.toLowerCase()}`}>
                {link}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
