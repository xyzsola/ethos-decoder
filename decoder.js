const axios = require('axios');
const { ethers } = require('ethers');
const fs = require('fs');

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const walletAddress = process.env.EVM_ADDRESS;
const historyFilePath = './decoded_results.log';

// Fungsi untuk membaca history
const readHistory = () => {
    if (!fs.existsSync(historyFilePath)) return [];
    const data = fs.readFileSync(historyFilePath, 'utf8');
    return data.split('\n').filter(line => line.length > 0);
};

// Fungsi untuk menambah hasil ke history
const appendToHistory = (result) => {
    fs.appendFileSync(historyFilePath, result + '\n', 'utf8');
};

async function getLatestDecodedResult() {
    const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&page=1&offset=1&apikey=${ETHERSCAN_API_KEY}`;
    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === '1' && response.data.result.length > 0) {
            // hanya ambil tx terakhir
            const latestTx = response.data.result[0];
            // ambil nama fungsinya
            const functionName = latestTx.functionName || '';

            // Hanya proses jika methodnya adalah 'transfer'
            if (!functionName.toLowerCase().includes('transfer')) {
                console.log(`Metode transaksi bukan 'transfer' (${functionName}), skip!`);
                return null;
            }

            // ambil input data dari transaksi terakhir
            const inputData = latestTx.input;
            if (inputData && inputData !== '0x') {
                try {
                    // Coba decode langsung dari hex ke UTF-8
                    const decoded = ethers.toUtf8String(inputData);
                    return decoded;
                } catch (e) {
                    // Jika input data bukan string UTF-8 yang valid, ethers.js akan error.
                    // Kita tangkap errornya dan kembalikan null agar tidak crash.
                    // Pesan error sengaja tidak ditampilkan agar tidak memenuhi log.
                    return null;
                }
            }
        }
        return null; // No result or no input data
    } catch (error) {
        console.error('Kesalahan pada Decoder:', error.message);
        return null;
    }
}

module.exports = { getLatestDecodedResult, readHistory, appendToHistory };
