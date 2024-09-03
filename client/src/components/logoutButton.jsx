import React from 'react';
import { Button, MenuItem } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';
import { useResetRecoilState } from 'recoil';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom.js';
import { logoutUser } from '../services/userService.js';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const resetUser = useResetRecoilState(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logoutUser function to handle the API request
      const response = await logoutUser();

      if (response.success) {
        // Clear cookies on the frontend (in case the backend didn't handle it)
        document.cookie =
          'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie =
          'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie =
          'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Reset the Recoil user state
        resetUser();
        navigate('/auth');

        console.log('Logout successful');
      } else {
        throw new Error('Failed to log out');
        showToast('Error', 'Failed to log out', 'error');
      }
    } catch (error) {
      console.error('Error logging out:', error.message);
      showToast('Error', error.message, 'error');
    }
  };

  return (
    <MenuItem
      //   position={'fixed'}
      //   top={'30px'}
      //   right={'30px'}
      size={'sm'}
      onClick={handleLogout}
    >
      {/* <FiLogOut size={20} /> */}
      Logout
    </MenuItem>
  );
};

export default LogoutButton;
