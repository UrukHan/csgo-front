import React from 'react';
import styles from './HomePage.module.css';
import dotaImageFirst from '../images/dota.png';
import csgoImageFirst from '../images/csgo.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomePage() {
    const { i18n } = useTranslation();
    const { t } = useTranslation();

    React.useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const refId = queryParams.get('ref');
        if (refId) {
            localStorage.setItem('referralId', refId);
        }
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <div className={styles['page']}>
            <div className={styles['language-container']}>
                <div className={styles['language-subcontainer']}>
                    <button className={styles['language-button']} onClick={() => changeLanguage('en')}>English</button>
                    <button className={styles['language-button']} onClick={() => changeLanguage('ch')}>中國人</button>
                    <button className={styles['language-button']} onClick={() => changeLanguage('ru')}>Русский</button>
                    <button className={styles['language-button']} onClick={() => changeLanguage('fr')}>Français</button>
                    <button className={styles['language-button']} onClick={() => changeLanguage('ar')}>العربية</button>
                </div>
                <div className={styles['language-subcontainer']}>
                    <button className={styles['language-button']} onClick={() => changeLanguage('es')}>Español</button>
                    <button className={styles['language-button']} onClick={() => changeLanguage('ge')}>Deutsch</button>
                    <button className={styles['language-button']} onClick={() => changeLanguage('in')}>हिन्दी</button>
                    <button className={styles['language-button']} onClick={() => changeLanguage('pg')}>Português</button>
                    <button className={styles['language-button']} onClick={() => changeLanguage('jp')}>日本語</button>
                </div>
            </div>
            <div className={styles['home-container']}>
                <div className={styles['home-right']}>
                    <div className={styles['general-text']}>{t('name')}</div>
                    <div className={styles['description-text']}>{t('description')}</div>
                    <Link to="/line" className={styles['transparent-button']}>
                        CSGO
                    </Link>
                    <img src={csgoImageFirst} alt="CS:GO" className={styles['csgo-general-image']} />
                </div>
                <div className={styles['home-left']}>

                    <img src={dotaImageFirst} alt="Dota" className={styles['dota-general-image']} />
                    <button className={styles['transparent-button']}>
                        DOTA
                    </button>
                    <div className={styles['general-text']}>{t('indication')}</div>
                </div>

            </div>
            <div className={styles['info']}>
                {t('contacts')}
            </div>
        </div>
    );
}

export default HomePage;