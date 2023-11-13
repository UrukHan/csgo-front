import React, {useContext, useState, useEffect} from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import axios from 'axios';
import styles from './SubscriptionModal.module.css';
import config from "../utils/config.json";
import mirPay from '../images/logo_mir_pay.png';
import cryptoPay from '../images/cryptoPay.png';
import cardPay from '../images/cardPay.png';
import payPal from '../images/payPal.png';
import AgreementModal from "./AgreementModal";
import CryptoModal from "./CryptoModal";

const SubscriptionModal = ({ onClose, stripePromise }) => {

    const [paymentStatus, setPaymentStatus] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Crypto');
    const [paymentPrice, setPaymentPrice] = useState('18 $');
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [showCryptoModal, setShowCryptoModal] = useState(false);


    const getPaymentMIR = async () => {
        setPaymentStatus('Отправляется запрос...');

        const authToken = localStorage.getItem('authToken');
        try {
            const response = await axios.post(`${config.paymentUrl}/api/v1/payment-mir`,
                {
                    payment_method: paymentMethod
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );
            const paymentData = {
                url: response.data.url,
                paymentStatus: response.data.paymentStatus,
                date: response.data.date
            };
            setPaymentStatus('Запрос на оплату успешно сформирован!');
            return paymentData;
        } catch (error) {
            console.error('Ошибка при получении ссылки на оплату:', error);
            setPaymentStatus('Ошибка формирования запроса оплаты.');
            return null;
        }
    };

    const getPaymentStripe = async () => {
        setPaymentStatus('Отправляется запрос на оплату');

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
            console.error('Ошибка при получении ссылки на оплату через Stripe:', error);
            setPaymentStatus('Ошибка формирования запроса на оплату через Stripe.');
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
                                setPaymentStatus('Ошибка при перенаправлении на Stripe Checkout.');
                            }
                        });
                });
            }
            return;
        } else if (paymentMethod === 'MIR') {
            const paymentData = await getPaymentMIR();

            if (paymentData && paymentData.url) {
                window.open(paymentData.url, '_self');
            }
            return;
        } else if (paymentMethod === 'Crypto') {
            setShowCryptoModal(true);
        } else {
            setPaymentStatus('Выбранный тип оплаты пока не доступен.');
        }
    };


    const handleSubscribeInfo = async (event) => {
        if (paymentMethod === 'MIR') {
            setShowAgreementModal(true);
        } else if (paymentMethod === 'Crypto') {
            setShowCryptoModal(true);
        } else {
            setPaymentStatus('Выбранный тип оплаты пока не доступен.');
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
                    <p>Выберите метод оплаты: {paymentMethod}</p>
                </div>
                <div className={styles['payment-metod']}>

                    <button
                        style={{backgroundImage: `url(${cryptoPay})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentMethod === 'Crypto' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentMethodChange('Crypto', '18 $')}
                    />
                    <button
                        style={{backgroundImage: `url(${cardPay})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentMethod === 'Stripe' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentMethodChange('Stripe', '18 $')}
                    />
                    <button
                        style={{backgroundImage: `url(${mirPay})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentMethod === 'MIR' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentMethodChange('MIR', '900 р.')}
                    />
                    <button
                        style={{backgroundImage: `url(${payPal})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentMethod === 'PayPal' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentMethodChange('payPal', '18 $')}
                    />

                </div>

                <div className={styles['payment-info']}>
                    <p>Месячный доступ. Цена: {paymentPrice}</p>
                </div>

                <button type="submit" onClick={handlePayment} className={`${styles['submit-button']}`} >
                    Оплатить
                </button>
                <button type="button" onClick={handleSubscribeInfo} className={`${styles['submit-button']}`} >
                    Подписаться
                </button>
                <div className={styles['payment-text']}>
                    <p>Бесплатный доступ на 2 дня, при оформлении подписки</p>
                </div>
                <div className={styles['payment-status']}>
                    <h3>Payment State:</h3>
                    <p>{paymentStatus}</p>
                </div>
                {showAgreementModal && <AgreementModal paymentMethod={paymentMethod} onClose={() => setShowAgreementModal(false)} />}
                {showCryptoModal && <CryptoModal onClose={() => setShowCryptoModal(false)} onCloseParent={onClose} />}
            </div>
        </div>
    );
};

export default SubscriptionModal;
