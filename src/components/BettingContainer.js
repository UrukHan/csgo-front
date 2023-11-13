import React, { useEffect } from 'react';
import styles from './BettingContainer.module.css';
import BetContainer from './BetContainer';
import BBLogo from '../images/BBlogo.png';
import LigaLogo from '../images/Liga.png';
import xBET from '../images/1xBET.png';

const BettingContainer = ({ firstTeam, secondTeam, betBoomData, resetBetBoomData, defaultBetData, dataMark, defaultMark }) => {
    useEffect(() => {
        if (betBoomData === null) {
            resetBetBoomData();
        }
    }, [betBoomData, resetBetBoomData]);

    return (
        <div className={styles['bettings-container']}>
            <div className={styles['bet-teams-container']}>
                <div className={styles['bet-auto']}>{'AUTO'}</div>
                <div className={styles['bet-team']}>{firstTeam === '' ? '-' : firstTeam}</div>
                <div className={styles['bet-team']}>{secondTeam === '' ? '-' : secondTeam}</div>
            </div>
            <div className={styles['bet-maps-container']}>
                <div className={styles['bet-maps']}></div>
                <div className={styles['bet-map']}>{"MAP 1"}</div>
                <div className={styles['bet-map']}>{"MAP 2"}</div>
                <div className={styles['bet-map']}>{"MAP 3"}</div>
            </div>
            {betBoomData !== null && (
                <>
                    <BetContainer logo={BBLogo} data={{ ...betBoomData }} dataMark={{ ...dataMark }} />
                    <BetContainer logo={LigaLogo} data={{ ...defaultBetData }} dataMark={{ ...defaultMark }}/>
                    <BetContainer logo={xBET} data={{ ...defaultBetData }} dataMark={{ ...defaultMark }}/>
                </>
            )}
        </div>
    );
};

export default BettingContainer;