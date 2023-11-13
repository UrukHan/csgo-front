import { useState, useEffect } from 'react';
import unknownImage from '../logos/unknown.png';

const useTeamImages = (teamName) => {
    const [teamImage, setTeamImage] = useState(() => unknownImage);

    useEffect(() => {
        const loadImage = async (team) => {
            try {
                const image = await import(`../logos/${team}.png`);
                return image.default;
            } catch (err) {
                return unknownImage;
            }
        };

        const loadTeamImage = async () => {
            const image = await loadImage(teamName);
            setTeamImage(image);
        };

        loadTeamImage();
    }, [teamName]);

    return teamImage;
};

export default useTeamImages;