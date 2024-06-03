
import Web3 from 'web3';
import config from "../utils/config.json";
import abiPoligonUSDT from "../utils/abiPoligonUSDT.json";
import abiPoligonUSDC from "../utils/abiPoligonUSDC.json";
import bigInt from 'big-integer';
import axios from "axios";
import {useTranslation} from "react-i18next";

export default function useSubscribeMethods(setPaymentStatus, paymentCrypto, transactionsUpdated, onClose, onCloseParent) {

    const { t } = useTranslation();
    const isProd = window.REACT_APP_PROD === 'true';

    const networksEVM = isProd ? {
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
    } : {
        'USDT polygon': {
            chainId: '0x13881',
            chainName: 'Mumbai Testnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://rpc-mainnet.matic.network'],
            blockExplorerUrls: ['https://explorer.matic.network/']
        },
        'USDC polygon': {
            chainId: '0x13881',
            chainName: 'Mumbai Testnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://rpc-mainnet.matic.network'],
            blockExplorerUrls: ['https://explorer.matic.network/']
        },
        'USDT binance': {
            chainId: '0x61',
            chainName: 'Binance Smart Chain Testnet',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            blockExplorerUrls: ['https://testnet.bscscan.com']
        },
        'USDC binance': {
            chainId: '0x61',
            chainName: 'Binance Smart Chain Testnet',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            blockExplorerUrls: ['https://testnet.bscscan.com']
        }
    };

    const solanaSubscribe = () => {
        if (window.solana.isPhantom) {
            let solana = window.solana;
        } else {
            setPaymentStatus(t('status-e'));
            return;
        }
    }

    const evmSubscribe = async () => {
        setPaymentStatus(t('status-m'));
        let web3;
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (error) {
                console.error("User denied account access");
            }
        } else if (window.web3) {
            web3 = window.web3;
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            return;
        }

        const accounts = await web3.eth.getAccounts();

        if (!accounts || accounts.length === 0) {
            console.log('No accounts available');
            return;
        }

        const network = networksEVM[paymentCrypto];
        console.log("networksEVM")
        console.log(network)
        if (network) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: network.chainId }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [network],
                        });
                    } catch (addError) {
                        console.error(addError);
                    }
                } else {
                    console.error(switchError);
                }
            }
        }

        const networkId = Number(await web3.eth.net.getId());
        console.log("networkId: ", networkId)
        let contractAddress;
        let usdtContractAddress;
        let usdcContractAddress;
        switch(networkId) {
            case 56:
                contractAddress = config.contractBinance;
                usdtContractAddress = config.USDTBinance;
                usdcContractAddress = config.USDCBinance;
                break;
            case 97:
                contractAddress = config.contractBinanceTest;
                usdtContractAddress = config.USDTBinanceTest;
                usdcContractAddress = config.USDCBinanceTest;
                break;
            case 137:
                contractAddress = config.contractPolygon;
                usdtContractAddress = config.USDTPolygon;
                usdcContractAddress = config.USDCPolygon;
                break;
            case 80001:
                contractAddress = config.contractMumbai;
                usdtContractAddress = config.USDTMumbai;
                usdcContractAddress = config.USDCMumbai;
                break;
            default:
                setPaymentStatus(t('status-h'))
                return;
        }

        const usdtContract = new web3.eth.Contract(abiPoligonUSDT, usdtContractAddress);
        const usdcContract = new web3.eth.Contract(abiPoligonUSDC, usdcContractAddress);

        let approveAmount = bigInt(config.approveAmount).multiply(bigInt(10).pow(network.nativeCurrency.decimals)).toString();

        let transactionHash;

        web3.eth.getGasPrice().then(async (averageGasPrice) => {
            const adjustedGasPrice = bigInt(averageGasPrice).multiply(bigInt(110)).divide(bigInt(100)).toString();

            const options = {
                from: accounts[0],
                gasPrice: adjustedGasPrice
            };

            try {
                if (paymentCrypto.includes('USDT')) {
                    let transaction = await usdtContract.methods.approve(contractAddress, approveAmount).send(options);
                    transactionHash = transaction.transactionHash;
                } else if (paymentCrypto.includes('USDC')) {
                    let transaction = await usdcContract.methods.approve(contractAddress, approveAmount).send(options);
                    transactionHash = transaction.transactionHash;
                } else {
                    setPaymentStatus(t('status-j'))
                    return;
                }
            } catch (error) {
                console.error('Failed to approve', error);
                return;
            }

            const authToken = localStorage.getItem('authToken');
            try {
                const response = await axios.post(`${config.paymentUrl}/api/v1/subscribe-crypto`,
                    {
                        payment_method: paymentCrypto,
                        transaction_hash: transactionHash,
                        user_address: accounts[0]
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        }
                    }
                );
                console.log("response.data")
                console.log(response.data)
                if (response.data.success) {
                    setPaymentStatus(t('status-k'));
                    setTimeout(() => {
                        transactionsUpdated()
                    }, 5000);
                    setTimeout(() => {
                        onClose();
                        onCloseParent();
                    }, 5000);
                } else {
                    setPaymentStatus('Subscription failed');
                }
            } catch (error) {
                console.error('Error confirming subscription:', error);
                setPaymentStatus(t('status-l'));
            }

        }).catch(console.error);

    }

    return { solanaSubscribe, evmSubscribe };
}