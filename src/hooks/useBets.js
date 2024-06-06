import { useState, useCallback } from 'react';
import axios from "axios";
import config from "../utils/config.json";

const defaultBetData = {
    '1': { 'win1': '-', 'win2': '-', 'draw': '-', 'winBase1': '-', 'winBase2': '-' },
    '2': { 'win1': '-', 'win2': '-', 'draw': '-', 'winBase1': '-', 'winBase2': '-' },
    '3': { 'win1': '-', 'win2': '-', 'draw': '-', 'winBase1': '-', 'winBase2': '-' }
};

const useBets = (firstTeam, secondTeam) => {
    const [betBoomData, setBetBoomData] = useState({ ...defaultBetData });

    const updateBetBoom = useCallback(async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/betboom`, {
                params: { team1: firstTeam, team2: secondTeam }
                });
            const bbData = response.data.betboom;
            console.log('Fetched bbData:', bbData);

            if (bbData) {
                const updatedBetData = { ...defaultBetData };
                const allowedKeys = ['1', '2', '3'];

                allowedKeys.forEach(key => {
                    if (bbData[key]) {
                        updatedBetData[key] = {
                            ...updatedBetData[key],
                            win1: bbData[key].win1 || '-',
                            win2: bbData[key].win2 || '-',
                            draw: bbData[key].draw || '-',
                            winBase1: bbData[key].winBase1 || '-',
                            winBase2: bbData[key].winBase2 || '-',
                        };
                    }
                });
                console.log('Updated bet data:', updatedBetData);
                setBetBoomData(updatedBetData);
            }
        } catch (error) {
            console.error('Error fetching betBoom data:', error);
            throw error;
        }
    }, [firstTeam, secondTeam]);

    const resetBetBoomData = useCallback(() => {
        setBetBoomData(defaultBetData);
    }, []);

    return [betBoomData, updateBetBoom, resetBetBoomData, defaultBetData];
};

export default useBets;