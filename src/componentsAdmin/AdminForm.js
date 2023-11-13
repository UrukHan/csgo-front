import React, { useState } from 'react';
import axios from 'axios';
import config from '../utils/config.json';
import styles from "./AdminForm.module.css";

function AdminForm({ onConfirm }) {
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!awaitingConfirmation) {
                const response = await axios.post(`${config.authorizationUrl}/api/v1/admin_password`, {
                    password: password
                });
                if (response.status === 200) {
                    setAwaitingConfirmation(true);
                } else {
                    setError('Неправильный пароль');
                }
            } else {
                // second step - submit confirmation code
                const response = await axios.post(`${config.authorizationUrl}/api/v1/admin_code`, {
                    token: token
                });
                if (response.data.token) {
                    onConfirm(response.data.token);
                } else {
                    setError('Неправильный код подтверждения');
                }
            }
        } catch (error) {
            console.error('Ошибка при входе', error);
            setError('Произошла ошибка при отправке данных');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['admin-modal']}>
            <div className={styles['admin-modal-content']}>
                <form onSubmit={handleSubmit}>
                    {!awaitingConfirmation ?
                        (<>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль"
                            />
                            <button
                                type="submit"
                                className={`${styles['send-pass-button']}`}
                                disabled={loading}
                            >
                                SEND DATA
                            </button>
                        </>) :
                        (<>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Введите код подтверждения"
                            />
                            <button
                                type="submit"
                                className={`${styles['send-pass-button']}`}
                                disabled={loading}
                            >
                                SEND DATA
                            </button>
                        </>)}
                    {loading && <div>Загрузка...</div>}
                    {error && <div>{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default AdminForm;