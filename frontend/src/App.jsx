import React from 'react'
import { Routes, Route} from 'react-router-dom'

import CartPage from "./pages/PaymentManagement/Cart/CartPage";

import CreatePayments from './pages/PaymentManagement/Payment/CreatePayments';
import DeletePayment from './pages/PaymentManagement/Payment/DeletePayment';
import EditPayment from './pages/PaymentManagement/Payment/EditPayment';
import PaymentDashboard from './pages/PaymentManagement/Payment/PaymentDashbord';
import ShowPayment from './pages/PaymentManagement/Payment/ShowPayment';

import CreateExpenses from './pages/PaymentManagement/Payment/CreateExpenses';
import DeleteExpense from './pages/PaymentManagement/Payment/DeleteExpense';
import EditExpense from './pages/PaymentManagement/Payment/EditExpense';
import ShowExpense from './pages/PaymentManagement/Payment/ShowExpense';
import ExpenseDashboard from './pages/PaymentManagement/Payment/ExpenseDashbord';
import NetProfit from './pages/PaymentManagement/Payment/NetProfit';

const App = () => {
  return (
    <Routes>
     <Route path="/cart" element={<CartPage />} />

     <Route path='/payments' element={<PaymentDashboard />} />
     <Route path='/payments/create' element={<CreatePayments/>} />
     <Route path='/payments/details/:id' element={<ShowPayment />} />
     <Route path='/payments/edit/:id' element={<EditPayment />} />
     <Route path='/payments/delete/:id' element={<DeletePayment />} />

     <Route path='/expenses/create' element={<CreateExpenses />} />
     <Route path='/expenses/delete/:id' element={<DeleteExpense />} />
     <Route path='/expenses/edit/:id' element={<EditExpense />} />
     <Route path='/expenses/details/:id' element={<ShowExpense />} />
     <Route path='/' element={<ExpenseDashboard />} />
     <Route path='/profits' element={<NetProfit />} />
    </Routes>
  )
}

export default App