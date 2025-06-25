const fetch = require("node-fetch")
const axios = require("axios")

const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}


module.exports = function(app) {
app.get('/tools/emojimix', async (req, res) => {
const { emoji1, emoji2 } = req.query
const { apikey } = req.query;
if (!global.apikey.includes(apikey)) return res.status(400).json({ status: false, error: 'Apikey invalid' })
if (!emoji1 || !emoji2) return res.status(400).json({ status: false, error: 'Emoji is required' });
let img = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`).then(resd => resd.json()).then(resu => resu.results[0].url)
const image = await getBuffer(img)
        try {
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': image.length,
            });
            res.end(image);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
});
}
