import React from 'react';
import styles from './GamesContainer.module.css';

const GamesContainer = ({ games, handleGameClick }) => {
    return (
        <div className={styles['games-container']}>
            <div className={styles['games-list']}>
                {games.map((game, index) => (
                    <div key={index} onClick={() => handleGameClick(game)}>
                        <span className={styles['game-date']}>{`${game.date} ${game.time}`}</span> <br />
                        {`${game.team1} vs ${game.team2}`} <br />
                        {`ㅤ`}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GamesContainer;
