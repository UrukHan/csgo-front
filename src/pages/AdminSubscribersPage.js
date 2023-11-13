import React, { useState, useEffect } from 'react';
import AdminForm from '../componentsAdmin/AdminForm';
import axios from 'axios';
import config from "../utils/config.json";
import styles from "./AdminPage.module.css";

function AdminPage() {
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

    const handleAdminLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAdminModalOpen(true);
    };

    useEffect(() => {
        if (!isAdminModalOpen) {
            const token = localStorage.getItem('adminToken');
            axios.post(
                `${config.paymentUrl}/api/v1/get_data`,
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
                `${config.paymentUrl}/api/v1/payment_cancel`,
                { PaymentId: paymentId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(() => setPaymentId(null))
                .catch(err => console.error('Ошибка при отмене платежа', err));
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
            <div className={styles['payments-container']}>
                {isAdminModalOpen ? (
                    <AdminForm onConfirm={handleAdminConfirmation} />
                ) : (
                    <div>
                        <div className={styles['title-container']}>
                            <h1>USER PAYMENTS</h1>
                        </div>
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
                        <div className={styles['table-container']}>
                            <AdminTable data={paymentsData} onSelect={setPaymentId} />
                        </div>
                        <div className={styles['buttons-container']}>
                            <button
                                className={`${styles['admin-button']} ${cancelButtonDisabled ? styles['admin-button-disabled'] : ''}`}
                                onClick={handleCancel}
                                disabled={cancelButtonDisabled}
                            >
                                Cancel payment</button>
                        </div>
                    </div>
                )}
            </div>
            <button className={styles['admin-logout-button']} onClick={handleAdminLogout}>Admin Logout</button>
        </div>
    );

}

export default AdminPage;

function AdminTable({ data, onSelect }) {
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
        <table className={styles['admin-table']}>
            <thead>
            <tr>
                <th>PaymentId</th>
                <th>Status</th>
                <th>Email</th>
                <th>Date</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item) => (
                <tr
                    key={item.paymentId}
                    onClick={() => handleClick(item.paymentId)}
                    className={`${styles['table-row']} ${
                        activeRow === item.paymentId ? styles['active-row'] : ''
                    }`}
                >
                    <td>{item.paymentId}</td>
                    <td>{item.status}</td>
                    <td>{item.email}</td>
                    <td>{item.date}</td>
                </tr>
            ))}
            </tbody>
        </table>
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
