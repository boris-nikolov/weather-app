const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY || '7756dcf9494c717595a8650b04b3e27e';

    console.log(`Fetching weather for city: ${city}`);

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      }
    );

    const { main, weather, wind, name } = response.data;

    res.status(200).json({
      city: name,
      temperature: main.temp,
      feelsLike: main.feels_like,
      humidity: main.humidity,
      pressure: main.pressure,
      description: weather[0].description,
      icon: weather[0].icon,
      windSpeed: wind.speed,
    });
  } catch (error) {
    console.error('Error fetching weather:', error.response?.status, error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else if (error.response?.status === 401) {
      res.status(401).json({ error: 'Invalid API key' });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
};

