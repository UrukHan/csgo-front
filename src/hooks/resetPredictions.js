import { useState } from 'react';
import config from '../utils/config.json';

const usePredictions = () => {
    const [predictions, setPredictions] = useState({});

    const resetPredictions = () => {
        setPredictions(
            config.maps.reduce((acc, mapName) => {
                acc[mapName] = {
                    predict_1: "-", predict_2: "-", win_1: "-", win_2: "-", draw: "-", win_a: "-", win_b: "-", games_count_1: "-", games_count_2: "-"
                };
                return acc;
            }, {})
        );
    };

    return [predictions, setPredictions, resetPredictions];
};

export default usePredictions;