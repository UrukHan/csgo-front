
import styles from './CryptoModal.module.css';
import React, {useState, useEffect, useContext} from "react";
import polygonUsdt from "../images/usdt-polygon.png";
import binanceUsdt from "../images/usdt-binance.png";
import solanaUsdt from "../images/usdt-solana.png";
import polygonUsdc from "../images/usdc-polygon.png";
import binanceUsdc from "../images/usdc-binance.png";
import solanaUsdc from "../images/usdc-solana.png";
import usePaymentMethods from './PaymentMethods';
import {AccessContext} from "../AccessContext";
import config from "../utils/config.json";
import {useTranslation} from "react-i18next";

const CryptoModalPay = ({ onClose, onCloseParent }) => {

    const { t } = useTranslation();
    const isProd = window.REACT_APP_PROD === 'true';

    const [paymentCrypto, setPaymentCrypto] = useState('USDT polygon');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [cryptoAddress, setCryptoAddress] = useState(config.contractPolygon);
    const { isSubscribed, checkTokenValidity, transactionsUpdated } = useContext(AccessContext);
    const { evmPayment, solanaPayment } = usePaymentMethods(setPaymentStatus, paymentCrypto, transactionsUpdated, onClose, onCloseParent);
    const handlePaymentCryptoChange = (newMethod) => {
        setPaymentCrypto(newMethod);
    };

    useEffect(() => {
        let newAddress = '0x0...';
        if(paymentCrypto === 'USDT polygon' || paymentCrypto === 'USDC polygon'){
            newAddress = isProd ? config.contractPolygon : config.contractMumbai;
        } else if (paymentCrypto === 'USDT binance' || paymentCrypto === 'USDC binance'){
            newAddress = isProd ? config.contractBinance : config.contractBinanceTest;
        }  else if (paymentCrypto === 'USDT solana' || paymentCrypto === 'USDC solana'){
            newAddress = '0xSOL';
        }
        setCryptoAddress(newAddress);
    }, [paymentCrypto]);

    const handleOutsideClick = (event) => {
        if (event.target.className === styles['crypto-modal']) {
            onClose();
        }
    };

    const handlePaymentCrypto = async (event) => {
        event.preventDefault();

        const authToken = localStorage.getItem('authToken');
        const isTokenValid = await checkTokenValidity(authToken);

        if (!isTokenValid) {
            setPaymentStatus(t('status-f'));
            return;
        }
        console.log("isSubscribed: ", isSubscribed)

        if (isSubscribed) {
            setPaymentStatus(t('status-g'));
        } else if (paymentCrypto.includes('solana')) {
            solanaPayment();
        } else {
            await evmPayment();
        }
    };

    return (
        <div className={styles['crypto-modal']} onClick={handleOutsideClick}>
            <div className={styles['crypto-modal-content']}>
                <div className={styles['crypto-title']}>
                    <p> {paymentCrypto} {t('smart-contract')} </p>
                </div>
                <div className={styles['crypto-address']}>
                    <p> {cryptoAddress} </p>
                </div>
                <div className={styles['payment-metod']}>
                    <button
                        style={{backgroundImage: `url(${polygonUsdt})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentCrypto === 'USDT polygon' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentCryptoChange('USDT polygon')}
                    />
                    <button
                        style={{backgroundImage: `url(${binanceUsdt})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentCrypto === 'USDT binance' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentCryptoChange('USDT binance')}
                    />
                    <button
                        style={{backgroundImage: `url(${solanaUsdt})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentCrypto === 'USDT solana' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentCryptoChange('USDT solana')}
                    />
                </div>
                <div className={styles['payment-metod']}>
                    <button
                        style={{backgroundImage: `url(${polygonUsdc})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentCrypto === 'USDC polygon' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentCryptoChange('USDC polygon')}
                    />
                    <button
                        style={{backgroundImage: `url(${binanceUsdc})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentCrypto === 'USDC binance' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentCryptoChange('USDC binance')}
                    />
                    <button
                        style={{backgroundImage: `url(${solanaUsdc})`}}
                        className={`${styles.logo} ${styles.transparentButton} ${paymentCrypto === 'USDC solana' ? styles.activePayment : ''}`}
                        onClick={() => handlePaymentCryptoChange('USDC solana')}
                    />
                </div>
                <div className={styles['crypto-text']}>
                    <p> {t('pay-info-crypto')} </p>
                </div>
                <div className={styles['payment-buttons']}>
                    <button type="submit" onClick={handlePaymentCrypto} className={`${styles['submit-button']}`} >
                        {t('pay')}
                    </button>
                </div>
                <div className={styles['payment-status']}>
                    <h3>{t('pay-status')}</h3>
                    <p>{paymentStatus}</p>
                </div>
            </div>
        </div>
    );
};



export default CryptoModalPay;


