import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from "./utils/config.json";

export const GeneralContext = createContext({ teamOptions: [] });

export const ContextProvider = ({ children }) => {
    const [teamOptions, setTeamOptions] = useState([]);

    useEffect(() => {
        axios.get(`${config.apiUrl}/teams`)
            .then(res => {

                const teamOptions = res.data.map(team => ({
                    value: team,
                    label: team
                }));
                setTeamOptions(teamOptions);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <GeneralContext.Provider value={{ teamOptions }}>
            {children}
        </GeneralContext.Provider>
    );
};
