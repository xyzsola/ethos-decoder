const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const telegramToken = process.env.TELEGRAM_TOKEN;
const chatIdsFilePath = './chat_ids.json';

const bot = new TelegramBot(telegramToken, { polling: true });

const readChatIds = () => {
    try {
        if (fs.existsSync(chatIdsFilePath)) {
            return JSON.parse(fs.readFileSync(chatIdsFilePath, 'utf8'));
        }
        return [];
    } catch (error) {
        console.error('Gagal membaca chat_ids.json:', error);
        return [];
    }
};

const saveChatId = (chatId) => {
    const chatIds = readChatIds();
    if (!chatIds.includes(chatId)) {
        chatIds.push(chatId);
        fs.writeFileSync(chatIdsFilePath, JSON.stringify(chatIds, null, 2));
        console.log(`Chat ID baru disimpan: ${chatId}`);
        return true; // Indicates new user
    }
    return false; // Existing user
};

bot.onText(/\/eth_os_scan/, (msg) => {
    const chatId = msg.chat.id;
    const isNewUser = saveChatId(chatId);
    if (isNewUser) {
        bot.sendMessage(chatId, '✅ Anda telah terdaftar! Saya akan mengirimi Anda pembaruan secara otomatis jika ada hasil decode baru.');
    } else {
        bot.sendMessage(chatId, 'ℹ️ Anda sudah terdaftar. Mohon tunggu pembaruan otomatis.');
    }
});

bot.on('message', (msg) => {
    if (msg.text && /^\/eth_os_scan/.test(msg.text)) return; // Already handled
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Perintah tidak dikenal. Gunakan /eth_os_scan untuk mendaftar dan menerima pembaruan otomatis.');
});

console.log('Modul Bot Telegram siap.');

module.exports = { bot, readChatIds };
