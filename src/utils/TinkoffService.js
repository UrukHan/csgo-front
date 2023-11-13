import axios from 'axios';
import config from './config.json';

class TinkoffService {
    constructor() {
    }


    async sendClosingReceipt(terminalKey, paymentId, receiptData) {
        const requestData = {
            TerminalKey: terminalKey,
            PaymentId: paymentId,
            Receipt: receiptData,
        };

        try {
            // Отправляем данные на бэкэнд
            const response = await axios.post(`${config.authorizationUrl}/api/v1/send_closing_receipt`, requestData);
            return response.data.token;
        } catch (error) {
            // Обработка ошибки
            console.error('Ошибка при вызове API:', error);
            throw error;
        }
    }

    async init(terminalKey, orderId, amount, description, data, receipt) {
        const requestData = {
            TerminalKey: terminalKey,
            Amount: amount,
            OrderId: orderId,
            Description: description,
            DATA: data,
            Receipt: receipt,
        };

        try {
            const response = await axios.post('https://securepay.tinkoff.ru/v2/Init', requestData);
            return response.data;
        } catch (error) {
            // обработка ошибки
            console.error('Ошибка при вызове API:', error);
            throw error;
        }
    }

    async confirm(terminalKey, paymentId, amount, token) {
        const requestData = {
            TerminalKey: terminalKey,
            PaymentId: paymentId,
            Amount: amount,
            Token: token,
        };

        try {
            const response = await axios.post('https://securepay.tinkoff.ru/v2/Confirm', requestData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при вызове API:', error);
            throw error;
        }
    }

    async getState(terminalKey, paymentId, token) {
        const requestData = {
            TerminalKey: terminalKey,
            PaymentId: paymentId,
            Token: token,
        };

        try {
            const response = await axios.post('https://securepay.tinkoff.ru/v2/GetState', requestData);
            return response.data;
        } catch (error) {
            // обработка ошибки
            console.error('Ошибка при вызове API:', error);
            throw error;
        }
    }

    async submit3DSAuthorization(terminalKey, md, paRes, paymentId, token) {
        const requestData = {
            MD: md,
            PaRes: paRes,
            PaymentId: paymentId,
            Token: token,
            TerminalKey: terminalKey,
        };

        try {
            const response = await axios.post('https://securepay.tinkoff.ru/v2/Submit3DSAuthorization', requestData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            return response.data;
        } catch (error) {
            // обработка ошибки
            console.error('Ошибка при вызове API:', error);
            throw error;
        }
    }

    async checkOrder(terminalKey, orderId, token) {
        const requestData = {
            TerminalKey: terminalKey,
            OrderId: orderId,
            Token: token,
        };

        try {
            const response = await axios.post('https://securepay.tinkoff.ru/v2/CheckOrder', requestData);
            return response.data;
        } catch (error) {
            // обработка ошибки
            console.error('Ошибка при вызове API:', error);
            throw error;
        }
    }

    async finishAuthorize(terminalKey, paymentId, cardData, amount, data, token) {
        const requestData = {
            PaymentId: paymentId,
            CardData: cardData,
            Amount: amount,
            DATA: data,
            TerminalKey: terminalKey,
            Token: token,
        };

        try {
            const response = await axios.post('https://securepay.tinkoff.ru/v2/FinishAuthorize', requestData);
            return response.data;
        } catch (error) {
            // обработка ошибки
            console.error('Ошибка при вызове API:', error);
            throw error;
        }
    }

    async cancel(terminalKey, paymentId, amount, token) {
        const requestData = {
            TerminalKey: terminalKey,
            PaymentId: paymentId,
            Amount: amount,
            Token: token,
        };

        try {
            const response = await axios.post('https://securepay.tinkoff.ru/v2/Cancel', requestData);
            return response.data;
        } catch (error) {
            // обработка ошибки
            console.error('Ошибка при вызове API:', error);
            throw error;
        }
    }

    async resend(terminalKey, token) {
        const requestData = {
            TerminalKey: terminalKey,
            Token: token,
        };

        try {
            const response = await axios.post('https://securepay.tinkoff.ru/v2/Resend', requestData);
            return response.data;
        } catch (error) {
            // обработка ошибки
            console.error('Ошибка при вызове API:', error);
            throw error;
        }
    }

    async sendClosingReceipt(terminalKey, paymentId, receiptData, token) {
        const requestData = {
            TerminalKey: terminalKey,
            PaymentId: paymentId,
            Token: token,
            Receipt: receiptData,
        };

        try {
            const response = await axios.post('https://securepay.tinkoff.ru/cashbox/SendClosingReceipt/', requestData);
            return response.data;
        } catch (error) {
            // обработка ошибки
            console.error('Ошибка при вызове API:', error);
            throw error;
        }
    }
}

export default new TinkoffService();