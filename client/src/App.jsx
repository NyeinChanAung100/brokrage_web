import { Container } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Nav from './components/navbar';
import './app.css';
import Voucher from './components/voucher';
import Transactions from './components/Transactions';
import Portfolio from './components/Portfolio';

function App() {
  return (
    <Container
      maxW={'100vw'}
      padding={0}
      className='theoneabove'
      h={'100vh'}
      // overflow={'visible'}
    >
      <Nav />
      <Routes>
        <Route path='/test' element={<Voucher />} />

        <Route path='/dashboard/*' element={<Dashboard />}>
          <Route path='portfolio' element={<Portfolio />} />
          <Route path='trade' element={<Transactions />} />
          <Route path='*' element={<Portfolio />} />
        </Route>
        {/* <Route path='/voucher' element={<Voucher />}></Route> */}
      </Routes>
    </Container>
  );
}

export default App;
