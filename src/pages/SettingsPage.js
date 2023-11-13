import React, {useContext, useEffect, useState} from 'react';
import { AccessContext } from "../AccessContext";
import styles from './SettingsPage.module.css';
import SubscriptionModal from "../components/SubscriptionModal";
import CryptoModal from "../components/CryptoModal";
import {useTranslation} from "react-i18next";

function SettingsPage( { stripePromise } ) {
    const [showCryptoModal, setShowCryptoModal] = useState(false);
    const { setShowSubscribeModal, showSubscribeModal, onLogout, subscribeTo, unSubscribe,
        isSubscribed } = useContext(AccessContext);
    const { t } = useTranslation();
    // useEffect(() => {
    //
    // }, []);

    const handlePayButtonClick = async () => {
        setShowSubscribeModal(true);
    };

    const handleUnSubscribeClick = async () => {
        unSubscribe()
    };

    return (
        <div className={styles['page']}>
            <h2>{t("subscribeState")}</h2>
            {isSubscribed
                ? <h3>{t("subscribe")}</h3>
                : <h3>{t("notSubscribe")}</h3>
            }
            <button type="button"
                    onClick={handleUnSubscribeClick}
                    disabled={!isSubscribed}
                    className={styles['setting-button']}
            >
                {t("unsubscribe")}
            </button>
            <p>{t("payTitle")}</p>
            <button type="button"
                    onClick={handlePayButtonClick}
                    className={styles['setting-button']}
            >
                {t("pay")}
            </button>
            <div>
                <h2>{t("subscribeInformation")}</h2>
                <p>
                    {t("subscribeTo")} {subscribeTo || ''}
                </p>
            </div>
            <button type="button"
                    onClick={onLogout}
                    className={styles['logout-button']}
            >
                {t("logout")}
            </button>
            {showSubscribeModal && <SubscriptionModal onClose={() => setShowSubscribeModal(false)} stripePromise={stripePromise} />}
            {showCryptoModal && <CryptoModal onClose={() => setShowCryptoModal(false)} />}
        </div>
    );
}

export default SettingsPage;
