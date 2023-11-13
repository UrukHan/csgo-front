import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import config from "./utils/config.json";

export const AccessContext = createContext({
    isLoggedIn: false,
    isSubscribed: false,
    haveAccess: false,
    showLoginModal: false,
    showSubscribeModal: false,
    subscribeTo: null,
    onLogin: () => {},
    onLogout: () => {},
    setShowLoginModal: () => {},
    setShowSubscribeModal: () => {},
});

export const AccessProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [haveAccess, setHaveAccess] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [subscribeTo, setSubscribeTo] = useState(null);

    const onLogin = (token) => {
        setIsLoggedIn(true);
        localStorage.setItem('authToken', token);
        void checkAccess();
    };

    const onLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setIsSubscribed(false);
        setHaveAccess(false);
        setSubscribeTo(null);
        window.location.href = "/";
    };

    useEffect(() => {
        if (isLoggedIn && !haveAccess) {
            void transactionsUpdated();
        }
    }, [isLoggedIn]);

    const transactionsUpdated = async () => {
        let access = false;
        try {
            console.log("START")
            const response = await axios.get(`${config.paymentUrl}/api/v1/user-transactions-updated`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            console.log(response)
            if (response.status === 200) {
                await checkAccess();
            }
        } catch (error) {
            console.log("Failed to check subscription status: ", error);
        }
        return access;
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            checkTokenValidity(token).then(isValid => {
                if (isValid) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    localStorage.removeItem('authToken');
                }
            });
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            const intervalId = setInterval(() => {
                void checkAccess();
            }, 3600000);

            return () => clearInterval(intervalId);
        }
    }, [isLoggedIn]);

    const unSubscribe = async () => {
        const authToken = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${config.paymentUrl}/api/v1/unsubscribe`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.status === 200) {
                await checkAccess();
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const checkAccess = async () => {
        const authToken = localStorage.getItem('authToken');
        try {
            const response = await axios.get(`${config.paymentUrl}/api/v1/check-access`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.status === 200) {
                console.log("response.data", response.data)
                setIsSubscribed(response.data.subscribe);
                setHaveAccess(response.data.success);
                setSubscribeTo(response.data.access_to);
            }
        } catch (error) {
            // Обработка ошибки при выполнении запроса
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const checkTokenValidity = async (authToken) => {
        try {
            const response = await axios.post(`${config.authorizationUrl}/api/v1/check-token-validity`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.data.success) {
                return true;
            } else {
                onLogout()
                console.log('Token is not valid');
                return false;
            }
        } catch (error) {
            onLogout()
            console.error('Error checking token validity:', error);
            return false;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <AccessContext.Provider value={{
            isLoggedIn,
            haveAccess,
            isSubscribed,
            showLoginModal,
            showSubscribeModal,
            subscribeTo,
            onLogin,
            onLogout,
            setSubscribeTo,
            setShowLoginModal,
            setShowSubscribeModal,
            unSubscribe,
            checkAccess,
            transactionsUpdated,
            checkTokenValidity
        }}>
            {children}
        </AccessContext.Provider>
    );
};