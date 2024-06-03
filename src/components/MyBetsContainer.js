import styles from "./MyBetsContainer.module.css";
import React from "react";


const MyBetsContainer = ({ games }) => {

    console.log(games);
    return (
        <div className={styles['my-bets-container']}>
            <div className={styles['my-bets-list']}>
                {games?.bets?.map((game, index) => {
                    // Replace game.type values
                    let type = game.type;
                    if (type === 'win_1') type = 'win-main-1';
                    if (type === 'win_base_1') type = 'win-1';
                    if (type === 'win_2') type = 'win-main-2';
                    if (type === 'win_base_2') type = 'win-2';

                    // Apply different CSS classes based on profit value
                    const profitClass = game.profit < 0 ? styles['my-bets-red'] : game.profit === 0 ? styles['my-bets-blue'] : styles['my-bets-green'];
                    const rowColor = index % 2 === 0 ? styles['row-even'] : styles['row-odd'];

                    return (
                        <div key={index} className={rowColor}>
                            <span className={styles['my-bets-date']}>{`${game.date} ${game.time}`}</span> <br />
                            <span>{`${game.team1} vs ${game.team2} on ${game.map_num}st game ${game.map_name}`}</span> <br />
                            <span>{`${type} `}</span>
                            <span className={profitClass}>{`${game.coefficient}`}</span>
                            <span>{` profit `}</span>
                            <span className={profitClass}>{`${game.profit}`}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyBetsContainer;
