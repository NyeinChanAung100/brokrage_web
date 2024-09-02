'use client';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';
import { loginUser } from '../services/userService';
import { setCookie } from '../utils/cookieUtil';
import { Link } from 'react-router-dom';

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const showToast = useShowToast();

  const handleLogin = async () => {
    try {
      const data = await loginUser(inputs);

      // Check for errors in the response
      if (data.error) {
        throw new Error(data.error || 'Failed to login user');
      }

      // Store user data in cookies
      setCookie('user_id', data.id); // Use the 'id' directly from data
      setCookie('username', data.username); // Use the 'username' directly from data
      setCookie('email', data.email); // Use the 'email' directly from data

      // Optionally, set user in state
      setUser({ id: data.id, username: data.username, email: data.email });

      console.log('User Logged in successfully');
    } catch (error) {
      console.error('Error Log in user:', error.message);
      showToast('Error', error.message, 'error'); // Display an error message
    }
  };

  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
          <Link
            to={'/'}
            style={{
              color: isHovered ? 'darkviolet' : 'blueviolet',
              textDecoration: isHovered ? 'underline' : 'none',
              fontWeight: isHovered ? 700 : 600,
              fontSize: '18px',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            go to home
          </Link>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}
          w={{
            base: 'full',
            sm: '400px',
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type='text'
                value={inputs.username}
                onChange={(e) =>
                  setInputs((prevInputs) => ({
                    ...prevInputs,
                    username: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs((prevInputs) => ({
                      ...prevInputs,
                      password: e.target.value,
                    }))
                  }
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText='Logging in'
                size='lg'
                bg={useColorModeValue('gray.600', 'gray.700')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('gray.700', 'gray.800'),
                }}
                onClick={handleLogin}
                isLoading={loading}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account?{' '}
                <Link
                  style={{ color: 'blueviolet', fontWeight: 500 }}
                  onClick={() => setAuthScreen('signup')}
                >
                  Signup
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
