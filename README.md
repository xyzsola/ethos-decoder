# EVM Transaction Decoder Bot

Bot Telegram ini secara otomatis memantau alamat wallet Ethereum, men-decode data input dari transaksi terakhir, dan mengirimkan hasilnya sebagai notifikasi jika ada data baru yang ditemukan.

## Fitur

- **Pemantauan Otomatis**: Memeriksa transaksi baru setiap menit.
- **Decode Dua Langkah**: Melakukan decode dari hex ke UTF-8, lalu dari hex lagi ke string akhir.
- **Notifikasi Telegram**: Mengirimkan hasil decode baru ke semua pengguna yang terdaftar.
- **Pencegahan Duplikat**: Hanya mengirim notifikasi untuk hasil decode yang belum pernah dikirim sebelumnya.
- **Pendaftaran Pengguna**: Pengguna dapat mendaftar untuk menerima notifikasi menggunakan perintah `/eth_os_scan`.

## Persyaratan

- [Node.js](https://nodejs.org/) (versi 12.x atau lebih baru)
- NPM (biasanya terinstal bersama Node.js)

## Instalasi

1.  Clone repositori ini atau unduh file proyek.
2.  Buka terminal di direktori proyek.
3.  Instal semua dependensi yang diperlukan dengan menjalankan:
    ```bash
    npm install
    ```

## Konfigurasi

Aplikasi ini menggunakan file `.env` untuk menyimpan variabel penting dan rahasia.

1.  Buat sebuah file baru dengan nama `.env` di direktori utama proyek.
2.  Salin dan tempel format berikut ke dalam file `.env` Anda, lalu isi nilainya:

    ```env
    # API Key dari Etherscan.io
ETHERSCAN_API_KEY=MASUKKAN_API_KEY_ANDA

# Token bot dari @BotFather di Telegram
TELEGRAM_TOKEN=MASUKKAN_TOKEN_ANDA

# evm address
EVM_ADDRESS=0x9B8DbF1107ABd4e103ae636f7CD7e1bE53A343d3

# Time interval for checking (second)
CHECK_INTERVAL=60
    ```

3.  Selain itu, Anda juga bisa mengubah alamat wallet yang ingin dipantau. Buka file `decoder.js` dan ubah nilai variabel `walletAddress`.

## Penggunaan

Untuk menjalankan bot, gunakan perintah berikut di terminal:

```bash
node app.js
```

Bot akan mulai berjalan, memeriksa transaksi setiap menit, dan mendengarkan pengguna baru.

**Interaksi dengan Bot:**

-   Kirim perintah `/eth_os_scan` ke bot Anda di Telegram untuk mendaftar dan mulai menerima notifikasi otomatis.
