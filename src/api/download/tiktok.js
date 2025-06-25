const axios = require('axios');

module.exports = (app) => {
    const creatorName = "RyuuXiao"; // Nama creator Anda

    app.get('/download/tiktok', async (req, res) => {
        const { url } = req.query; // Menggunakan 'url' sudah benar

        // Validasi input
        if (!url) {
            return res.status(400).json({
                status: false,
                creator: creatorName, // Ditambahkan
                message: 'Parameter url wajib diisi'
            });
        }

        try {
            const apiUrl = `https://zenzzx-api.vercel.app/downloader/tiktok?url=${encodeURIComponent(url)}`;
            console.log(`Requesting TikTok data from: ${apiUrl}`); // Logging

            // Panggil API eksternal Anda
            const response = await axios.get(apiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0' // User-Agent standar
                },
                timeout: 30000 // Timeout 30 detik
            });

            // Asumsikan response.data dari API eksternal Anda memiliki struktur
            // seperti { status: true/false, creator: '...', result: {...} }
            // atau setidaknya memiliki field 'result' jika sukses.

            if (response.data && response.data.status === true && typeof response.data.result !== 'undefined') {
                // Jika API eksternal sukses dan memiliki 'result'
                res.json({
                    status: true,
                    creator: creatorName,       // Creator Anda
                    result: response.data.result // Ambil 'result' dari API eksternal
                });
            } else if (response.data && response.data.status === false) {
                // Jika API eksternal mengembalikan status error
                res.status(400).json({ // Atau status lain yang sesuai
                    status: false,
                    creator: creatorName,
                    message: response.data.message || 'API eksternal TikTok mengembalikan error.'
                });
            } else {
                // Jika struktur respons API eksternal tidak seperti yang diharapkan
                // tapi bukan error dari axios, kita teruskan saja apa adanya
                // di dalam result kita untuk penyelidikan.
                console.warn("Struktur respons tidak terduga dari API eksternal TikTok:", response.data);
                res.json({
                    status: true, // Anggap sukses karena ada data, meski aneh
                    creator: creatorName,
                    result: response.data
                });
            }

        } catch (err) {
            console.error("TikTok Downloader Error (axios):", err.response?.data || err.message); // Logging

            const statusCode = err.response?.status || 500;
            const message = err.response?.data?.message || err.message || 'Gagal mengambil data dari API TikTok';

            // Kirim respons error
            res.status(statusCode).json({
                status: false,
                creator: creatorName, // Ditambahkan
                message: message
            });
        }
    });

    // Tambahkan rute lain di sini...
};
