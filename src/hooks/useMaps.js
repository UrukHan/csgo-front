import { useState, useEffect } from 'react';
import config from '../utils/config.json';

const useMaps = () => {
    const [maps, setMaps] = useState([]);

    useEffect(() => {
        const options = config.maps;
        console.log(options.map)
        setMaps(options.map(map => ({ value: map, label: map })));
    }, []);

    return maps;
};

export default useMaps;


