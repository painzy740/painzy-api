const axios = require('axios');

module.exports = function(app) {
    async function blackboxAI({ text, imageUrl = '', sessionid = '' }) {
        try {
            const url = `https://api.nekorinn.my.id/ai/blackbox?text=${encodeURIComponent(text)}&imageUrl=${encodeURIComponent(imageUrl)}&sessionid=${encodeURIComponent(sessionid)}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Blackbox AI Error:', error.message);
            throw new Error('Failed to connect to Blackbox AI API');
        }
    }

    app.get('/ai/blackbox', async (req, res) => {
        const { text, imageUrl, sessionid } = req.query;

        if (!text) {
            return res.status(400).json({
                status: false,
                message: 'Parameter "text" is required'
            });
        }

        try {
            const result = await blackboxAI({ text, imageUrl, sessionid });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    });
};
