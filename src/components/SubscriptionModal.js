import React, { useState } from 'react';

import axios from 'axios';
import styles from './SubscriptionModal.module.css';
import config from "../utils/config.json";
import cryptoPay from '../images/cryptoPay.png';
import cardPay from '../images/cardPay.png';
import payPal from '../images/payPal.png';
import CryptoModalPay from "./CryptoModalPay";
import CryptoModalSubscribe from "./CryptoModalSubscribe";
import { useTranslation } from 'react-i18next';

const SubscriptionModal = ({ onClose, stripePromise }) => {

    const [paymentStatus, setPaymentStatus] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [paymentPrice, setPaymentPrice] = useState('18 $');
    const [showPayCryptoModal, setShowPayCryptoModal] = useState(false);
    const [showSubscribeCryptoModal, setShowSubscribeCryptoModal] = useState(false);
    const { t } = useTranslation();

    const getPaymentStripe = async () => {
        setPaymentStatus(t('status-a'));

        const authToken = localStorage.getItem('authToken');
        try {
            const response = await axios.post(`${config.paymentUrl}/api/v1/payment-stripe`, {}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            const checkoutURL = response.data.sessionURL;
            window.location.href = checkoutURL;

        } catch (error) {
            console.error('Error when receiving payment link via Stripe:', error);
            setPaymentStatus(t('status-b'));
            return null;
        }
    };

    const getPaymentPayPal = async () => {
        setPaymentStatus('Sending a payment request to PayPal');

        const authToken = localStorage.getItem('authToken');
        try {
            const response = await axios.post(`${config.paymentUrl}/api/v1/payment-paypal`, {}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log("response.data")
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error('Error with PayPal payment:', error);
            setPaymentStatus(t('status-c'));
            return null;
        }
    };

    const getSubscribeStripe = async () => {
        setPaymentStatus(t('status-a'));

        const authToken = localStorage.getItem('authToken');
        try {
            const response = await axios.post(`${config.paymentUrl}/api/v1/subscribe-stripe`, {}, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            const checkoutURL = response.data.sessionURL;
            window.location.href = checkoutURL;

        } catch (error) {
            console.error('Error when receiving payment link via Stripe:', error);
            setPaymentStatus(t('status-b'));
            return null;
        }
    };

    const handleOutsideClick = (event) => {
        if (event.target.className === styles['subscription-modal']) {
            onClose();
        }
    };

    const handlePayment = async (event) => {
        event.preventDefault();

        if (paymentMethod === 'Stripe') {
            const paymentData = await getPaymentStripe();
            if (paymentData && paymentData.sessionId) {
                stripePromise.then(stripe => {
                    stripe.redirectToCheckout({ sessionId: paymentData.sessionId })
                        .then((result) => {
                            if (result.error) {
                                console.error('Stripe.js error:', result.error.message);
                                setPaymentStatus(t('status-d'));
                            }
                        });
                });
            }
            return;
        } else if (paymentMethod === 'Crypto') {
            setShowPayCryptoModal(true);
        } else if (paymentMethod === 'PayPal') {
            const paymentData = await getPaymentPayPal();
            if (paymentData && paymentData.paypalUrl) {
                window.location.href = paymentData.paypalUrl;
            }
        } else {
            setPaymentStatus(t('status-e'));
        }
    };


    const handleSubscribe = async (event) => {
        event.preventDefault();

        if (paymentMethod === 'Stripe') {
            const paymentData = await getSubscribeStripe();

            if (paymentData && paymentData.sessionId) {
                stripePromise.then(stripe => {
                    stripe.redirectToCheckout({ sessionId: paymentData.sessionId })
                        .then((result) => {
                            if (result.error) {
                                console.error('Stripe.js error:', result.error.message);
                                setPaymentStatus(t('status-d'));
                            }
                        });
                });
            }
            return;
        } else if (paymentMethod === 'Crypto') {
            setShowSubscribeCryptoModal(true);
        } else {
            setPaymentStatus(t('status-e'));
        }

    };

    const handlePaymentMethodChange = (newMethod, price) => {
        setPaymentMethod(newMethod);
        setPaymentPrice(price);
    };

    return (
        <div className={styles['subscription-modal']} onClick={handleOutsideClick}>
            <div className={styles['subscription-modal-content']}>
                <div className={styles['payment-title']}>
                    <p>{t('payMethod')} {paymentMethod}</p>
                </div>
                <div className={styles['payment-metod']}>
                    <button
                        style={{backgroundImage: `url(${cardPay})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentMethod === 'Stripe' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentMethodChange('Stripe', '18 $')}
                    />
                    <button
                        style={{backgroundImage: `url(${payPal})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentMethod === 'PayPal' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentMethodChange('PayPal', '18 $')}
                    />
                    <button
                        style={{backgroundImage: `url(${cryptoPay})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentMethod === 'Crypto' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentMethodChange('Crypto', '15 $')}
                    />
                </div>
                <div className={styles['payment-info']}>
                    <p>{t('price')} {paymentPrice}</p>
                </div>

                <button type="submit" onClick={handlePayment} className={`${styles['submit-button']}`} >
                    {t('pay')}
                </button>
                <button type="button" onClick={handleSubscribe} className={`${styles['submit-button']}`} >
                    {t('subscribe')}
                </button>
                <div className={styles['payment-text']}>
                    <p>{t('promotion')}</p>
                </div>
                <div className={styles['payment-status']}>
                    <h3>Payment State:</h3>
                    <p>{paymentStatus}</p>
                </div>
                {showPayCryptoModal && <CryptoModalPay onClose={() => setShowPayCryptoModal(false)} onCloseParent={onClose} />}
                {showSubscribeCryptoModal && <CryptoModalSubscribe onClose={() => setShowSubscribeCryptoModal(false)} onCloseParent={onClose} />}
            </div>
        </div>
    );
};

export default SubscriptionModal;
