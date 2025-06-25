const axios = require('axios');

module.exports = function(app) {
    async function fetchChatGPTTurboResponse(message) {
        try {
            const response = await axios.get(`https://apiim-rerezz.vercel.app/api/gptturbo?message=${encodeURIComponent(message)}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching response from GPT Turbo:", error);
            throw error;
        }
    }

    app.get('/ai/gptturbo', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) {
                return res.status(400).json({ status: false, error: 'Text is required' });
            }

            const result = await fetchChatGPTTurboResponse(text);

            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
