
import styles from "./UsersContainer.module.css";
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import config from '../utils/config';
import { UserChart } from '../componentsAdmin/UserChart';

export function UsersContainer() {
    const [userStats, setUserStats] = useState({});

    useEffect(() => {
        const fetchUserStats = async () => {
            const response = await axios.post(`${config.authorizationUrl}/api/v1/user_stats`);
            setUserStats(response.data);
        };

        fetchUserStats();
    }, []);

    return (
        <div className={styles['user-container']}>
            <div className={styles['data-container']}>
                <div className={styles['total-users']}>Общее количество пользователей: {userStats.total}</div>
                <div className={styles['yearly-users']}>Пользователи за последний год: {userStats.yearly}</div>
                <div className={styles['monthly-users']}>Пользователи за последний месяц: {userStats.monthly}</div>
            </div>
            <UserChart data={userStats.chartData} />
        </div>
    );
}


