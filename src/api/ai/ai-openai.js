const axios = require('axios');

module.exports = function(app) {
    async function openAI({ text }) {
        try {
            const url = `https://api.nekorinn.my.id/ai/openai?text=${encodeURIComponent(text)}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('OpenAI API Error:', error.message);
            throw new Error('Failed to connect to OpenAI API');
        }
    }

    app.get('/ai/openai', async (req, res) => {
        const { text } = req.query;

        if (!text) {
            return res.status(400).json({
                status: false,
                message: 'Parameter "text" is required'
            });
        }

        try {
            const result = await openAI({ text });
            res.status(200).json({
                ...result,
                creator: "RyuuXiao"
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    });
};
