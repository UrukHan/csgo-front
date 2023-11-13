import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LanguageProvider } from './LanguageContext';
import i18n from './i18n';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51LXRxqEe01UiubRXk8adLZefWv3JilBC71MDBGaJASQbucH6Oj7hssyE2ANUWnKP4yKkUI3PxeP6Jpd1PyM1iMVz004wdblGj7');

i18n.init().then(() => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <LanguageProvider>
                    <App stripePromise={stripePromise} />
                </LanguageProvider>
            </BrowserRouter>
        </React.StrictMode>
    );

    reportWebVitals();
});