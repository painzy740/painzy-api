const fetch = require("node-fetch");

module.exports = function(app) {
  app.get('/sticker/brat', async (req, res) => {
    try {
      const { apikey, text } = req.query;
      if (!global.apikey.includes(apikey)) return res.status(403).send('Invalid API key');
      if (!text) return res.status(400).send('Text is required');

      const url = `https://vapis.my.id/api/bratv1?q=${encodeURIComponent(text)}`;
      const response = await fetch(url);

      if (!response.ok) return res.status(502).send('Failed to fetch image from API');

      const buffer = await response.buffer();

      res.set('Content-Type', 'image/png');  // Pastikan respons dalam bentuk PNG
      res.send(buffer);
    } catch (err) {
      res.status(500).send(`Error: ${err.message}`);
    }
  });
};
