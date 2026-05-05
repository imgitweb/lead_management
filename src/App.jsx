import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/UI/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';
import Analytics from './pages/Analytics';
import CustomReports from './pages/CustomReports';
import DebugDashboard from './pages/DebugDashboard';
import Earnings from './pages/Earnings';
import Transactions from './pages/Transactions';
import PaymentSettings from './pages/PaymentSettings';
import ResourceCenter from './pages/ResourceCenter';
import AppAdsTxt from './pages/AppAdsTxt';
import ReferralProgram from './pages/ReferralProgram';
import Profile from './pages/Profile';
import GeneralSettings from './pages/GeneralSettings';
import Users from './pages/Users';
import Invoices from './pages/Invoices';
import Login from './pages/Login';
import KanbanBoard from './pages/KanbanBoard';
import Calendar from './pages/Calendar';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import DataTables from './pages/DataTables';
import ChartsGallery from './pages/ChartsGallery';
import NotFound from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';
import useScrollToTop from './hooks/useScrollToTop';
import LeadsPage from './pages/leads/LeadsPage';
import InquiriesPage from './pages/leads/InquiriesPage';
import LeadDetailsPage from './pages/leads/LeadDetailsPage';
import InquiryDetailsPage from './pages/leads/InquiryDetailsPage';
import AddLeadPage from './pages/AddLeadPage';
import SupportTicketPage from './pages/leads/SupportTicketPage';
import FeaturePage from './pages/inbox/FeaturePage';
import WhatsAppPage from './pages/inbox/WhatsAppPage';
import FacebookChat from './pages/inbox/FacebookChat';
import WhatsappChat from "./pages/inbox/WhatsappChat";
import InstagramChat from "./pages/inbox/InstagramChat";

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
            <Route index element={<Analytics />} />
             <Route path="leads" element={<LeadsPage />} />
             <Route path="leads/:id" element={<LeadDetailsPage />} />
            <Route path="leads/new" element={<AddLeadPage />} />
             <Route path="inquiries" element={<InquiriesPage />} />
             <Route path="inquiries/:id" element={<InquiryDetailsPage />} />
            <Route path="support/ticket" element={<SupportTicketPage />} />
            <Route path="inbox/whatsapp" element={<WhatsappChat />} />
            <Route path="inbox/instagram" element={<InstagramChat />} />
            <Route path="inbox/facebook" element={<FacebookChat/>}/>
            <Route path="kanban" element={<KanbanBoard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="chat" element={<Chat />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="tables" element={<DataTables />} />
            <Route path="charts" element={<ChartsGallery />} />
            <Route path="reports" element={<CustomReports />} />
           
            <Route path="debug" element={<DebugDashboard />} />
            <Route path="payments/earnings" element={<Earnings />} />
            <Route path="payments/transactions" element={<Transactions />} />
            <Route path="payments/invoices" element={<Invoices />} />
            <Route path="payments/settings" element={<PaymentSettings />} />
            <Route path="resources" element={<ResourceCenter />} />
            <Route path="app-ads" element={<AppAdsTxt />} />
            {/* <Route path="referral" element={<ReferralProgram />} /> */}
            <Route path="referral" element={<ReferralProgram />} />

            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<GeneralSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
    </AuthProvider>
  );
}

export default App;