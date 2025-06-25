const axios = require('axios');

module.exports = function(app) {
    // Fake NGL
    app.get('/ai/ngl', async (req, res) => {
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
            res.status(500).json({ status: false, error: 'Failed to generate NGL image' });
        }
    });

    // Fake TikTok
    app.get('/tools/faketiktok', async (req, res) => {
        try {
            const { name, username, pp } = req.query;
            if (!name || !username || !pp) {
                return res.status(400).json({ status: false, error: 'Name, username, and pp (profile picture URL) are required' });
            }

            const url = `https://flowfalcon.dpdns.org/imagecreator/faketiktok?name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&pp=${encodeURIComponent(pp)}`;
            const response = await axios.get(url, { responseType: 'arraybuffer' });

            res.setHeader('Content-Type', 'image/png');
            res.send(response.data);
        } catch (error) {
            res.status(500).json({ status: false, error: 'Failed to generate Fake TikTok image' });
        }
    });
};
