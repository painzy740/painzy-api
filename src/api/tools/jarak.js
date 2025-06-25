const axios = require('axios');

/**
 * Mendapatkan koordinat (latitude, longitude) dari nama kota menggunakan Nominatim.
 * @param {string} city Nama kota.
 * @returns {Promise<object>} Objek berisi lat, lon, dan display_name.
 */
async function getCoordinates(city) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&accept-language=id`; // Prioritaskan hasil Indonesia
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'ZenzzXDApi/1.0 (Hubungi: emailanda@example.com)' }, // Ganti dengan info kontak Anda
      timeout: 10000 // Timeout 10 detik
    });
    const data = response.data;
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display_name: data[0].display_name };
    }
    throw new Error(`Kota tidak ditemukan atau tidak ada hasil koordinat untuk: ${city}`);
  } catch (error) {
    console.error(`Error getCoordinates for ${city}:`, error.message);
    const errorMessage = error.response?.data?.error?.message || error.response?.data?.error || error.message || `Gagal mendapatkan koordinat untuk ${city}.`;
    throw new Error(errorMessage);
  }
}

/**
 * Menghitung jarak Haversine (garis lurus) antara dua titik koordinat.
 */
function haversineDistance(lat1, lon1, lat2, lon2, unit = 'km') {
  const R = unit === 'km' ? 6371 : 3958.8; // Radius bumi
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Mendapatkan jarak tempuh darat menggunakan OSRM Project.
 * @returns {Promise<number|null>} Jarak dalam unit yang ditentukan atau null.
 */
async function getDrivingDistance(startLat, startLon, endLat, endLon, unit = 'km') {
  const url = `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=false`;
  try {
    const response = await axios.get(url, { timeout: 15000 }); // Timeout 15 detik
    const data = response.data;
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      return unit === 'km' ? data.routes[0].distance / 1000 : data.routes[0].distance / 1609.34;
    }
    console.warn(`OSRM: No driving route found or error. Code: ${data.code}, Message: ${data.message}`);
    return null; // Jika tidak ada rute atau error dari OSRM
  } catch (error) {
    console.error('Error getDrivingDistance:', error.message);
    return null; // Kembalikan null jika ada error jaringan, biarkan fungsi utama menangani
  }
}

/**
 * Memformat menit menjadi string "Xj Ym Zd".
 */
function formatTime(minutes) {
  if (minutes === null || typeof minutes === 'undefined' || isNaN(minutes)) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes * 60) % 60);
  return `${hours}j ${mins}m ${secs}d`;
}

/**
 * Mengestimasi waktu tempuh dengan berbagai moda transportasi.
 */
function estimateTravelTimes(crowFlies, drivingDistance, unit = 'km') {
  const motorcycleSpeed = unit === 'km' ? 40 : 24.85;
  const carSpeed = unit === 'km' ? 80 : 49.71;
  const busSpeed = unit === 'km' ? 50 : 31.07;
  const trainSpeed = unit === 'km' ? 100 : 62.14;
  const planeSpeed = unit === 'km' ? 800 : 497.10; // Kecepatan rata-rata pesawat termasuk take-off/landing
  
  // Gunakan drivingDistance jika ada, jika tidak estimasi waktu darat mungkin tidak akurat/N.A.
  const baseDistanceForLandTravel = drivingDistance !== null ? drivingDistance : crowFlies; // Fallback ke crowFlies untuk estimasi kasar jika driving N/A

  const motorcycleTime = (baseDistanceForLandTravel / motorcycleSpeed) * 60;
  const carTime = (baseDistanceForLandTravel / carSpeed) * 60;
  const busTime = (baseDistanceForLandTravel / busSpeed) * 60;
  const trainTime = (baseDistanceForLandTravel / trainSpeed) * 60;
  const planeTime = (crowFlies / planeSpeed) * 60; // Pesawat selalu pakai jarak garis lurus
  
  return {
    motorcycle: formatTime(motorcycleTime),
    car: formatTime(carTime),
    bus: formatTime(busTime),
    train: formatTime(trainTime),
    plane: formatTime(planeTime)
  };
}

/**
 * Fungsi utama yang diubah untuk mengembalikan objek JSON.
 */
async function calculateDistanceAndTimes(cityAName, cityBName, unitInput = 'km') {
  // Validasi unit
  const unit = (unitInput === 'miles') ? 'miles' : 'km';

  try {
    const coordsA = await getCoordinates(cityAName);
    const coordsB = await getCoordinates(cityBName);

    const crowFliesDistance = haversineDistance(coordsA.lat, coordsA.lon, coordsB.lat, coordsB.lon, unit);
    
    let drivingDist = null;
    // Hanya coba dapatkan driving distance jika kedua koordinat valid
    if (coordsA && coordsB) {
        drivingDist = await getDrivingDistance(coordsA.lat, coordsA.lon, coordsB.lat, coordsB.lon, unit);
    }

    const travelTimes = estimateTravelTimes(crowFliesDistance, drivingDist, unit);
    const unitLabel = unit; // Sudah km atau miles

    return {
      origin: {
        requested_city: cityAName,
        resolved_location: coordsA.display_name,
        coordinates: { lat: coordsA.lat, lon: coordsA.lon }
      },
      destination: {
        requested_city: cityBName,
        resolved_location: coordsB.display_name,
        coordinates: { lat: coordsB.lat, lon: coordsB.lon }
      },
      unit: unitLabel,
      distance_as_crow_flies: `${crowFliesDistance.toFixed(2)} ${unitLabel}`,
      distance_driving_route: drivingDist !== null ? `${drivingDist.toFixed(2)} ${unitLabel}` : 'N/A',
      estimated_travel_times: travelTimes
    };
  } catch (error) {
    // Error dari getCoordinates atau error lain akan ditangkap di sini
    throw error; // Lempar kembali untuk ditangani oleh handler Express
  }
}

// --- Rute Express ---
module.exports = function (app) {
  const creatorName = "ZenzzXD";

  app.get('/tools/distance', async (req, res) => {
    const { cityA, cityB, unit } = req.query;

    if (!cityA || !cityB) {
      return res.status(400).json({
        status: false,
        creator: creatorName,
        message: "Parameter 'cityA' dan 'cityB' wajib diisi."
      });
    }

    try {
      const result = await calculateDistanceAndTimes(cityA, cityB, unit);
      res.json({
        status: true,
        creator: creatorName,
        result: result
      });
    } catch (error) {
      console.error("Distance Calculator API Error:", error.message, error.stack);
      // Jika error spesifik karena kota tidak ditemukan, mungkin kembalikan 404
      const statusCode = error.message.toLowerCase().includes("tidak ditemukan") || error.message.toLowerCase().includes("gagal mendapatkan koordinat") ? 404 : 500;
      res.status(statusCode).json({
        status: false,
        creator: creatorName,
        message: error.message || 'Terjadi kesalahan internal saat menghitung jarak.'
      });
    }
  });

  // Tambahkan rute lain di sini...
};
