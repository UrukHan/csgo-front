
import styles from './AgreementModal.module.css';
import React, {useState} from "react";
import axios from "axios";
import config from "../utils/config.json";


const AgreementModal = ({ paymentMethod, onClose }) => {

    const [paymentStatus, setPaymentStatus] = useState('');

    const getSubscribeURL = async () => {
        setPaymentStatus('Отправляется запрос...');

        const authToken = localStorage.getItem('authToken');
        try {
            const response = await axios.post(`${config.authorizationUrl}/api/v1/subscribe`,
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

    const handleOutsideClick = (event) => {
        if (event.target.className === styles['agreement-modal']) {
            onClose();
        }
    };

    const handleSubscribe = async (event) => {
        event.preventDefault();

        if (paymentMethod !== 'mirPay') {
            setPaymentStatus('Выбранный тип оплаты пока не доступен.');
            return;
        }

        const paymentData = await getSubscribeURL();

        if (paymentData && paymentData.url) {
            window.open(paymentData.url, '_self');
        }
    };

    return (
        <div className={styles['agreement-modal']} onClick={handleOutsideClick}>
            <div className={styles['agreement-modal-content']}>
                <h1>Agreement Text</h1>
                {/* Put your agreement text here */}
                <button type="button" onClick={handleSubscribe} className={`${styles['submit-button']}`}>
                    Подписаться
                </button>
                <div className={styles['payment-status']}>
                    <h3>Payment State:</h3>
                    <p>{paymentStatus}</p>
                </div>
            </div>
        </div>
    );
};



export default AgreementModal;


