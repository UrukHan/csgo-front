import React from 'react';
import styles from './GamesContainer.module.css';

const GamesLiveContainer = ({ games, handleGameClick }) => {

    return (
        <div className={styles['games-container']}>
            <div className={styles['games-list']}>
                {games.map((game, index) => (
                    <div key={index} onClick={() => handleGameClick(game)}>
                        <span className={styles['game-live']}></span> <br />
                        {`${game.team1} vs ${game.team2}`} <br />
                        {`ㅤ`}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GamesLiveContainer;
