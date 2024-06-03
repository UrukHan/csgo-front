import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import config from "../utils/config.json";

const useGames = () => {
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [liveGames, setLiveGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/upcoming`);
                const localTimeZone = moment.tz.guess();
                const currentDateTime = moment().tz(localTimeZone);

                const processedGames = response.data.map(game => {
                    const gameDateTimeUTC = moment.utc(`${game.date} ${game.time}`, 'YYYY-MM-DD HH:mm');
                    const localGameDateTime = gameDateTimeUTC.clone().tz(localTimeZone);
                    return {
                        ...game,
                        date: localGameDateTime.format('YYYY-MM-DD'),
                        time: localGameDateTime.format('HH:mm'),
                        isLive: localGameDateTime.isBefore(currentDateTime)
                    };
                });

                setUpcomingGames(processedGames.filter(game => !game.isLive));
                setLiveGames(processedGames.filter(game => game.isLive));

            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        fetchGames();
    }, []);

    return { upcomingGames, liveGames };
};

export default useGames;