import React, { useState, useEffect, useContext } from 'react';
import { AccessContext } from "../AccessContext";
import { GeneralContext } from '../GeneralContext';

import styles from './LinePage.module.css';
import config from '../utils/config.json';

import TeamSelectionContainer from '../components/TeamSelectionContainer';
import MapBlock from '../components/MapBlock';
import Reference from '../components/Reference';
import BettingContainer from '../components/BettingContainer';
import GamesContainer from '../components/GamesContainer';

import useGames from '../hooks/useGames';
import useMarks from '../hooks/useMarks';
import useBets from '../hooks/useBets';
import useTeamImages from '../hooks/useTeamImages';
import usePredictions from '../hooks/usePredictions';
import useMyBets from '../hooks/useMyBets';
import SubscriptionModal from "../components/SubscriptionModal";
import CryptoModal from "../components/CryptoModal";


function LinePage({ stripePromise }) {

    const { isLoggedIn, haveAccess, setShowLoginModal, setShowSubscribeModal, showSubscribeModal, checkAccess } = useContext(AccessContext);
    const [showCryptoModal, setShowCryptoModal] = useState(false);

    const games = useGames();
    const { teamOptions } = useContext(GeneralContext);

    const [firstTeam, setFirstTeam] = useState('');
    const [secondTeam, setSecondTeam] = useState('');
    const [firstTeamOption, setFirstTeamOption] = useState();
    const [secondTeamOption, setSecondTeamOption] = useState();

    const firstTeamImage = useTeamImages(firstTeam);
    const secondTeamImage = useTeamImages(secondTeam);
    const [predictions, loading, updatePredictions, resetPredictions] = usePredictions(firstTeam, secondTeam);

    const [betBoomData, updateBetBoom, resetBetBoomData, defaultBetData] = useBets(firstTeam, secondTeam);
    const [dataMark, updateMarks, resetMarkData, defaultMark] = useMarks(predictions, betBoomData);
    const myBets = useMyBets();

    const handleGetButtonClick = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        } else if (haveAccess) {
            if (!loading) {
                await updatePredictions();
            }
        } else {
            await checkAccess();
            if (!haveAccess) {
                setShowSubscribeModal(true);
            }
        }
    };

    const handleGameClick = (game) => {
        const firstTeamOption = teamOptions.find((option) => option.value === game.team1);
        const secondTeamOption = teamOptions.find((option) => option.value === game.team2);
        if (firstTeamOption && secondTeamOption) {
            setFirstTeamOption(firstTeamOption);
            setSecondTeamOption(secondTeamOption);
            setFirstTeam(game.team1);
            setSecondTeam(game.team2);
        }
        resetPredictions();
        resetMarkData();
    };

    const handleFirstTeamChange = (selectedOption) => {
        setFirstTeamOption(selectedOption);
        setFirstTeam(selectedOption.value);
        resetPredictions();
        resetBetBoomData();
    };

    const handleSecondTeamChange = (selectedOption) => {
        setSecondTeamOption(selectedOption);
        setSecondTeam(selectedOption.value);
        resetPredictions();
        resetBetBoomData();
    };

    useEffect(() => {
        console.log("TEAMS LINE: ", teamOptions)
        if (teamOptions && teamOptions.length > 0) {
            setFirstTeamOption(teamOptions[0]);
            setSecondTeamOption(teamOptions[1]);
            setFirstTeam(teamOptions[0]?.value);
            setSecondTeam(teamOptions[1]?.value);
        }
    }, [teamOptions]);

    useEffect(() => {
        if (firstTeam && secondTeam) {
            updateBetBoom()
                .then(result => {
                    console.log(result);
                })
                .catch(error => {
                    console.error(error);
                });
        }
        resetMarkData();
    }, [firstTeam, secondTeam, updateBetBoom, resetMarkData]);

    useEffect(() => {
        updateMarks()
            .then(result => {
                console.log("MARKS", result);
            })
            .catch(error => {
                console.error(error);
            });
    }, [predictions, updateMarks]);


    return (
        <div className={styles['page']}>
            <TeamSelectionContainer
                options={teamOptions}
                handleFirstTeamChange={handleFirstTeamChange}
                handleSecondTeamChange={handleSecondTeamChange}
                firstTeamImage={firstTeamImage}
                firstTeamOption={firstTeamOption}
                handleGetButtonClick={handleGetButtonClick}
                secondTeamImage={secondTeamImage}
                secondTeamOption={secondTeamOption}
                games={myBets}
            />
            <div className={styles['map-blocks-container']}>
                {haveAccess ? config.maps.map((mapName, index) => (
                    <MapBlock
                        key={mapName}
                        mapName={mapName}
                        team1_win_prediction={predictions[mapName]?.predict_1}
                        team2_win_prediction={predictions[mapName]?.predict_2}
                        team1_min_coefficient={predictions[mapName]?.win_1}
                        team2_min_coefficient={predictions[mapName]?.win_2}
                        draw_min_coefficient={predictions[mapName]?.draw}
                        a_min_coefficient={predictions[mapName]?.win_a}
                        b_min_coefficient={predictions[mapName]?.win_b}
                        team1_count_games={predictions[mapName]?.games_count_1}
                        team2_count_games={predictions[mapName]?.games_count_2}
                        isDark={index % 2 === 0}
                    />
                )) : <Reference /> }
            </div>
            <div className={styles['filler-container']} >
                <BettingContainer
                    firstTeam={firstTeam}
                    secondTeam={secondTeam}
                    betBoomData={betBoomData}
                    resetBetBoomData={resetBetBoomData}
                    defaultBetData={defaultBetData}
                    dataMark={dataMark}
                    defaultMark={defaultMark}
                />
                <GamesContainer games={games} handleGameClick={handleGameClick} />
            </div>
            {loading && (
                <div className={styles['container-overlay']}>
                    <div>Loading ...</div>
                </div>
            )}
            {showSubscribeModal && <SubscriptionModal onClose={() => setShowSubscribeModal(false)} stripePromise={stripePromise} />}
            {showCryptoModal && <CryptoModal onClose={() => setShowCryptoModal(false)} />}
        </div>
    );
}

export default LinePage;