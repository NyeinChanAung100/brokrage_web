import { Container } from '@chakra-ui/react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
// import Trade from './components/trade';
import BuyPage from './components/BuyPage';
import SellPage from './components/SellPage';
import MyComponent from './OneMoreTest';
import AuthPage from './pages/authPage';
import { useRecoilValue } from 'recoil';

// import LogoutButton from './components/logoutButton';
import userAtom from './atoms/userAtom.js';
import TradePage from './components/TradePage.jsx';
import DepositAssets from './components/DepositAssets.jsx';
import DepositMoney from './components/DepositMoney.jsx';
// import LoginCard from './components/LoginCard';

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Container
      maxW={'100vw'}
      padding={0}
      className='theoneabove'
      h={'100vh'}
      // overflow={'visible'}
    >
      <Nav />
      {/* <LogoutButton /> */}
      <Routes>
        <Route path='/' element={<Home />} />

        {/* Auth Route */}
        <Route
          path='/auth'
          element={user ? <Navigate to='/' /> : <AuthPage />}
        />

        {/* Test Route */}
        <Route path='/test' element={<MyComponent />} />

        {/* Purchase and Sell Routes */}
        <Route path='/voucher' element={<Voucher />} />

        {/* Dashboard Route */}
        <Route
          path='/dashboard/*'
          element={user ? <Dashboard /> : <Navigate to='/auth' />}
        >
          <Route path='trade' element={<TradePage />} />
          <Route path='portfolio' element={<Portfolio />} />
          <Route path='detailedanalysis/:id' element={<Detailed />} />
          <Route path='marketoverview' element={<MarketOverview />} />
          <Route path='watchlist' element={<WatchList />} />
          <Route path='depositassets' element={<DepositAssets />} />
          <Route path='depositmoney' element={<DepositMoney />} />
          <Route path='*' element={<Portfolio />} />
        </Route>
        {/* <Route path='/voucher' element={<Voucher />}></Route> */}
      </Routes>
    </Container>
  );
}

export default App;
