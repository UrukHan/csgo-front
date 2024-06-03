import React, { useState, useEffect } from 'react';
import AdminForm from '../componentsAdmin/AdminForm';
import axios from 'axios';
import config from "../utils/config.json";
import styles from "./AdminPaymantsPage.module.css";

function AdminPaymentsPage() {
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(!localStorage.getItem('adminToken'));
    const [paymentId, setPaymentId] = useState(null);
    const [paymentsData, setPaymentsData] = useState([]);
    const [startDate, setStartDate] = useState(getWeekAgoDate());
    const [endDate, setEndDate] = useState(getTodayDate());
    const [cancelButtonDisabled, setCancelButtonDisabled] = useState(true);

    const handleAdminConfirmation = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAdminModalOpen(false);
    };

    useEffect(() => {
        if (!isAdminModalOpen) {
            const token = localStorage.getItem('adminToken');
            axios.post(
                `${config.paymentUrl}/api/v1/get-payments`,
                { start_date: startDate, end_date: endDate },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(res => setPaymentsData(res.data))
                .catch(err => console.error('Ошибка при загрузке данных', err));
        }
    }, [isAdminModalOpen, startDate, endDate]);

    const handleCancel = () => {
        const token = localStorage.getItem('adminToken');
        if (paymentId) {
            axios.post(
                `${config.paymentUrl}/api/v1/payment-cancel`,
                { PaymentId: paymentId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(() => setPaymentId(null))
                .catch(err => console.error('Ошибка при отмене платежа', err));
        }
    };

    const handleRemove = () => {
        const token = localStorage.getItem('adminToken');
        if (paymentId) {
            axios.delete(
                `${config.paymentUrl}/api/v1/payment-remove`,
                {
                    data: { PaymentId: paymentId },
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
                .then(() => {
                    setPaymentId(null);
                    // refresh the payments data after removing an item
                    // this step is optional, it depends on your need
                    axios.post(
                        `${config.paymentUrl}/api/v1/get-data`,
                        { start_date: startDate, end_date: endDate },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                        .then(res => setPaymentsData(res.data))
                        .catch(err => console.error('Ошибка при загрузке данных', err));
                })
                .catch(err => console.error('Ошибка при удалении платежа', err));
        }
    };

    useEffect(() => {
        setIsAdminModalOpen(!localStorage.getItem('adminToken'));
    }, []);

    useEffect(() => {
        setCancelButtonDisabled(paymentId === null);
    }, [paymentId]);

    return (
        <div className={styles['page']}>
            {isAdminModalOpen ? (
                <AdminForm onConfirm={handleAdminConfirmation} />
            ) : (
                <div className={styles['payments-container']}>
                    <div className={styles['date-inputs-container']}>
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
                    <div className={styles['table-admin-container']}>
                        <AdminPaymentsTable data={paymentsData} onSelect={setPaymentId} />
                    </div>
                    <div className={styles['buttons-container']}>
                        <button
                            className={`${styles['admin-button']} ${cancelButtonDisabled ? styles['admin-button-disabled'] : ''}`}
                            onClick={handleCancel}
                            disabled={cancelButtonDisabled}
                        >
                            CANCEL
                        </button>
                        <button
                            className={`${styles['admin-button']} ${cancelButtonDisabled ? styles['admin-button-disabled'] : ''}`}
                            onClick={handleRemove}
                            disabled={cancelButtonDisabled}
                        >
                            REMOVE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

}

export default AdminPaymentsPage;

function AdminPaymentsTable({ data, onSelect }) {
    const [activeRow, setActiveRow] = useState(null);

    const handleClick = (paymentId) => {
        if (paymentId === activeRow) {
            setActiveRow(null);
            onSelect(null);
        } else {
            setActiveRow(paymentId);
            onSelect(paymentId);
        }
    };

    return (
        <div className={styles['table-container']}>
            {data.map((item) => (
                <div
                    key={item.paymentId}
                    onClick={() => handleClick(item.paymentId)}
                    className={`${styles['table-row']} ${
                        activeRow === item.paymentId ? styles['active-row'] : ''
                    }`}
                >
                    <div className={styles['row-item-full']}>
                        {item.email}{' '}
                        {item.paymentId}{' '}
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

function getTodayDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

function getWeekAgoDate() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return weekAgo.toISOString().split('T')[0];
}
