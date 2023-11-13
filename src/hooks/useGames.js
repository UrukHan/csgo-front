import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import config from "../utils/config.json";

const useGames = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/upcoming`);
                console.log("response: ", response)
                const localTimeZone = moment.tz.guess();
                const localOffset = moment.tz(localTimeZone).utcOffset();
                const currentDateTime = moment().utcOffset(localOffset);

                const localGames = response.data.map(game => {
                    const gameDateTime = moment.tz(`${game.date} ${game.time}`, 'YYYY-MM-DD HH:mm', localTimeZone);
                    const localGameDateTime = gameDateTime.utcOffset(localOffset);
                    const localDate = localGameDateTime.format('YYYY-MM-DD');
                    const localTime = localGameDateTime.format('HH:mm');
                    return {
                        ...game,
                        date: localDate,
                        time: localTime
                    };
                }).filter(game => moment.tz(`${game.date} ${game.time}`, 'YYYY-MM-DD HH:mm', localTimeZone).isSameOrAfter(currentDateTime));


                console.log(localGames)
                setGames(localGames);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        fetchGames();
    }, []);

    return games;
};

export default useGames;