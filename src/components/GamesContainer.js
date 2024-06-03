import React from 'react';
import styles from './GamesContainer.module.css';
import {useTranslation} from "react-i18next";

const GamesContainer = ({ games, handleGameClick }) => {

    const { t } = useTranslation();

    return (
        <div className={styles['games-container']}>
            <div className={styles['games-info-container']}>
                <div className={styles['games-info']}>{t('games-info')}</div>
            </div>
            <div className={styles['games-list']}>
                {games.map((game, index) => (
                    <div key={index} onClick={() => handleGameClick(game)}>
                        <span className={styles['game-upcoming']}>{`${game.date} ${game.time}`}</span> <br />
                        {`${game.team1} vs ${game.team2}`} <br />
                        {`ㅤ`}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GamesContainer;
