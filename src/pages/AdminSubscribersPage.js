import React, { useState, useEffect } from 'react';
import AdminForm from '../componentsAdmin/AdminForm';
import styles from "./AdminSubscribersPage.module.css";
import axios from 'axios';
import config from "../utils/config.json";

function AdminSubscribersPage() {
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(!localStorage.getItem('adminToken'));
    const [subscribersData, setSubscribersData] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalSubscribers, setTotalSubscribers] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');

    const [cancelButtonDisabled, setCancelButtonDisabled] = useState(true);

    const handlePageChange = newPage => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        fetchSubscribersData();
    }, [currentPage, isAdminModalOpen]);

    const handleAdminConfirmation = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAdminModalOpen(false);
    };

    const fetchSubscribersData = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.post(`${config.paymentUrl}/api/v1/get-subscribers`, {
                page: currentPage
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Users Data:', response);
            setSubscribersData(response.data.users);
            setTotalPages(response.data.totalPages);
            setTotalSubscribers(response.data.totalUsers);
            setStatusMessage('Data fetched successfully.');
        } catch (error) {
            console.error('Error fetching users data', error);
            setStatusMessage('Failed to fetch data.');
        }
    };

    const handleCancel = () => {
        const token = localStorage.getItem('adminToken');
        if (selectedEmail) {
            axios.post(
                `${config.paymentUrl}/api/v1/subscribe-cancel`,
                { email: selectedEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(() => {
                    setSelectedEmail(null);
                })
                .catch(err => console.error('Ошибка при отмене подписки', err));
        }
    };

    useEffect(() => {
        setIsAdminModalOpen(!localStorage.getItem('adminToken'));
    }, []);

    useEffect(() => {
        setCancelButtonDisabled(selectedEmail === null);
    }, [selectedEmail]);

    return (
        <div className={styles['page']}>
            <div className={styles['user-container']}>
                {isAdminModalOpen ? (
                    <AdminForm onConfirm={handleAdminConfirmation} />
                ) : (
                    <div className={styles['buttons-container']}>
                        <button
                            className={`${styles['admin-button']} ${selectedEmail ? '' : styles['admin-button-disabled']}`}
                            onClick={handleCancel}
                            disabled={!selectedEmail}
                        >
                            Cancel payment</button>
                    </div>
                )}
            </div>
            <div className={styles['pagination-container']}>
                <button className={styles['users-button']} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                <input className={styles['users-input']} type="number" value={currentPage} onChange={e => setCurrentPage(Number(e.target.value))} />
                <button className={styles['users-button']} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                <button className={styles['users-button']} onClick={() => fetchSubscribersData()}>Перейти</button>
                <span> Pages: {totalPages}</span>
                <span> Users: {totalSubscribers}</span>
            </div>
            <div className={styles['list-container']}>
                <AdminSubscribersTable data={subscribersData} onEmailSelect={setSelectedEmail} />
                <div className={styles['status-message']}>
                    <p>Status: {statusMessage}</p>
                </div>
            </div>
        </div>
    );

}

export default AdminSubscribersPage;

function AdminSubscribersTable({ data, onEmailSelect }) {
    const [activeRow, setActiveRow] = useState(null);

    const handleClick = (email) => {
        if (email === activeRow) {
            setActiveRow(null);
            onEmailSelect(null);
        } else {
            setActiveRow(email);
            onEmailSelect(email);
        }
    };

    if (!data || data.length === 0) {
        return <div>No users data available.</div>;
    }

    return (
        <div className={styles['table-container']}>
            {data.map((item, index) => (
                <div
                    key={index}
                    onClick={() => handleClick(item.email)}
                    className={`${styles['table-row']} ${
                        activeRow === item.email ? styles['active-row'] : ''
                    }`}
                >
                    <div className={styles['row-item']}>Email: {item.email}</div>
                    <div className={styles['row-item']}>Date: {item.date}</div>
                    <div className={styles['row-item']}>Access To: {item.accessTo}</div>
                    <div className={styles['row-item']}>Subscribe: {item.subscribe}</div>
                    <div className={styles['row-item']}>Confirmed: {item.confirmed ? 'Yes' : 'No'}</div>
                    <div className={styles['row-item']}>Block Status: {item.block ? 'Blocked' : 'Active'}</div>
                    <div className={styles['row-item']}>Referral: {item.referral}</div>
                    <div className={styles['row-item']}>Referral ID: {item.referralId}</div>
                </div>
            ))}
        </div>
    );
}
