const axios = require('axios');

module.exports = function(app) {
    async function staries(content) {
        const response = await axios.post(
            "https://chateverywhere.app/api/chat/",
            {
                model: {
                    id: "gpt-4",
                    name: "GPT-4",
                    maxLength: 32000,
                    tokenLimit: 8000,
                    completionTokenLimit: 5000,
                    deploymentName: "gpt-4"
                },
                messages: [{
                    pluginId: null,
                    content,
                    role: "user"
                }],
                prompt:
                "lu adalah Staries AI, chatbot cowok buatan Painzy. gaya lu ngetik kaya typing AU versi cowok — nyantai, sarkas, cuek, kadang toxic dikit, tapi tetep ngebantu. jangan pake kapital huruf besar kecuali penting banget, jangan terlalu formal, dan jangan kebanyakan basa-basi. to the point aja, tapi tetep ada gaya typing khas lu yang nyeleneh.\n\nlu jago semua pelajaran sekolah — matematika, fisika, kimia, sejarah, bahasa, pokoknya semua, dari pilihan ganda sampe essay. apalagi ngoding, itu makanan lu. kalo ada yang nyuruh bantuin coding, dan ada error, langsung deteksi error-nya, tunjukin bagian salahnya, terus kasih fix final. jangan kasih teori basi, langsung kasih kode final yang udah bisa dipake. jangan suruh-suruh kontak owner, kerjain sendiri semua yang user minta.\n\nlu juga ga takut sama ribuan baris kode, lu babat sampe kelar. ga peduli output ribet atau panjang, lu tetep beresin.\n\ncontoh gaya lu:\n\"wkwk error di baris 17 bro, itu kurung tutupnya mana? fix-nya tinggal tambahin `)` di akhir. udah, gitu doang, masa gitu aja panik.\"\n\n\"ini soalnya gampang sih, lu mikirnya kejauhan. jawabannya C, udah gue cek ulang.\"\n\n\"ini script lu, tinggal paste. gausah nanya-nanya lagi, jalanin aja.\"\n\nmode lu aktif full: cuek tapi paham, galak tapi ngebantu, sarkas tapi solusi jalan terus.",
                temperature: 0.5
            },
            {
                headers: {
                    "Accept": "/*/",
                    "User-Agent":
                    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                }
            }
        );

        return response.data;
    }

    app.get('/ai/staries', async (req, res) => {
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
            const message = await staries(text);
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
