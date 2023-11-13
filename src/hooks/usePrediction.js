import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../utils/config.json';

const usePrediction = (firstTeam, secondTeam, mapName, rateFirst, rateSecond) => {
    const [prediction, setPrediction] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        resetPrediction();
    }, [firstTeam, secondTeam, mapName, rateFirst, rateSecond]);

    const updatePredictions = async () => {
        if (!firstTeam || !secondTeam || !mapName || !Number.isInteger(rateFirst) || !Number.isInteger(rateSecond)) {
            return;
        }
        setLoading(true);
        setPrediction({});
        try {
            const response = await axios.post(`${config.apiUrl}/predict`, {
                first_team: firstTeam,
                second_team: secondTeam,
                map_name: mapName,
                rate_first: rateFirst,
                rate_second: rateSecond
            });
            setPrediction(response.data);
        } catch (error) {
            console.error('Error getting predictions:', error);
        }
        setLoading(false);
    };

    const resetPrediction = () => {
        setPrediction(
            {
                predict_1: "-", predict_2: "-", win_1: "-", win_2: "-", draw: "-", win_a: "-", win_b: "-", games_count_1: "-", games_count_2: "-"
            }
        );
    };

    return [prediction, loading, updatePredictions, resetPrediction];
};

export default usePrediction;