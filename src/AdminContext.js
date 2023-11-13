import { createContext, useState } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(!localStorage.getItem('adminToken'));

    const handleAdminConfirmation = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAdminModalOpen(false);
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAdminModalOpen(true);
    };

    return (
        <AdminContext.Provider value={{
            isAdminModalOpen,
            setIsAdminModalOpen,
            handleAdminConfirmation,
            handleAdminLogout
        }}>
            {children}
        </AdminContext.Provider>
    );
};
