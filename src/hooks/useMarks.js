import { useState, useCallback } from 'react';
import config from "../utils/config.json";

const defaultMark = {
    '1': { 'win1': 0, 'win2': 0, 'draw': 0, 'winBase1': 0, 'winBase2': 0 },
    '2': { 'win1': 0, 'win2': 0, 'draw': 0, 'winBase1': 0, 'winBase2': 0 },
    '3': { 'win1': 0, 'win2': 0, 'draw': 0, 'winBase1': 0, 'winBase2': 0 }
};

const useMarks = (predictions, betBoomData) => {
    const [dataMark, setDataMark] = useState({ ...defaultMark });

    const updateMarks = useCallback(async () => {

        try {
            const minValues = { 'win1': 0, 'win2': 0, 'draw': 0, 'winBase1': 0, 'winBase2': 0 };

            for (let map of config.maps) {
                const prediction = predictions[map];

                if (prediction !== undefined) {
                    minValues.win1 = Math.max(minValues.win1, prediction.win_a);
                    minValues.win2 = Math.max(minValues.win2, prediction.win_b);
                    minValues.draw = Math.max(minValues.draw, prediction.draw);
                    minValues.winBase1 = Math.max(minValues.winBase1, prediction.win_1);
                    minValues.winBase2 = Math.max(minValues.winBase2, prediction.win_2);
                }

            }

            const newDataMark = { '1': { ...dataMark['1'] }, '2': { ...dataMark['2'] }, '3': { ...dataMark['3'] } };

            for (let i = 1; i <= 3; i++) {
                const betBoom = betBoomData[i];
                Object.keys(minValues).forEach(key => {
                    if (betBoom[key] !== '-' && minValues[key] <= betBoom[key] && minValues[key] !== 0) {
                        newDataMark[i][key] = 1;
                    }
                });
            }
            setDataMark(newDataMark);
            console.log('Updated marks data:', newDataMark);
        } catch (error) {
            console.error('Error updating marks data:', error);
        }
    }, [predictions, betBoomData, dataMark]);

    const resetMarkData = useCallback(() => {
        setDataMark(defaultMark);
    }, []);

    return [dataMark, updateMarks, resetMarkData, defaultMark];
};

export default useMarks;
