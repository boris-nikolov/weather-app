const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;
const API_KEY = '7756dcf9494c717595a8650b04b3e27e';

app.use(cors());
app.use(express.json());

// Get weather by city name
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

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

    res.json({
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
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

