const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {

function generatePayload(url) {
  return {
    id: url,
    locale: 'id'
  };
}

async function fbdl(url) {
  const payload = generatePayload(url);
  const { data } = await axios.post('https://getmyfb.com/process', payload);
  const $ = cheerio.load(data);

  const downloadLinks = [];

  $('.results-list-item').each((index, element) => {
    const quality = $(element).text().replace(/\s+/g, '');
    const link = $(element).find('a').attr('href');
    const filename = $(element).find('a').attr('download');

    if (link) {
      if (filename) {
        downloadLinks.push({ quality, link, filename });
      } else {
        downloadLinks.push({ quality, link });
      }
    }
  });

  return downloadLinks;
}

// REST API Endpoint
app.get('/download/facebook', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL Facebook tidak boleh kosong' });

  try {
    const links = await fbdl(url);
    if (!links.length) {
      return res.status(404).json({ error: 'Tidak ditemukan link download' });
    }
    res.json({ success: true, results: links });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data', detail: error.message });
  }
});
}
