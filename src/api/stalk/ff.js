// stalk-ff.js
const axios = require('axios');

module.exports = function(app) {
  app.get('/stalk/ff', async (req, res) => {
    const { id } = req.query;

    // Validasi input
    if (!id) {
      return res.status(400).json({
        status: false,
        error: 'Parameter id wajib diisi.'
      });
    }

    try {
      const apiUrl = `https://api.nekorinn.my.id/stalk/free-fire?uid=${encodeURIComponent(id)}`;
      const response = await axios.get(apiUrl);

      const data = response.data;

      if (data && data.status && data.result) {
        // Kirimkan hasil sesuai struktur API baru
        return res.status(200).json({
          status: true,
          result: {
            username: data.result.username,
            user_id: data.result.user_id
          }
        });
      } else {
        return res.status(404).json({
          status: false,
          error: 'Data tidak ditemukan.'
        });
      }
    } catch (error) {
      console.error("Error fetching Free Fire stalk data:", error.message);
      return res.status(500).json({
        status: false,
        error: 'Terjadi kesalahan pada server.'
      });
    }
  });
};
