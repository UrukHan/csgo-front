import React, { useContext, useEffect, useState } from 'react';
import { AccessContext } from "../AccessContext";
import styles from './Header.module.css';
import logoImage from '../images/logo.png';
import settingsImage from '../images/settings.png';
import loginImage from '../images/login_csgo.png';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const [showLogo, setShowLogo] = useState(true);
    const { isLoggedIn, onLogin, showLoginModal, setShowLoginModal } = useContext(AccessContext);
    const { t } = useTranslation();

    const handleLoginClick = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setShowLogo((prevShowLogo) => !prevShowLogo);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className={styles['App-header']}>
            <div className={styles['header-buttons']}>
                <Link to="/" className={styles['header-button']}>
                    <img src={logoImage} alt="Logo" className={styles.logo} />
                </Link>
                <Link to="/line" className={styles['header-button']}>{t('line')}</Link>
                <Link to="/live" className={styles['header-button']}>{t('live')}</Link>
                {isLoggedIn ? (
                    <Link to="/settings" className={styles['header-button']}>
                        {showLogo ? (
                            <img src={settingsImage} alt={t('settings')} className={styles.logo} />
                        ) : (
                            <span>{t('settings')}</span>
                        )}
                    </Link>
                ) : (
                    <button
                        className={styles['header-button']}
                        onClick={handleLoginClick}
                    >
                        {showLogo ? (
                            <img src={loginImage} alt={t('login')} className={styles.logo} />
                        ) : (
                            'LOGIN'
                        )}
                    </button>
                )}
            </div>
            {showLoginModal && (
                <LoginForm
                    onClose={handleCloseModal}
                    onLogin={onLogin}
                />
            )}
        </header>
    );
};

export default Header;
