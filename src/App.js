import { Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import styles from './App.module.css';
import { ContextProvider } from './GeneralContext';
import { AccessProvider } from "./AccessContext";
import { AdminProvider } from './AdminContext';

import Header from './components/Header';
import HeaderAdmin from './componentsAdmin/HeaderAdmin';
import HomePage from './pages/HomePage';
import LinePage from './pages/LinePage';
import LivePage from './pages/LivePage';
import ReferralPage from './pages/ReferralPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from "./pages/AdminPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import AdminSubscribersPage from "./pages/AdminSubscribersPage";
import OfertaPage from "./pages/OfertaPage";
import UseAgreementPage from "./pages/UseAgreementPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";

function App( { stripePromise } ) {
    const location = useLocation();
    const isAdminRoute = location.pathname.includes('/admin');

    return (
        <AccessProvider>
            <ContextProvider>
                <AdminProvider>
                    <div className={styles.App}>
                        <div className={styles['App-content']}>
                            {isAdminRoute ? <HeaderAdmin /> : <Header />}
                            <div className={styles['header-background']}></div>
                            <Routes>
                                <Route path="/" element={<HomePage />} index />
                                <Route path="/line" element={<LinePage stripePromise={stripePromise} />} />
                                <Route path="/live" element={<LivePage stripePromise={stripePromise} />} />
                                <Route path="/settings" element={<SettingsPage stripePromise={stripePromise} />} />
                                <Route path="/oferta" element={<OfertaPage />} />
                                <Route path="/use-agreement" element={<UseAgreementPage />} />
                                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                                <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                                <Route path="/referral" element={<ReferralPage />} />
                                <Route path="/admin/*" element={
                                    <Routes>
                                        <Route path="/" element={<AdminPage />} />
                                        <Route path="/users" element={<AdminUsersPage />} />
                                        <Route path="/payments" element={<AdminPaymentsPage />} />
                                        <Route path="/subscribers" element={<AdminSubscribersPage />} />
                                    </Routes>
                                } />
                            </Routes>
                        </div>
                    </div>
                </AdminProvider>
            </ContextProvider>
        </AccessProvider>
    );
}

export default App;
