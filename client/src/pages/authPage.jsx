import SignupCard from '../components/signupCard';
import LoginCard from '../components/LoginCard';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';

function AuthPage() {
  const authScreenState = useRecoilValue(authScreenAtom);

  return <>{authScreenState === 'login' ? <LoginCard /> : <SignupCard />}</>;
}

export default AuthPage;
