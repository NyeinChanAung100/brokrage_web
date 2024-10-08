'use client';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
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
import useShowToast from '../hooks/useShowToast.js';
import userAtom from '../atoms/userAtom.js';
import { registerUser } from '../services/userService.js';
import { setCookie } from '../utils/cookieUtil.js';
import { Link } from 'react-router-dom';

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
  });
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  //   const handleRegister = async () => {
  //     try {
  //       const response = await registerUser(inputs);

  //       if (!response.ok) {
  // If the status code is not in the 200-299 range, throw an error
  //     const errorData = await response.json();
  //     throw new Error(errorData.error || 'Failed to register user');
  //   }

  //   const data = await response.json();

  //   localStorage.setItem('user-brokerage', JSON.stringify(data.user));
  //   setUser(data.user);

  //         console.log('User registered successfully');
  //     } catch (error) {
  //       console.error('Error registering user:', error.message);
  //       showToast('Error', error.message, 'error'); // Display an error message
  //     }
  //   };

  const handleRegister = async () => {
    try {
      const data = await registerUser(inputs);

      // Check for errors in the response
      if (data.error) {
        throw new Error(data.error || 'Failed to register user');
      }

      // Store user data in cookies
      setCookie('user_id', data.user_id); // Use the 'id' directly from data
      setCookie('username', data.username); // Use the 'username' directly from data
      setCookie('email', data.email); // Use the 'email' directly from data

      // Optionally, set user in state
      setUser({ id: data.id, username: data.username, email: data.email });

      console.log('User registered successfully');
    } catch (error) {
      console.error('Error registering user:', error.message);
      showToast('Error', error.message, 'error'); // Display an error message
    }
  };

  //   const handleSignup = async () => {
  //     try {
  //       const res = await fetch('/api/users/signup', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(inputs),
  //       });
  //       const data = await res.json();
  //       console.log(data);
  //       if (data.error) {
  //         showToast('Error', data.error, 'error');
  //         return;
  //       }
  //       localStorage.setItem('user-threads', JSON.stringify(data));
  //       setUser(data);
  //     } catch (error) {
  //       showToast('Error', error, 'error');
  //     }
  //   };

  return (
    <Flex align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
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
            {/* <HStack> */}
            {/* <Box>
                <FormControl isRequired>
                  <FormLabel>Full name</FormLabel>
                  <Input
                  type='text'
                  onChange={(e) =>
                    setInputs({ ...inputs, name: e.target.value })
                  }
                  value={inputs.name}
                  />
                </FormControl>
              </Box> */}
            <Box>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setInputs({ ...inputs, username: e.target.value })
                  }
                  value={inputs.username}
                />
              </FormControl>
            </Box>
            {/* </HStack> */}
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                value={inputs.email}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                  value={inputs.password}
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
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue('gray.600', 'gray.700')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('gray.700', 'gray.800'),
                }}
                onClick={handleRegister}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user?{' '}
                <Link
                  style={{ color: 'blueviolet', fontWeight: 500 }}
                  onClick={() => setAuthScreen('login')}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
