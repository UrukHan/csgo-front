
import styles from './Reference.module.css';
import SubscriptionModal from "./SubscriptionModal";
import {useTranslation} from "react-i18next";
import React, {useContext} from "react";
import {AccessContext} from "../AccessContext";

function Reference({ stripePromise }) {
    const { t } = useTranslation();

    const { isLoggedIn, setShowLoginModal, setShowSubscribeModal, showSubscribeModal } = useContext(AccessContext);

    const handleButtonClick = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        } else {
            setShowSubscribeModal(true);
        }
    };

    return (
        <div className={styles['container-reference']}>
            <div className={styles['text']}>
                {t('reference-a')}
            </div>
            <div className={styles['text']}>
                {t('reference-b')}
            </div>
            <div className={styles['text']}>
                {t('reference-с')}
            </div>
            <button type="submit" onClick={handleButtonClick} className={`${styles['submit-button']}`} >
                {t('pay')}
            </button>

            {showSubscribeModal && <SubscriptionModal onClose={() => setShowSubscribeModal(false)} stripePromise={stripePromise} />}
        </div>
    );
}

export default Reference;