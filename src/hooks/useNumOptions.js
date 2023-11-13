import { useState, useEffect } from 'react';
import config from '../utils/config.json';

const useMapOptions = () => {
    const [mapOptions, setMapOptions] = useState([]);

    useEffect(() => {
        const options = config.rounds;
        setMapOptions(options.map(map => ({ value: map, label: map })));
    }, []);

    return mapOptions;
};

export default useMapOptions;


