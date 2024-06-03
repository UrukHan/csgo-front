import React, { useState, useContext } from 'react';
import axios from 'axios';
import styles from './LoginForm.module.css';
import { AccessContext } from "../AccessContext";
import config from "../utils/config.json";
import {useTranslation} from "react-i18next";

const LoginForm = ({ onClose }) => {

    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
    const [isLoginActive, setIsLoginActive] = useState(true);

    const { onLogin, onSignIn } = useContext(AccessContext);

    const handleOutsideClick = (event) => {
        if (event.target.className === styles['login-modal']) {
            onClose();
        }
    };

    const handleLogin = (event) => {
        event.preventDefault();
        handleSendData();
    };

    const handleSignInClick = (event) => {
        event.preventDefault();
        setIsLoginActive(false);
        setShowRepeatPassword(true);
    };

    const handleLoginClick = (event) => {
        event.preventDefault();
        setIsLoginActive(true);
        setShowRepeatPassword(false);
    };

    const handleSendData = async () => {
        const referralId = localStorage.getItem('referralId') || '';
        const url = showRepeatPassword ? `${config.authorizationUrl}/api/v1/register` : `${config.authorizationUrl}/api/v1/login`;
        const action = showRepeatPassword ? onSignIn : onLogin;
        try {
            const data = showRepeatPassword ? { email, password, referralId } : { email, password };
            const response = await axios.post(url, data);

            if (response.status === 200) {
                if (showRepeatPassword) {
                    // after successful registration we await confirmation
                    setAwaitingConfirmation(true);
                    setError(response.data.message);
                } else {
                    action(response.data.token);
                    if (rememberMe) {
                        localStorage.setItem('authToken', response.data.token);
                    }
                    onClose();
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(`Error ${showRepeatPassword ? "registration" : "login"}: ${error.response.data.error}`);
            } else {
                setError(`Error ${showRepeatPassword ? "registration" : "login"}: ${error.message}`);
            }
        }
    };

    const handleResendCode = async () => {
        try {
            const response = await axios.post(`${config.authorizationUrl}/api/v1/resend_code`, { email });
            if (response.status === 200) {
                setError(t('error-a'));
            }
        } catch (error) {
            setError(t('error-b') + error.message);
        }
    };

    const handleConfirm = async (event) => {
        event.preventDefault();

        if (verificationCode === "") {
            setError(t('error-c'));
            return;
        }

        try {
            const response = await axios.post(`${config.authorizationUrl}/api/v1/confirm`, { email, code: verificationCode });

            if (response.status === 200) {
                const url =`${config.authorizationUrl}/api/v1/login`;
                const action = onLogin;

                const response = await axios.post(url, { email, password });

                action(response.data.token);
                if (rememberMe) {
                    localStorage.setItem('authToken', response.data.token);
                }
                onClose();
            }
        } catch (error) {
            console.log("RESPONSE", error.response.data)
            if (error.response && error.response.data && error.response.data.error) {
                let errorMessage = `Error: ${error.response.data.error}`;
                if (error.response.data.attempts_left !== undefined) {
                    errorMessage += `. Attempts left: ${error.response.data.attempts_left}`;
                }
                setError(errorMessage);
            } else {
                setError(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div
            className={styles['login-modal']}
            onClick={handleOutsideClick}
        >
            <div className={styles['login-modal-content']}>
                {awaitingConfirmation ? (
                    <form onSubmit={handleConfirm}>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder={t('verify-code')}
                        />
                        <div className={styles['error-message-code']}>{error}</div>
                        <button type="submit" className={`${styles['confirm-button']}`}>
                            {t('confirm')}
                        </button>
                        <div className={styles['confirm-empty']}>{""}</div>
                        <button type="button" onClick={handleResendCode} className={`${styles['confirm-button']}`}>
                            {t('resend-code')}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin}>
                        <div className={styles['login-buttons']}>
                            <button type="button"
                                    onClick={handleSignInClick}
                                    className={`${styles['login-button']} ${!isLoginActive ? styles['login-button-active'] : ''}`}>
                                SIGN IN
                            </button>
                            <button type="button"
                                    onClick={handleLoginClick}
                                    className={`${styles['login-button']} ${isLoginActive ? styles['login-button-active'] : ''}`}>
                                LOGIN
                            </button>
                        </div>
                        <div className={styles['login-empty']}></div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('email')}
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('password')}
                        />
                        {showRepeatPassword && (
                            <input
                                type="password"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                placeholder={t('repeat-password')}
                            />
                        )}
                        {!showRepeatPassword && (
                            <div className={styles['checkbox-container']}>
                                <div className={styles['checkbox-box']} onClick={() => setRememberMe(!rememberMe)}>
                                    {rememberMe && <div className={styles.checkmark}>✓</div>}
                                </div>
                                <span className={styles['checkbox-label']}>{t('remember-me')}</span>
                            </div>
                        )}
                        <div className={styles['error-message']}>{error}</div>
                        <button type="button" onClick={handleSendData} className={`${styles['send-button']}`}>
                            {t('send-data')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
