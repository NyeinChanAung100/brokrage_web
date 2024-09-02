import { atom } from 'recoil';
import { getCookie } from '../utils/cookieUtil';

const userAtom = atom({
  key: 'userAtom',
  default: (() => {
    const userId = getCookie('user_id');
    const username = getCookie('username');
    const email = getCookie('email');

    console.log({ userId, username, email });

    if (userId && username && email) {
      return {
        id: userId,
        username: username,
        email: email,
      };
    }

    return null;
  })(),
});

export default userAtom;
