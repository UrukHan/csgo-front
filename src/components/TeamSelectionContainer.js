import React, { useState, useEffect } from 'react';
import styles from './TeamSelectionContainer.module.css';
import TeamSelector from './TeamSelector';
import MyBetsContainer from '../components/MyBetsContainer';
import {useTranslation} from "react-i18next";

const TeamSelectionContainer = ({
                                    options,
                                    handleFirstTeamChange,
                                    handleSecondTeamChange,
                                    firstTeamImage,
                                    firstTeamOption,
                                    handleGetButtonClick,
                                    secondTeamImage,
                                    secondTeamOption,
                                    games,
                                }) => {

    const { t } = useTranslation();
    const [showGamesModal, setShowGamesModal] = useState(false);
    const [showProfit, setShowProfit] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowProfit(prevShowProfit => !prevShowProfit);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleGamesClick = () => {
        setShowGamesModal(true);
    };

    const handleModalBackgroundClick = (event) => {
        const modalContent = document.querySelector(`.${styles['my-bets-modal-content']}`);
        if (modalContent && !modalContent.contains(event.target)) {
            setShowGamesModal(false);
        }
    };

    return (
        <div className={styles['team-selection-container']}>
            <div className={styles['bank-team-container']}>
                <button className={styles['bank-button']} onClick={handleGamesClick}>
                    {showProfit ? (
                        <>
                            <div className={styles['profit-text']}>
                                {t('profit')}
                            </div>
                            <div className={styles['profit-amount']}>{games.bank}</div>
                        </>
                    ) : (
                        <div className={styles['profit-info']}>{t('profit-info')}</div>
                    )}
                </button>
            </div>
            {showGamesModal && (
                <div
                    className={styles['my-bets-modal']}
                    onClick={handleModalBackgroundClick}
                >
                    <div className={styles['bets-bank-container']}>
                        <div className={styles['bets-bank-year']}>
                            <div className={styles['profit-text']}>{t("perYear")}</div>
                            <div className={styles['profit-amount']}>{games.bank_year}</div>
                        </div>
                        <div className={styles['bets-bank-month']}>
                            <div className={styles['profit-text']}>{t("perMonth")}</div>
                            <div className={styles['profit-amount']}>{games.bank_month}</div>
                        </div>
                    </div>
                    <div className={styles['my-bets-modal-content']}>
                        <MyBetsContainer games={games} />
                    </div>
                </div>
            )}
            <TeamSelector
                options={options}
                onChange={handleFirstTeamChange}
                teamClassName={styles['team-container-primary']}
                teamImage={firstTeamImage}
                value={firstTeamOption}
            />
            <div className={styles['get-team-container']}>
                <button
                    className={styles['get-button']}
                    onClick={handleGetButtonClick}
                >
                    GET
                </button>
            </div>
            <TeamSelector
                options={options}
                onChange={handleSecondTeamChange}
                teamClassName={styles['team-container-secondary']}
                teamImage={secondTeamImage}
                value={secondTeamOption}
            />
        </div>
    );
};

export default TeamSelectionContainer;
