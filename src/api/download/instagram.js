const axios = require('axios');
const { URLSearchParams } = require('url'); // URLSearchParams sudah built-in, tapi bisa diimpor untuk kejelasan

/**
 * Mengambil data post Instagram menggunakan Snapins.ai.
 * @param {string} urlIgPost - URL postingan Instagram.
 * @returns {Promise<object>} Objek berisi informasi postingan.
 */
async function fetchInstagramDataFromSnapins(urlIgPost) {
    const apiUrl = "https://snapins.ai/action.php";
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36", // User agent umum
        "Origin": "https://snapins.ai",
        "Referer": "https://snapins.ai/"
    };

    // Membuat body dengan format x-www-form-urlencoded
    const bodyParams = new URLSearchParams();
    bodyParams.append('url', urlIgPost);

    try {
        const response = await axios.post(apiUrl, bodyParams.toString(), { headers, timeout: 20000 });
        
        // axios akan error untuk status non-2xx, jadi tidak perlu cek response.ok
        const json = response.data; // axios otomatis parse JSON

        // Validasi respons dari Snapins.ai
        if (!json || json.status === 'error' || !json.data || !Array.isArray(json.data) || json.data.length === 0) {
            throw new Error(json.message || 'Respons dari Snapins.ai tidak valid atau tidak ada data.');
        }
        
        // Informasi author biasanya ada di item pertama jika postingan adalah carousel
        const firstItem = json.data[0];
        const name = firstItem.author?.name || "(no name)";
        const username = firstItem.author?.username || "(no username)";
        
        let images = [];
        let videos = [];

        json.data.forEach(item => {
            if (item.type === "image" && item.imageUrl) {
                images.push(item.imageUrl);
            } else if (item.type === "video" && item.videoUrl) {
                videos.push(item.videoUrl);
            }
        });

        return { name, username, images, videos };

    } catch (error) {
        console.error("Snapins API Error:", error.response?.data || error.message);
        // Jika error sudah memiliki pesan dari Snapins, gunakan itu
        if (error.response?.data?.message) {
            throw new Error(`Snapins.ai: ${error.response.data.message}`);
        }
        throw new Error(`Gagal mengambil data Instagram via Snapins: ${error.message}`);
    }
}

// --- Rute Express ---
module.exports = function (app) {
  const creatorName = "RyuuXiao";

  app.get('/download/instagram', async (req, res) => {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        creator: creatorName,
        message: 'Parameter url (link Instagram post) wajib diisi.'
      });
    }

    // Validasi sederhana untuk URL Instagram
    if (!url.includes("instagram.com/p/") && !url.includes("instagram.com/reel/") && !url.includes("instagram.com/tv/")) {
        return res.status(400).json({
            status: false,
            creator: creatorName,
            message: 'Harap masukkan URL postingan Instagram yang valid.'
        });
    }

    try {
      const result = await fetchInstagramDataFromSnapins(url);
      res.json({
        status: true,
        creator: creatorName,
        result: result
      });
    } catch (error) {
      console.error("Instagram Downloader Endpoint Error:", error.message, error.stack);
      // Jika error spesifik dari Snapins, mungkin status 422 atau 400 lebih cocok
      const statusCode = error.message.startsWith("Snapins.ai:") ? 422 : 500;
      res.status(statusCode).json({
        status: false,
        creator: creatorName,
        message: error.message || 'Gagal memproses permintaan download Instagram.'
      });
    }
  });

  // Tambahkan rute lain di sini...
};
