import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import config from "../utils/config.json";
import { AccessContext } from "../AccessContext";

const useMyBets = () => {
    const { haveAccess } = useContext(AccessContext);
    const [myBetsData, setMyBetsData] = useState({ bets: [], bank: 0, bank_month: 0, bank_year: 0 });

    useEffect(() => {
        const fetchMyBets = async () => {
            try {
                const response = haveAccess
                    ? await axios.get(`${config.apiUrl}/bets`)
                    : await axios.get(`${config.apiUrl}/bets_limited`);

                const localTimeZone = moment.tz.guess();

                const processedBets = response.data.bets.map(bet => {
                    const betDateTimeUTC = moment.utc(`${bet.date} ${bet.time}`, 'YYYY-MM-DD HH:mm');
                    const localBetDateTime = betDateTimeUTC.clone().tz(localTimeZone);

                    return {
                        ...bet,
                        date: localBetDateTime.format('YYYY-MM-DD'),
                        time: localBetDateTime.format('HH:mm')
                    };
                });

                setMyBetsData({
                    bets: processedBets,
                    bank: response.data.bank,
                    bank_month: response.data.bank_month,
                    bank_year: response.data.bank_year
                });
            } catch (error) {
                console.error('Error fetching bets:', error);
            }
        };

        fetchMyBets();
    }, [haveAccess]);

    return myBetsData;
};


export default useMyBets;
