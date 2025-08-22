require('dotenv').config();
const { bot, readChatIds } = require('./bot.js');
const { getLatestDecodedResult, readHistory, appendToHistory } = require('./decoder.js');

const CHECK_INTERVAL_MS = process.env.CHECK_INTERVAL * 1000; // 1 menit

console.log('Aplikasi utama dimulai.');
console.log('Bot sedang polling untuk pengguna baru...');

async function checkForNewResultAndBroadcast() {
    console.log('\n----------------------------------');
    console.log(`[${new Date().toISOString()}] Menjalankan pengecekan...`);

    const result = await getLatestDecodedResult();

    if (!result) {
        console.log('Tidak ada hasil decode yang valid saat ini.');
        return;
    }

    const history = readHistory();
    if (history.includes(result)) {
        console.log(`Hasil decode sudah ada di history, tidak ada yang dikirim: "${result}"`);
    } else {
        console.log(`✨ Ditemukan hasil decode BARU: "${result}"`);
        appendToHistory(result);
        console.log('Hasil baru disimpan ke history.');

        // ambil semua chat id yang terdaftar
        // lalu kirim message ke semuanya
        const chatIds = readChatIds();
        if (chatIds.length > 0) {
            console.log(`Mengirim ke ${chatIds.length} pengguna...`);
            const message = `✨ ada decode baru! \n\ntapi belum tentu ini kodenya. kalau ngerasa ini kode, coba klaim di https://ethos.vision/

Hasil Decode:\n\`${result}\`\n\nKalau berhasil, bagi yak wkwkwk.`;
            chatIds.forEach(id => {
                bot.sendMessage(id, message, { parse_mode: 'Markdown' }).catch(err => {
                    console.error(`Gagal mengirim ke ${id}:`, err.message);
                });
            });
        } else {
            console.log('Tidak ada pengguna terdaftar untuk dikirimi pesan.');
        }
    }
}

// Jalankan pengecekan setiap 1 menit
setInterval(checkForNewResultAndBroadcast, CHECK_INTERVAL_MS);

// Jalankan pengecekan pertama kali saat start
console.log('Menjalankan pengecekan pertama kali...');
checkForNewResultAndBroadcast();
