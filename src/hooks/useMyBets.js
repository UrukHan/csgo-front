import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import config from "../utils/config.json";
import { AccessContext } from "../AccessContext";

const useMyBets = () => {

    const { haveAccess } = useContext(AccessContext);
    const [myBets, setMyBets] = useState([]);

    useEffect(() => {
        const fetchMyBets = async () => {
            if (haveAccess) {
                const response = await axios.get(`${config.apiUrl}/bets`);
                setMyBets(response.data);
            } else {
                const response = await axios.get(`${config.apiUrl}/bets_limited`);
                setMyBets(response.data);
            }
        };

        fetchMyBets();

    }, [haveAccess]);

    return myBets;
};

export default useMyBets;
