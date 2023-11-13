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
                block: userData.block
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

    return (
        <div className={styles['page']}>
            <div className={styles['users-container']}>
                {isAdminModalOpen ? (
                    <AdminForm onConfirm={handleAdminConfirmation} />
                ) : (
                    <div className={styles['users-chose']}>
                        <input className={styles['user-input']} type="text" value={userAddress} onChange={handleAddressChange} placeholder="User address" />
                        <button className={styles['user-button']} onClick={handleFetchUserData}>FETCH</button>
                        <button className={styles['user-button']} onClick={handleUpdateUserData} disabled={!isEditable}>UPDATE</button>
                    </div>
                )}
                {isAdminModalOpen ? (
                    <AdminForm onConfirm={handleAdminConfirmation} />
                ) : (
                    <div className={styles['users-correct']}>
                        <input className={styles['user-date']} type="date" value={userData.access} disabled={!isEditable} onChange={(e) => setUserData({...userData, access: e.target.value})}/>
                        <select className={styles['user-subscribe']} value={userData.subscribe} disabled={!isEditable} onChange={(e) => setUserData({...userData, subscribe: e.target.value})}>
                            <option value=""></option>
                            <option value="MIR">MIR</option>
                            <option value="USDT polygon">USDT polygon</option>
                            <option value="PayPal">PayPal</option>
                        </select>
                        <div className={styles['user-block-container']}>
                            <input className={styles['user-block']} type="checkbox" checked={userData.block} disabled={!isEditable} onChange={(e) => setUserData({...userData, block: e.target.checked})}/>
                            <label className={styles['user-block-label']}>Block</label>
                        </div>
                        <div className={styles['user-status']}>
                            <p> Status: {statusMessage}</p>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}

export default AdminUsersPage;
