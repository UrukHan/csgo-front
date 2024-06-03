import React, { useState } from 'react';
import styles from './MapBlock.module.css';


const MapBlock = ({
                      mapName,
                      team1_win_prediction = "-",
                      team2_win_prediction = "-",
                      team1_min_coefficient = "-",
                      team2_min_coefficient = "-",
                      draw_min_coefficient = "-",
                      a_min_coefficient = "-",
                      b_min_coefficient = "-",
                      team1_count_games = "-",
                      team2_count_games = "-",
                      isDark,
                  }) => {
    const [showCoefficients, setShowCoefficients] = useState(true);

    const toggleContainer = () => {
        setShowCoefficients(!showCoefficients);
    };

    return (
        <div
            className={`${styles.container} ${
                isDark ? styles['container-dark'] : styles['container-light']
            }`}
        >
            <div className={styles.mapNameContainer}>{mapName}</div>
            <div className={styles.predictionContainer}>
                <div className={styles.predictionProbabilityContainer}>
                    <p className={`${styles.probabilityNumbers}`}>{`${team1_win_prediction}%`}</p>
                </div>
                <div className={styles.predictionCountContainer}>
                    <p className={`${styles.countNumbers}`}>{`${team1_count_games} games`}</p>
                </div>
            </div>
            <div className={styles.coefficientContainer}>
                {showCoefficients ? (
                    <div className={styles.coefficientNumbersContainer} onClick={toggleContainer}>
                        <p className={`${styles.coefficientRightNumbers}`}>
                            {`${team1_min_coefficient}`}
                        </p>
                        <p className={`${styles.coefficientLeftNumbers}`}>
                            {`${team2_min_coefficient}`}
                        </p>
                    </div>
                ) : (
                    <div className={styles.coefficientABDrawContainer} onClick={toggleContainer}>
                        <p className={`${styles.coefficientANumbers}`}>
                            {`${a_min_coefficient}`}
                        </p>
                        <p className={`${styles.coefficientDrawNumbers}`}>
                            {`${draw_min_coefficient}`}
                        </p>
                        <p className={`${styles.coefficientBNumbers}`}>
                            {`${b_min_coefficient}`}
                        </p>
                    </div>
                )}
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
    );
};

export default MapBlock;