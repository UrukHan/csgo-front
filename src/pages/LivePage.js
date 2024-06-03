import React, { useState, useEffect, useContext } from 'react';
import { AccessContext } from "../AccessContext";
import { GeneralContext } from '../GeneralContext';

import styles from './LivePage.module.css';

import TeamSelectionContainer from '../components/TeamSelectionContainer';
import LiveBlock from '../components/LiveBlock';
import GamesLiveContainer from '../components/GamesLiveContainer';
import BettingContainer from '../components/BettingContainer';
import SubscriptionModal from "../components/SubscriptionModal";
import CryptoModalPay from "../components/CryptoModalPay";

import useGames from '../hooks/useGames';
import useMaps from '../hooks/useMaps';
import useNumOptions from '../hooks/useNumOptions';
import useTeamImages from '../hooks/useTeamImages';
import usePrediction from '../hooks/usePrediction';
import useMyBets from '../hooks/useMyBets';
import {useTranslation} from "react-i18next";
import useBets from "../hooks/useBets";
import useMarks from "../hooks/useMarks";


function LivePage({ stripePromise }) {

    const { t } = useTranslation();
    const { isLoggedIn, haveAccess, setShowLoginModal, setShowSubscribeModal, showSubscribeModal, checkAccess } = useContext(AccessContext);
    const [showCryptoModal, setShowCryptoModal] = useState(false);

    const { liveGames } = useGames();
    const maps = useMaps();
    const optionsNum = useNumOptions();

    const { teamOptions } = useContext(GeneralContext);

    const [firstTeam, setFirstTeam] = useState('');
    const [secondTeam, setSecondTeam] = useState('');
    const [mapName, setMap] = useState('');
    const [firstNum, setFirstNum] = useState('');
    const [secondNum, setSecondNum] = useState('');
    const [firstTeamOption, setFirstTeamOption] = useState();
    const [secondTeamOption, setSecondTeamOption] = useState();
    const [firstMapOption, setFirstMapOption] = useState();
    const [firstNumOption, setFirstNumOption] = useState();
    const [secondNumOption, setSecondNumOption] = useState();

    const firstTeamImage = useTeamImages(firstTeam);
    const secondTeamImage = useTeamImages(secondTeam);
    const [prediction, loading, updatePredictions, resetPrediction] = usePrediction(firstTeam, secondTeam, mapName, firstNum, secondNum);

    const [betBoomData, updateBetBoom, resetBetBoomData, defaultBetData] = useBets(firstTeam, secondTeam);
    const [dataMark, updateMarks, resetMarkData, defaultMark] = useMarks(prediction, betBoomData);
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
        resetPrediction();
    };

    const handleFirstTeamChange = (selectedOption) => {
        setFirstTeamOption(selectedOption);
        setFirstTeam(selectedOption.value);
        resetPrediction();
    };

    const handleSecondTeamChange = (selectedOption) => {
        setSecondTeamOption(selectedOption);
        setSecondTeam(selectedOption.value);
        resetPrediction();
    };

    const handleFirstMapChange = (selectedOption) => {
        setFirstMapOption(selectedOption);
        setMap(selectedOption.value);
        resetPrediction();
    };

    const handleFirstNumChange = (selectedOption) => {
        setFirstNumOption(selectedOption);
        setFirstNum(selectedOption.value);
        resetPrediction();
    };

    const handleSecondNumChange = (selectedOption) => {
        setSecondNumOption(selectedOption);
        setSecondNum(selectedOption.value);
        resetPrediction();
    };

    useEffect(() => {
        if (maps.length > 0) {
            setFirstMapOption(maps[0]);
            setMap(maps[0]?.value);
        }
    }, [maps]);

    useEffect(() => {
        if (optionsNum.length > 0) {
            setFirstNumOption(optionsNum[0]);
            setSecondNumOption(optionsNum[0]);
            setFirstNum(optionsNum[0]?.value);
            setSecondNum(optionsNum[0]?.value);
        }
    }, [optionsNum]);

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
    }, [prediction, updateMarks]);

    useEffect(() => {
        if (teamOptions && teamOptions.length > 0) {
            setFirstTeamOption(teamOptions[0]);
            setSecondTeamOption(teamOptions[1]);
            setFirstTeam(teamOptions[0]?.value);
            setSecondTeam(teamOptions[1]?.value);
        }
    }, [teamOptions]);

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
                <LiveBlock
                    info={t('live-info')}
                    optionsMap={maps}
                    optionsNum={optionsNum}
                    handleFirstMapChange={handleFirstMapChange}
                    handleFirstNumChange={handleFirstNumChange}
                    handleSecondNumChange={handleSecondNumChange}
                    firstMapOption={firstMapOption}
                    firstNumOption={firstNumOption}
                    secondNumOption={secondNumOption}
                    value={firstMapOption}
                    team1_win_prediction={prediction?.predict_1}
                    team2_win_prediction={prediction?.predict_2}
                    team1_min_coefficient={prediction?.win_1}
                    team2_min_coefficient={prediction?.win_2}
                    draw_min_coefficient={prediction?.draw}
                    a_min_coefficient={prediction?.win_a}
                    b_min_coefficient={prediction?.win_b}
                    team1_count_games={prediction?.games_count_1}
                    team2_count_games={prediction?.games_count_2}
                />
            </div>
            <div className={styles['filler-container']} >
                <BettingContainer
                    betBoomData={betBoomData}
                    resetBetBoomData={resetBetBoomData}
                    defaultBetData={defaultBetData}
                    dataMark={dataMark}
                    defaultMark={defaultMark}
                />
                <GamesLiveContainer games={liveGames} handleGameClick={handleGameClick} />
            </div>
            {loading && (
                <div className={styles['container-overlay']}>
                    <div>Loading ...</div>
                </div>
            )}
            {showSubscribeModal && <SubscriptionModal onClose={() => setShowSubscribeModal(false)} stripePromise={stripePromise} />}
            {showCryptoModal && <CryptoModalPay onClose={() => setShowCryptoModal(false)} />}
        </div>
    );
}

export default LivePage;