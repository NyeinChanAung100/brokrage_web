import { Container } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Nav from './components/navbar';
import './app.css';
import Voucher from './components/voucher';
import Transactions from './components/Transactions';

function App() {
  return (
    <Container
      maxW={'100vw'}
      padding={0}
      className='theoneabove'
      // overflow={'visible'}
    >
      <Nav />
      <Routes>
        <Route path='/Dashboard/*' element={<Dashboard />}>
          <Route path='voucher' element={<Voucher />} />
          <Route path='transactions' element={<Transactions />} />
          <Route path='*' element={<Voucher />} />
        </Route>
        {/* <Route path='/voucher' element={<Voucher />}></Route> */}
      </Routes>
    </Container>
  );
}

export default App;
