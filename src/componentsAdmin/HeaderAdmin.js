import React, {useContext, useState} from 'react';
import { AdminContext } from '../AdminContext';
import { Link } from 'react-router-dom';
import styles from '../componentsAdmin/HeaderAdmin.module.css';
import logoImage from "../images/logo.png";

const HeaderAdmin = () => {

    const [setIsAdminModalOpen] = useState(!localStorage.getItem('adminToken'));

    const handleAdminLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAdminModalOpen(true);
    };

    return (
        <header className={styles['App-header']}>
            <div className={styles['header-buttons']}>
                <Link to="/admin" className={styles['header-button']}>
                    <img src={logoImage} alt="Logo" className={styles.logo} />
                </Link>
                <Link to="/admin/users" className={styles['header-button']}>USERS</Link>
                <Link to="/admin/payments" className={styles['header-button']}>PAYMENTS</Link>
                <Link to="/admin/subscribers" className={styles['header-button']}>SUBSCRIBERS</Link>
                <button
                    className={styles['header-button']}
                    onClick={handleAdminLogout}
                >
                    LOGOUT
                </button>
            </div>
        </header>
    );
};

export default HeaderAdmin;
