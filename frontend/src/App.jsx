import { useState, useEffect } from 'react'
import './App.css'
import Auth from './components/Auth'
import { auth, favoriteCities, searchHistory } from './lib/supabase'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])
  const [showAuth, setShowAuth] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    auth.getCurrentUser().then(({ user }) => {
      setUser(user)
      setLoading(false)
      if (user) {
        loadFavorites()
        loadHistory()
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadFavorites()
        loadHistory()
      } else {
        setFavorites([])
        setHistory([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadFavorites = async () => {
    const { data } = await favoriteCities.getAll()
    if (data) setFavorites(data)
  }

  const loadHistory = async () => {
    const { data } = await searchHistory.getAll(5)
    if (data) setHistory(data)
  }

  const handleSignOut = async () => {
    await auth.signOut()
    setUser(null)
    setFavorites([])
    setHistory([])
  }

  const handleSearch = async (e, searchCity = null) => {
    if (e) e.preventDefault()

    const cityToSearch = searchCity || city

    if (!cityToSearch.trim()) {
      setError('Please enter a city name')
      return
    }

    setSearchLoading(true)
    setError('')
    setWeather(null)

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityToSearch)}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'City not found')
      }

      const data = await response.json()
      setWeather(data)

      // Save to search history
      if (user) {
        await searchHistory.add(data.city, data.country, data.temperature, data.description)
        loadHistory()
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setSearchLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      setShowAuth(true)
      return
    }

    if (!weather) return

    const { isFavorite, favoriteId } = await favoriteCities.isFavorite(weather.city, weather.country)

    if (isFavorite && favoriteId) {
      await favoriteCities.remove(favoriteId)
    } else {
      await favoriteCities.add(weather.city, weather.country, null, null)
    }

    loadFavorites()
  }

  const isCityFavorited = () => {
    if (!weather || !favorites.length) return false
    return favorites.some(fav => fav.city_name === weather.city && fav.country_code === weather.country)
  }

  if (loading) {
    return <div className="container"><div className="loading">Loading...</div></div>
  }

  if (showAuth && !user) {
    return <Auth onAuthSuccess={() => setShowAuth(false)} />
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>🌤️ Weather App</h1>
          {user ? (
            <div className="user-info">
              <span>{user.email}</span>
              <button onClick={handleSignOut} className="button-secondary">
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)} className="button-secondary">
              Sign In
            </button>
          )}
        </div>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
          />
          <button type="submit" className="button" disabled={searchLoading}>
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {searchLoading && <div className="loading">Loading...</div>}

        {weather && (
          <div className="weather-info">
            <div className="weather-header">
              <h2>{weather.city}, {weather.country}</h2>
              {user && (
                <button
                  onClick={toggleFavorite}
                  className="favorite-button"
                  title={isCityFavorited() ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isCityFavorited() ? '⭐' : '☆'}
                </button>
              )}
            </div>
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

        {user && favorites.length > 0 && (
          <div className="favorites-section">
            <h3>⭐ Favorite Cities</h3>
            <div className="favorites-list">
              {favorites.map((fav) => (
                <button
                  key={fav.id}
                  onClick={() => {
                    setCity(fav.city_name)
                    handleSearch(null, fav.city_name)
                  }}
                  className="favorite-item"
                >
                  {fav.city_name}, {fav.country_code}
                </button>
              ))}
            </div>
          </div>
        )}

        {user && history.length > 0 && (
          <div className="history-section">
            <h3>📜 Recent Searches</h3>
            <div className="history-list">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCity(item.city_name)
                    handleSearch(null, item.city_name)
                  }}
                  className="history-item"
                >
                  <span>{item.city_name}, {item.country_code}</span>
                  <span className="history-temp">{Math.round(item.temperature)}°C</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

