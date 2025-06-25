const axios = require('axios');

module.exports = function(app) {
  app.get('/tools/removebg', async (req, res) => {
    const { imageUrl } = req.query;

    if (!imageUrl) {
      return res.status(400).json({
        status: false,
        message: 'Parameter "imageUrl" wajib diisi'
      });
    }

    try {
      const apiUrl = `https://api.nekorinn.my.id/tools/removebg?imageUrl=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiUrl);

      // Ambil hasil dari response & ganti creator
      const { status, statusCode, result } = response.data;

      res.status(200).json({
        status,
        statusCode,
        creator: 'RyuuXiao',
        result
      });

    } catch (error) {
      console.error('RemoveBG Error:', error.message);
      res.status(500).json({
        status: false,
        message: 'Gagal memproses gambar. Pastikan URL valid.'
      });
    }
  });
};
