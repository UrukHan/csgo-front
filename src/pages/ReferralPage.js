import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from "../utils/config.json";
import styles from "./ReferralPage.module.css";

function ReferralPage() {
    const [referralData, setReferralData] = useState([]);
    const [startDate, setStartDate] = useState(getWeekAgoDate());
    const [endDate, setEndDate] = useState(getTodayDate());
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setStatusMessage('User is not authorized.');
            return;
        }

        fetchReferralData(authToken, startDate, endDate);
    }, [startDate, endDate]);

    const fetchReferralData = async (token, start, end) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${config.paymentUrl}/api/v1/referral-data`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setReferralData(response.data);
            setStatusMessage('Data fetched successfully.');
        } catch (error) {
            console.error('Error fetching referral data', error);
            setStatusMessage('Failed to fetch data.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles['page']}>
            <div className={styles['referral-container']}>
                <DateInputs
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                />
                <div className={styles['params']}>
                </div>
                {isLoading ? <p>Loading...</p> : <ReferralTable data={referralData} />}

            </div>
            <div className={styles['status-message']}>
                <p>Status: {statusMessage}</p>
            </div>
        </div>
    );
}

function DateInputs({ startDate, setStartDate, endDate, setEndDate }) {
    return (
        <div className={styles['date-inputs-container']}>
            {/* Start Date */}
            <div className={styles['date-input-container']}>
                <label>
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className={styles['date-input']}
                    />
                </label>
            </div>
            {/* End Date */}
            <div className={styles['date-input-container']}>
                <label>
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className={styles['date-input']}
                    />
                </label>
            </div>
        </div>
    );
}

function ReferralTable({ data }) {
    if (!data.transactions || data.transactions.length === 0) {
        return <p>No referral data available.</p>;
    }

    return (
        <div className={styles['table-container']}>
            {data.transactions.map((item) => (
                <div key={item.paymentId} className={styles['table-row']}>
                    <div className={styles['row-item-full']}>
                        {item.paymentId}
                    </div>
                    <div className={styles['row-item']}>
                        <div className={styles['row-item-amount']}>
                            {item.amount}
                        </div>
                        <div className={styles['row-item-type-transction']}>
                            {item.transactionType}
                        </div>
                        <div className={styles['row-item-type-pay']}>
                            {item.payType}
                        </div>
                        <div className={styles['row-item-email']}>
                            {item.referralId}
                        </div>
                        <div className={styles['row-item-status']}>
                            {item.status}
                        </div>
                        <div className={styles['row-item-date']}>
                            {item.date}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Helper functions for dates
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getWeekAgoDate() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return weekAgo.toISOString().split('T')[0];
}

export default ReferralPage;
