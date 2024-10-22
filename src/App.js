import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import './App.css';
import PrintOptions from './pages/PrintOptions';
import PrintDetails from './pages/PrintDetails';
import MyPrintingJobs from './pages/MyPrintingJobs';
import CustomQuote from './pages/CustomQuote';
import Stores from './pages/Stores';
import StoreLogin from './pages/StoreLogin';
import Dashboard from './pages/HeadOffice/Dashboard';
import HeadOfficePrintDetails from './pages/HeadOffice/HeadOfficePrintDetails';
import HeadOfficePricing from './pages/HeadOffice/HeadOfficePricing';
import NewService from './pages/HeadOffice/NewService';
import HeadOfficeMyPricing from './pages/HeadOffice/HeadOfficeMyPricing';
import RegisterPrintShop from './pages/RegisterPrintShop';
import ForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './firebase/PrivateRoute';
import HeadOfficeChangeMyPricing from './pages/HeadOffice/HeadOfficeChangeMyPricing';
import HeadOfficePastJobs from './pages/HeadOffice/HeadOfficePastJobs';
import CompareShops from './pages/CompareShops';
import VerifyPayment from './pages/VerifyPayment';
import VerifyOnlinePayment from './pages/VerifyOnlinePayment';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/:storeName?" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/register-print-shop" element={<RegisterPrintShop />} />
        <Route path="/print-options" element={<PrintOptions />} />
        <Route path="/print-details" element={<PrintDetails />} />
        <Route path="/printing-jobs" element={<MyPrintingJobs />} />
        <Route path="/custom-quote" element={<CustomQuote />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/shop-login" element={<StoreLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/compare-shops' element={<CompareShops />} />
        <Route path="/verify-payment" element={<VerifyPayment />} />
        <Route path="/verify-online-payment" element={<VerifyOnlinePayment />} />



        {/* Protect admin routes with PrivateRoute */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/print-details"
          element={
            <PrivateRoute>
              <HeadOfficePrintDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/pricing"
          element={
            <PrivateRoute>
              <HeadOfficePricing />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/new-service"
          element={
            <PrivateRoute>
              <NewService />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/my-pricing"
          element={
            <PrivateRoute>
              <HeadOfficeMyPricing />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/change-my-pricing"
          element={
            <PrivateRoute>
              <HeadOfficeChangeMyPricing />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/closed-jobs"
          element={
            <PrivateRoute>
              <HeadOfficePastJobs />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
