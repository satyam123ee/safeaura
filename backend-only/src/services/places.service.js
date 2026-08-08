import axios from 'axios';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const findNearbyPolice = async (lat, lng, radius = 5000) => {
  const query = `
    [out:json];
    node["amenity"="police"](around:${radius},${lat},${lng});
    out;
  `;
  const { data } = await axios.post(OVERPASS_URL, query, {
    headers: { 'Content-Type': 'text/plain' },
    timeout: 15000,
  });
  return data.elements || [];
};
