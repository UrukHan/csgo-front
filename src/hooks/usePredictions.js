import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../utils/config.json';

const usePredictions = (firstTeam, secondTeam) => {
    const [predictions, setPredictions] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        resetPredictions();
    }, [firstTeam, secondTeam]);

    const updatePredictions = async () => {
        if (!firstTeam || !secondTeam) {
            return;
        }
        setLoading(true);
        setPredictions({});
        const requests = config.maps.map(async (mapName) => {
            try {
                const response = await axios.post(`${config.apiUrl}/predict`, {
                    first_team: firstTeam,
                    second_team: secondTeam,
                    map_name: mapName,
                    rate_first: 0,
                    rate_second: 0
                });
                setPredictions((prevState) => ({
                    ...prevState,
                    [mapName]: response.data,
                }));
            } catch (error) {
                console.error('Error getting predictions:', error);
            }
        });
        await Promise.allSettled(requests);
        setLoading(false);
    };

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

    return [predictions, loading, updatePredictions, resetPredictions];
};

export default usePredictions;