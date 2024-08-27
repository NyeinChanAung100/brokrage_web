import { Container } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Nav from './components/navbar';
import './app.css';
import Voucher from './components/voucher';
import Detailed from './components/Detailed';
import Portfolio from './components/Portfolio';
import DepositForm from './pages/Testing';

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
        <Route path='/testing' element={<DepositForm />} />

        <Route path='/dashboard/*' element={<Dashboard />}>
          <Route path='portfolio' element={<Portfolio />} />
          <Route path='detailedanalysis' element={<Detailed />} />
          <Route path='*' element={<Portfolio />} />
        </Route>
        {/* <Route path='/voucher' element={<Voucher />}></Route> */}
      </Routes>
    </Container>
  );
}

export default App;
