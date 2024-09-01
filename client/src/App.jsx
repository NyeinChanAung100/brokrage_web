import { Container } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Nav from './components/navbar';
import './app.css';
import Voucher from './components/voucher';
import Detailed from './components/Detailed';
import Portfolio from './components/Portfolio';
import DepositForm from './pages/Testing';
import MarketOverview from './components/MarketOverview';
import WatchList from './components/WatchList';
import DetailedAccordion from './components/DetailedAccordion';
import Home from './pages/Home';
import Trade from './components/trade';
import BuyPage from './components/BuyPage';
import SellPage from './components/SellPage';
import MyComponent from './OneMoreTest';

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
        <Route path='/home' element={<Home />} />
        <Route path='/testing' element={<MyComponent />} />
        <Route path='/purchase' element={<BuyPage />} />
        <Route path='/sell' element={<SellPage />} />

        <Route path='/dashboard/*' element={<Dashboard />}>
          <Route path='portfolio' element={<Portfolio />} />
          <Route path='detailedanalysis/:id' element={<Detailed />} />
          <Route path='marketoverview' element={<MarketOverview />} />
          <Route path='watchlist' element={<WatchList />} />
          {/* <Route path='trade' element={<Trade />} /> */}

          <Route path='*' element={<Portfolio />} />
        </Route>
        {/* <Route path='/voucher' element={<Voucher />}></Route> */}
      </Routes>
    </Container>
  );
}

export default App;
