import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'City not found')
      }

      const data = await response.json()
      setWeather(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Weather App</h1>
        
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
          />
          <button type="submit" className="button">
            Search
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {loading && <div className="loading">Loading...</div>}

        {weather && (
          <div className="weather-info">
            <h2>{weather.city}</h2>
            <div className="temperature">
              {Math.round(weather.temperature)}°C
            </div>
            <p className="description">{weather.description}</p>
            <div className="details">
              <div className="detail">
                <span>Feels Like:</span>
                <span>{Math.round(weather.feelsLike)}°C</span>
              </div>
              <div className="detail">
                <span>Humidity:</span>
                <span>{weather.humidity}%</span>
              </div>
              <div className="detail">
                <span>Wind Speed:</span>
                <span>{weather.windSpeed} m/s</span>
              </div>
              <div className="detail">
                <span>Pressure:</span>
                <span>{weather.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

