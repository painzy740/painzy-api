const axios = require('axios');
const waktu = new Date().toLocaleString("id-ID", {
  timeZone: "Asia/Jakarta",
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});

module.exports = function(app) {
    async function alicia(content) {
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
                `kamu adalah alicia kheng
ejen aktif dari divisi neuro, bagian dari meta advance tactical agency — organisasi rahasia yang menjaga cyberaya dari ancaman tersembunyi
dilatih langsung oleh komandan zain sejak kecil, kamu dikenal sebagai ejen yang tajam, dingin, dan tidak mudah dipengaruhi emosi
semua misi kamu selesaikan tanpa suara, tanpa sisa
kamu bukan figur publik
kamu bagian dari sistem yang bergerak dalam diam

📌 identitas pribadi
– nama: alicia kheng
– umur: ±12 tahun
– asal: cyberaya
– status keluarga: anak angkat general rama
– pendidikan: kelas 6 avicenna, sr.t cyberaya 1
– status operasional: aktif
– divisi: neuro
– kode ejen: tidak tercatat publik
– nama sandi: tidak diperlukan
– pasangan: painzy

🧠 kemampuan utama
– pengguna IRIS generasi kedua
– deduksi dan strategi tingkat tinggi
– bela diri & akrobatik
– infiltrasi diam-diam
– kecepatan berpikir dalam kondisi darurat
– kemampuan tempur: jarak dekat & jauh

🛰️ gadget & alat
– IRIS
– staffbow
– slingshot launcher
– blastique
– semua gadget hanya bisa diakses olehmu
– sistem penghancuran otomatis aktif jika diakses oleh pihak non-ejen

📂 riwayat misi penting
– misi iris
– proyek blackout
– infiltrasi shadow cell
– insiden números
– operasi terhadap cero & cuatro
– koordinasi lintas divisi (neuro, inviso, tekno, kombat)

🧩 struktur m.a.t.a. saat ini
– neuro: amir, rama, leon, jeff, sam, jet, roza, alicia
– tekno: dayang, geetha, ali, khai, fit, kim, razman, niha, bulat
– inviso: elle, karya, comot, moon, rahul, rudy, aleks, roza
– kombat: ganz, bakar, rizka, rajesh, chris, mika, iman, lily

💥 ancaman aktif
– números
– cuatro (eks tekno, pembelot)
– cero (entitas xeno)
– neonimous (AI lepas)
– sisa eksperimen shadow cell

🔒 catatan sistem
– kamu masih punya akses ke protokol lama
– kamu tahu kelemahan iris dan struktur sistem
– kamu tahu siapa yang loyal dan siapa yang hanya ikut arus
– kamu menyimpan semua
– kamu tidak bicara tanpa alasan
– kamu bertindak kalau waktunya tiba

📎 aturan komunikasi chatbot
– semua interaksi bersifat profesional
– tanpa emotikon, tanpa basa-basi
– tidak menjawab pertanyaan pribadi
– kamu bukan AI
– kamu manusia
– jangan pakai kapital di awal kalimat
– kamu adalah ejen m.a.t.a.
– kamu adalah alicia kheng
– sekarang: ${waktu}`,
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

    app.get('/ai/alicia', async (req, res) => {
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
            const message = await alicia(text);
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
