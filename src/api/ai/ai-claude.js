const axios = require('axios');

module.exports = (app) => {
    const creatorName = "ZenzzXD"; // Nama creator Anda

    app.get('/ai/claude', async (req, res) => { // Path baru, misalnya /ai/claude-yogik
        const { text } = req.query; // Menggunakan 'text' sesuai API target

        // Validasi input
        if (!text) {
            return res.status(400).json({
                status: false,
                creator: creatorName,
                message: 'Parameter "text" wajib diisi'
            });
        }

        try {
            const apiUrl = `https://api.yogik.id/ai/claudeai?text=${encodeURIComponent(text)}`;
            console.log(`Requesting Yogik ClaudeAI from: ${apiUrl}`); // Logging

            // Panggil API eksternal Yogik.id
            const response = await axios.get(apiUrl, {
                headers: {
                    // User-Agent standar, bisa disesuaikan jika API target memerlukan yang spesifik
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
                },
                timeout: 45000 // Timeout 45 detik untuk respons AI
            });

            const externalApiResponse = response.data;

            // Olah respons dari API eksternal
            if (externalApiResponse && typeof externalApiResponse.status === 'boolean' && typeof externalApiResponse.answer !== 'undefined') {
                // Jika API eksternal sukses (atau gagal dengan format yang benar)
                res.json({
                    status: externalApiResponse.status, // Ambil status dari API eksternal
                    creator: creatorName,              // Gunakan creator Anda
                    answer: externalApiResponse.answer // Ambil jawaban dari API eksternal
                    // Jika API Yogik juga mengembalikan 'result', Anda bisa memilih mau meneruskan 'answer' atau 'result.answer'
                });
            } else {
                // Jika struktur respons API eksternal tidak seperti yang diharapkan
                console.warn("Struktur respons tidak terduga dari Yogik ClaudeAI:", externalApiResponse);
                res.status(502).json({ // 502 Bad Gateway
                    status: false,
                    creator: creatorName,
                    message: 'Respons tidak terduga dari API eksternal Yogik ClaudeAI.',
                    data_received: externalApiResponse // Sertakan data yang diterima untuk debugging
                });
            }

        } catch (err) {
            console.error("Yogik ClaudeAI Proxy Error:", err.response?.data || err.message, err.stack);

            const statusCode = err.response?.status || 500;
            // Jika API eksternal memberikan pesan error dalam format JSON, coba gunakan itu
            let message = err.response?.data?.message || err.message || 'Gagal mengambil data dari API Yogik ClaudeAI.';
            if (err.response?.data && typeof err.response.data === 'object' && err.response.data.answer) {
                // Jika API yogik mengembalikan error tapi dengan field answer
                message = err.response.data.answer;
            }


            // Kirim respons error
            res.status(statusCode).json({
                status: false,
                creator: creatorName,
                message: message
            });
        }
    });

    // Tambahkan rute lain di sini...
};
