import { useState } from 'react';
// import Web3 from 'web3';
import config from "../utils/config.json";
import abiPay from "../utils/abiPay.json";
import abiUSDT from "../utils/abiUSDT.json";
import axios from "axios";

export default function usePaymentMethods(setPaymentStatus, paymentCrypto, transactionsUpdated, onClose, onCloseParent) {

    const networksEVM = {
        // 'USDT polygon': {
        //     chainId: '0x13881',
        //     chainName: 'Mumbai Testnet',
        //     nativeCurrency: {
        //         name: 'MATIC',
        //         symbol: 'MATIC',
        //         decimals: 18
        //     },
        //     rpcUrls: ['https://rpc-mainnet.matic.network'],
        //     blockExplorerUrls: ['https://explorer.matic.network/']
        // },
        'USDT polygon': {
            chainId: '0x89',
            chainName: 'Matic Network',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 6
            },
            rpcUrls: ['https://rpc-mainnet.matic.network'],
            blockExplorerUrls: ['https://explorer.matic.network/']
        },
        'USDC polygon': {
            chainId: '0x89',
            chainName: 'Matic Network',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 6
            },
            rpcUrls: ['https://rpc-mainnet.matic.network'],
            blockExplorerUrls: ['https://explorer.matic.network/']
        },
        'USDT binance': {
            chainId: '0x38',
            chainName: 'Binance Smart Chain',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
            },
            rpcUrls: ['https://bsc-dataseed1.binance.org'],
            blockExplorerUrls: ['https://bscscan.com/']
        },
        'USDC binance': {
            chainId: '0x38',
            chainName: 'Binance Smart Chain',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
            },
            rpcUrls: ['https://bsc-dataseed1.binance.org'],
            blockExplorerUrls: ['https://bscscan.com/']
        }
    };

    const solanaPayment = () => {
        if (window.solana.isPhantom) {
            let solana = window.solana;
        } else {
            setPaymentStatus('Выбранный тип оплаты пока не доступен.');
            return;
        }
    }

    const tronPayment = () => {
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
            let tronWeb = window.tronWeb;
        } else {
            setPaymentStatus('Выбранный тип оплаты пока не доступен.');
            return;
        }
    }

    const evmPayment = async () => {
        // setPaymentStatus('Payment processes. Please wait...');
        // let web3;
        // if (window.ethereum) {
        //     web3 = new Web3(window.ethereum);
        //     try {
        //         await window.ethereum.request({ method: 'eth_requestAccounts' });
        //     } catch (error) {
        //         console.error("User denied account access");
        //     }
        // } else if (window.web3) {
        //     web3 = window.web3;
        // } else {
        //     console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        //     return;
        // }
        //
        // const accounts = await web3.eth.getAccounts();
        //
        // if (!accounts || accounts.length === 0) {
        //     console.log('No accounts available');
        //     return;
        // }
        //
        // const network = networksEVM[paymentCrypto];
        // if (network) {
        //     try {
        //         await window.ethereum.request({
        //             method: 'wallet_switchEthereumChain',
        //             params: [{ chainId: network.chainId }],
        //         });
        //     } catch (switchError) {
        //         if (switchError.code === 4902) {
        //             try {
        //                 await window.ethereum.request({
        //                     method: 'wallet_addEthereumChain',
        //                     params: [network],
        //                 });
        //             } catch (addError) {
        //                 console.error(addError);
        //             }
        //         } else {
        //             console.error(switchError);
        //         }
        //     }
        // }
        //
        // const networkId = Number(await web3.eth.net.getId());
        // console.log("networkId: ", networkId)
        // let contractAddress;
        // let usdtContractAddress;
        // let usdcContractAddress;
        // let currency;
        // const amountInWei = web3.utils.toWei(config.price, 'ether');
        // switch(networkId) {
        //     case 137:
        //         contractAddress = config.contractPolygon;
        //         usdtContractAddress = config.USDTPolygon;
        //         usdcContractAddress = config.USDCPolygon;
        //         break;
        //     case 56:
        //         contractAddress = config.contractBinance;
        //         usdtContractAddress = config.USDTBinance;
        //         usdcContractAddress = config.USDCBinance;
        //         break;
        //     case 80001:
        //         contractAddress = config.contractMumbai;
        //         usdtContractAddress = config.USDTMumbai;
        //         usdcContractAddress = config.USDCMumbai;
        //         break;
        //     default:
        //         setPaymentStatus('Выберите другую сеть, доступны BNB или MATIC')
        //         return;
        // }
        //
        // const contract = new web3.eth.Contract(abiPay, contractAddress);
        // const usdtContract = new web3.eth.Contract(abiUSDT, usdtContractAddress);
        // const usdcContract = new web3.eth.Contract(abiUSDT, usdcContractAddress);
        //
        // try {
        //     if (paymentCrypto.includes('USDT')) {
        //         currency = "USDT"
        //         await usdtContract.methods.approve(contractAddress, amountInWei).send({ from: accounts[0] });
        //     } else if (paymentCrypto.includes('USDC')) {
        //         currency = "USDC"
        //         await usdcContract.methods.approve(contractAddress, amountInWei).send({ from: accounts[0] });
        //     } else {
        //         setPaymentStatus('Данная валюта не поддерживается')
        //         return;
        //     }
        // } catch (error) {
        //     console.error('Failed to approve USDT', error);
        //     return;
        // }
        //
        // contract.methods.pay(currency).send({ from: accounts[0] })
        //     .on('transactionHash', async function(hash){
        //
        //         const authToken = localStorage.getItem('authToken');
        //         try {
        //             const response = await axios.post(`${config.authorizationUrl}/api/v1/payment-crypto`,
        //                 {
        //                     payment_method: paymentCrypto,
        //                     transactionHash: hash
        //                 },
        //                 {
        //                     headers: {
        //                         'Content-Type': 'application/json',
        //                         'Authorization': `Bearer ${authToken}`
        //                     }
        //                 }
        //             );
        //             if (response.data.success) {
        //                 setPaymentStatus('Subscription successful. Обновите через 2 минуты');
        //                 setTimeout(() => {
        //                     transactionsUpdated()
        //                     onClose();
        //                     onCloseParent();
        //                 }, 3000);
        //             } else {
        //                 setPaymentStatus('Payment failed');
        //             }
        //         } catch (error) {
        //             console.error('Ошибка при подтверждении оплаты:', error);
        //             setPaymentStatus('Ошибка подтверждения оплаты.');
        //         }
        //     })
        //     .on('error', console.error);
    }

    const evmSubscribe = async () => {
        // setPaymentStatus('Subscription processes. Please wait...');
        // let web3;
        // if (window.ethereum) {
        //     web3 = new Web3(window.ethereum);
        //     try {
        //         await window.ethereum.request({ method: 'eth_requestAccounts' });
        //     } catch (error) {
        //         console.error("User denied account access");
        //     }
        // } else if (window.web3) {
        //     web3 = window.web3;
        // } else {
        //     console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        //     return;
        // }
        //
        // const accounts = await web3.eth.getAccounts();
        //
        // if (!accounts || accounts.length === 0) {
        //     console.log('No accounts available');
        //     return;
        // }
        //
        // const network = networksEVM[paymentCrypto];
        // if (network) {
        //     try {
        //         await window.ethereum.request({
        //             method: 'wallet_switchEthereumChain',
        //             params: [{ chainId: network.chainId }],
        //         });
        //     } catch (switchError) {
        //         if (switchError.code === 4902) {
        //             try {
        //                 await window.ethereum.request({
        //                     method: 'wallet_addEthereumChain',
        //                     params: [network],
        //                 });
        //             } catch (addError) {
        //                 console.error(addError);
        //             }
        //         } else {
        //             console.error(switchError);
        //         }
        //     }
        // }
        //
        // const networkId = Number(await web3.eth.net.getId());
        // console.log("networkId: ", networkId)
        // let contractAddress;
        // let usdtContractAddress;
        // let usdcContractAddress;
        // switch(networkId) {
        //     case 137: // Polygon (Matic) Mainnet
        //         contractAddress = config.contractPolygon;
        //         usdtContractAddress = config.USDTPolygon;
        //         usdcContractAddress = config.USDCPolygon;
        //         break;
        //     case 56: // Binance Smart Chain Mainnet
        //         contractAddress = '0x...';
        //         usdtContractAddress = '0x...';
        //         break;
        //     case 80001: // Mumbai (Polygon Testnet)
        //         contractAddress = config.contractMumbai;
        //         usdtContractAddress = config.USDTMumbai;
        //         usdcContractAddress = config.USDCMumbai;
        //         break;
        //     default:
        //         setPaymentStatus('Выберите другую сеть, доступны BNB или MATIC')
        //         return;
        // }
        //
        // const usdtContract = new web3.eth.Contract(abiUSDT, usdtContractAddress);
        // const usdcContract = new web3.eth.Contract(abiUSDT, usdcContractAddress);
        //
        // let approveAmount = web3.utils.toWei(config.approveAmount, 'ether');
        // let transactionHash;
        //
        // try {
        //     if (paymentCrypto.includes('USDT')) {
        //         let transaction = await usdtContract.methods.approve(contractAddress, approveAmount).send({ from: accounts[0] });
        //         transactionHash = transaction.transactionHash;
        //     } else if (paymentCrypto.includes('USDC')) {
        //         let transaction = await usdcContract.methods.approve(contractAddress, approveAmount).send({ from: accounts[0] });
        //         transactionHash = transaction.transactionHash;
        //     } else {
        //         setPaymentStatus('Данная валюта не поддерживается')
        //         return;
        //     }
        // } catch (error) {
        //     console.error('Failed to approve', error);
        //     return;
        // }
        //
        // // подтверждение (approve) успешно, теперь отправляем запрос на сервер
        // const authToken = localStorage.getItem('authToken');
        // try {
        //     const response = await axios.post(`${config.authorizationUrl}/api/v1/subscribe-crypto`,
        //         {
        //             payment_method: paymentCrypto,
        //             transaction_hash: transactionHash,
        //             user_address: accounts[0]
        //         },
        //         {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': `Bearer ${authToken}`
        //             }
        //         }
        //     );
        //     if (response.data.success) {
        //         setPaymentStatus('Subscription successful. Обновите через 2 минуты');
        //         setTimeout(() => {
        //             transactionsUpdated()
        //         }, 5000);
        //         setTimeout(() => {
        //             onClose();
        //             onCloseParent();
        //         }, 5000);
        //     } else {
        //         setPaymentStatus('Subscription failed');
        //     }
        // } catch (error) {
        //     console.error('Ошибка при подтверждении подписки:', error);
        //     setPaymentStatus('Ошибка подтверждения подписки.');
        // }

    }

    return { evmPayment, tronPayment, solanaPayment, evmSubscribe };
}