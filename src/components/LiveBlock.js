import React from 'react';
import styles from './LiveBlock.module.css';
import MapSelector from "./MapSelector";
import NumSelector from "./NumSelector";

const LiveBlock = ({info, optionsMap, optionsNum, handleFirstMapChange, firstMapOption, firstNumOption, secondNumOption,
                       handleFirstNumChange, handleSecondNumChange,
                       team1_win_prediction = "-",
                       team2_win_prediction = "-",
                       team1_min_coefficient = "-",
                       team2_min_coefficient = "-",
                       draw_min_coefficient = "-",
                       a_min_coefficient = "-",
                       b_min_coefficient = "-",
                       team1_count_games = "-",
                       team2_count_games = "-",
                }) => (
    <div className={styles['live-container']}>
        <div className={styles['live-title-container']}>
            <div className={styles['live-text']}>{"MAP"}</div>
            <div className={styles['live-text']}>{"SCORE"}</div>
        </div>
        <div className={styles['live-map-container']}>
            <MapSelector
                options={optionsMap}
                onChange={handleFirstMapChange}
                value={firstMapOption}
            />
            <NumSelector
                options={optionsNum}
                onChange={handleFirstNumChange}
                value={firstNumOption}
            />
            <NumSelector
                options={optionsNum}
                onChange={handleSecondNumChange}
                value={secondNumOption}
            />
        </div>
        <div className={styles['live-predict-container']}>
            <div className={styles.predictionContainer}>
                <div className={styles.predictionProbabilityContainer}>
                    <p className={`${styles.probabilityNumbers}`}>{`${team1_win_prediction}%`}</p>
                </div>
                <div className={styles.predictionCountContainer}>
                    <p className={`${styles.countNumbers}`}>{`${team1_count_games} games`}</p>
                </div>
            </div>
            <div className={styles.coefficientContainer}>
                <div className={styles.coefficientNumbersContainer}>
                    <p className={`${styles.coefficientRightNumbers}`}>
                        {`${team1_min_coefficient}`}
                    </p>
                    <p className={`${styles.coefficientLeftNumbers}`}>
                        {`${team2_min_coefficient}`}
                    </p>
                </div>
                <div className={styles.coefficientABDrawContainer}>
                    <p className={`${styles.coefficientANumbers}`}>
                        {`${a_min_coefficient}`}
                    </p>
                    <p className={`${styles.coefficientDrawNumbers}`}>{`${draw_min_coefficient}`}</p>
                    <p className={`${styles.coefficientBNumbers}`}>
                        {`${b_min_coefficient}`}
                    </p>
                </div>
            </div>
            <div className={styles.predictionContainer}>
                <div className={styles.predictionProbabilityContainer}>
                    <p className={`${styles.probabilityNumbers}`}>{`${team2_win_prediction}%`}</p>
                </div>
                <div className={styles.predictionCountContainer}>
                    <p className={`${styles.countNumbers}`}>{`${team2_count_games} games`}</p>
                </div>
            </div>
        </div>
        <div className={styles['live-info-container']}>
            <div className={styles['live-info']}> {info} </div>
        </div>
    </div>
);

export default LiveBlock;