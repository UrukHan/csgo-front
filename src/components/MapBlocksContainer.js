import React from 'react';
import styles from './MapBlocksContainer.module.css';
import MapBlock from './MapBlock';

const MapBlocksContainer = ({ config, predictions }) => {
    return (
        <div className={styles['map-blocks-container']}>
            {config.maps.map((mapName, index) => (
                <MapBlock
                    key={mapName}
                    mapName={mapName}
                    team1_win_prediction={predictions[mapName]?.predict_1}
                    team2_win_prediction={predictions[mapName]?.predict_2}
                    team1_min_coefficient={predictions[mapName]?.win_1}
                    team2_min_coefficient={predictions[mapName]?.win_2}
                    draw_min_coefficient={predictions[mapName]?.draw}
                    a_min_coefficient={predictions[mapName]?.win_a}
                    b_min_coefficient={predictions[mapName]?.win_b}
                    team1_count_games={predictions[mapName]?.games_count_1}
                    team2_count_games={predictions[mapName]?.games_count_2}
                    isDark={index % 2 === 0}
                />
            ))}
        </div>
    );
};

export default MapBlocksContainer;


