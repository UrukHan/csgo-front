import React, { useState, useEffect } from 'react';
import AdminForm from '../componentsAdmin/AdminForm';
import axios from 'axios';
import config from "../utils/config.json";
import styles from "./AdminUsersPage.module.css";
import moment from 'moment';

function AdminUsersPage() {
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(!localStorage.getItem('adminToken'));
    const [userData, setUserData] = useState({});
    const [userAddress, setUserAddress] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [startDate, setStartDate] = useState(getWeekAgoDate());
    const [endDate, setEndDate] = useState(getTodayDate());
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        fetchUsersData();
    }, [currentPage, startDate, endDate]);

    const handleAdminConfirmation = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAdminModalOpen(false);
    };

    const handleAddressChange = e => {
        setUserAddress(e.target.value);
    };

    const handleFetchUserData = () => {
        const token = localStorage.getItem('adminToken');
        axios.post(
            `${config.paymentUrl}/api/v1/get-user`,
            { user: userAddress },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(res => {
                setUserData({...res.data, access: moment(res.data.access).format('YYYY-MM-DD')});
                setIsEditable(true);
                setStatusMessage('Data fetched successfully.');
            })
            .catch(err => {
                console.error('Ошибка при загрузке данных', err);
                setStatusMessage('Failed to fetch data.');
            });
    };

    const handleUpdateUserData = () => {
        const token = localStorage.getItem('adminToken');
        axios.post(
            `${config.paymentUrl}/api/v1/correct-user`,
            {
                address: userAddress,
                accessTo: userData.access,
                subscribe: userData.subscribe,
                block: userData.block,
                referral: userData.referral
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(res => {
                setStatusMessage('Data updated successfully.');
            })
            .catch(err => {
                console.error('Ошибка при обновлении данных', err);
                setStatusMessage('Failed to update data.');
            });
    };

    const handleDeleteUserData = async () => {
        const token = localStorage.getItem('adminToken');
        if (userAddress) {
            try {
                await axios.delete(`${config.paymentUrl}/api/v1/delete-user/${userAddress}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStatusMessage('User deleted successfully.');

                setUserData({});
                setUserAddress('');
                setIsEditable(false);
            } catch (err) {
                console.error('Error deleting user', err);
                setStatusMessage('Failed to delete user.');
            }
        }
    };

    const handlePageChange = newPage => {
        setCurrentPage(newPage);
    };

    const fetchUsersData = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await axios.post(`${config.paymentUrl}/api/v1/users-data`, {
                start_date: startDate,
                end_date: endDate,
                page: currentPage
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Users Data:', response);
            setUsersData(response.data.users);
            setTotalPages(response.data.totalPages);
            setTotalUsers(response.data.totalUsers);
            setStatusMessage('Data fetched successfully.');
        } catch (error) {
            console.error('Error fetching users data', error);
            setStatusMessage('Failed to fetch data.');
        }
    };


    return (
        <div className={styles['page']}>
            <div className={styles['user-container']}>
                {isAdminModalOpen ? (
                    <AdminForm onConfirm={handleAdminConfirmation} />
                ) : (
                    <div className={styles['users-chose']}>
                        <input className={styles['user-input']} type="text" value={userAddress} onChange={handleAddressChange} placeholder="User address" />
                        <button className={styles['user-button']} onClick={handleFetchUserData}>FETCH</button>
                        <button className={styles['user-button']} onClick={handleUpdateUserData} disabled={!isEditable}>UPDATE</button>
                        <button className={styles['user-button']} onClick={handleDeleteUserData}>DELETE</button>
                    </div>
                )}
                {isAdminModalOpen ? (
                    <AdminForm onConfirm={handleAdminConfirmation} />
                ) : (
                    <div className={styles['users-correct']}>
                        <input className={styles['user-date']} type="date" value={userData.access} disabled={!isEditable} onChange={(e) => setUserData({...userData, access: e.target.value})}/>
                        <select className={styles['user-subscribe']} value={userData.subscribe} disabled={!isEditable} onChange={(e) => setUserData({...userData, subscribe: e.target.value})}>
                            <option value=""></option>
                            <option value="Stripe">Stripe</option>
                            <option value="PayPal">PayPal</option>
                            <option value="MIR">MIR</option>
                            <option value="USDT polygon">USDT polygon</option>
                            <option value="USDT binance">USDT polygon</option>
                            <option value="USDT solana">USDT polygon</option>
                            <option value="USDC polygon">USDC polygon</option>
                            <option value="USDC binance">USDC polygon</option>
                            <option value="USDC solana">USDC polygon</option>
                        </select>
                        <input
                            className={styles['user-input']}
                            type="text"
                            value={userData.referral}
                            disabled={!isEditable}
                            onChange={(e) => setUserData({...userData, referral: e.target.value})}
                            placeholder="Referral Status"
                        />
                        <div className={styles['user-block-container']}>
                            <input className={styles['user-block']} type="checkbox" checked={userData.block} disabled={!isEditable} onChange={(e) => setUserData({...userData, block: e.target.checked})}/>
                            <label className={styles['user-block-label']}>Block</label>
                        </div>

                    </div>
                )}
                <div className={styles['user-status']}>
                    <p> Status: {statusMessage}</p>
                </div>
            </div>
            <div className={styles['pagination-container']}>
                <button className={styles['users-button']} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                <input className={styles['users-input']} type="number" value={currentPage} onChange={e => setCurrentPage(Number(e.target.value))} />
                <button className={styles['users-button']} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                <button className={styles['users-button']} onClick={() => fetchUsersData()}>Перейти</button>
                <span> Pages: {totalPages}</span>
                <span> Users: {totalUsers}</span>
            </div>
            <div className={styles['list-container']}>
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
                <UsersTable data={usersData} />
                <div className={styles['status-message']}>
                    <p>Status: {statusMessage}</p>
                </div>
            </div>
        </div>
    );
}

export default AdminUsersPage;

function UsersTable({ data }) {

    if (!data || data.length === 0) {
        return <div>No users data available.</div>;
    }

    return (
        <div className={styles['table-container']}>
            {data.map((item, index) => (
                <div key={index} className={styles['table-row']}>
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

