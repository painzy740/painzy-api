const axios = require('axios');

module.exports = function(app) {
    // Endpoint untuk Fake NGL
    app.get('/tools/ngl', async (req, res) => {
        try {
            const { title, text } = req.query;
            if (!title || !text) {
                return res.status(400).json({ status: false, error: 'Title and text are required' });
            }

            const url = `https://flowfalcon.dpdns.org/imagecreator/ngl?title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}`;
            const response = await axios.get(url, { responseType: 'arraybuffer' });

            res.setHeader('Content-Type', 'image/png');
            res.send(response.data);
        } catch (error) {
            console.error("Error generating NGL image:", error);
            res.status(500).json({ status: false, error: 'Failed to generate image' });
        }
    });
};
