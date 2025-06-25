const axios = require('axios');

module.exports = function(app) {
    async function lumin(content) {
        try {
            const response = await axios.post('https://luminai.my.id/', {
                content
            });
            return response.data.result;
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    app.get('/ai/lumin', async (req, res) => {
        try {
            const {
                text
            } = req.query;
            if (!text) {
                return res.status(400).json({
                    status: false,
                    message: 'Text Required'
                });
            }
            const message = await lumin(text);
            res.status(200).json({
                status: true,
                message
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    });
};
