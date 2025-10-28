# 🌤️ Weather App

A modern weather application built with React and Express, featuring user authentication, favorite cities, and search history powered by Supabase.

## 🚀 Features

- **Real-time Weather Data**: Get current weather information for any city using the OpenWeather API
- **User Authentication**: Sign up and sign in with email/password using Supabase Auth
- **Favorite Cities**: Save your favorite cities for quick access (requires authentication)
- **Search History**: Automatically track your recent weather searches (requires authentication)
- **Responsive Design**: Beautiful UI that works on all devices
- **Secure**: Row Level Security (RLS) policies ensure users can only access their own data

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Supabase JS Client** - Authentication and database access

### Backend
- **Express.js** - Local development server
- **Vercel Serverless Functions** - Production API endpoints
- **Axios** - HTTP client for API requests

### Database & Auth
- **Supabase** - PostgreSQL database with built-in authentication
- **Row Level Security (RLS)** - Database-level security policies

### Deployment
- **Vercel** - Frontend and serverless functions hosting
- **GitHub** - Version control and CI/CD

## 📦 Installation

### Prerequisites
- Node.js 20.4.0 or higher
- npm or yarn
- OpenWeather API key ([Get one here](https://openweathermap.org/api))
- Supabase account ([Sign up here](https://supabase.com))

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/boris-nikolov/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your actual values:
   ```env
   # OpenWeather API
   OPENWEATHER_API_KEY=your_openweather_api_key
   
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Database Connection (optional)
   DATABASE_URL=postgresql://postgres:your_password@db.your_project_id.supabase.co:5432/postgres
   ```

4. **Set up Supabase database**
   
   Run the migration SQL in your Supabase SQL Editor:
   ```bash
   # The migration file is located at:
   supabase/migrations/001_initial_schema.sql
   ```
   
   Or use the Supabase CLI:
   ```bash
   supabase db push
   ```

5. **Start the development servers**
   
   In one terminal, start the backend:
   ```bash
   cd backend
   npm start
   ```
   
   In another terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

## 🗄️ Database Schema

### Tables

#### `profiles`
- User profile information
- Automatically created on user signup
- Fields: `id`, `email`, `full_name`, `avatar_url`, `created_at`, `updated_at`

#### `favorite_cities`
- User's favorite cities
- Fields: `id`, `user_id`, `city_name`, `country_code`, `latitude`, `longitude`, `created_at`

#### `weather_search_history`
- User's weather search history
- Fields: `id`, `user_id`, `city_name`, `country_code`, `temperature`, `weather_description`, `searched_at`

#### `user_preferences`
- User preferences and settings
- Fields: `id`, `user_id`, `temperature_unit`, `theme`, `default_city`, `notifications_enabled`, `created_at`, `updated_at`

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set environment variables in Vercel**
   ```bash
   vercel env add OPENWEATHER_API_KEY production
   vercel env add VITE_SUPABASE_URL production
   vercel env add VITE_SUPABASE_ANON_KEY production
   ```

### Automatic Deployments

Once connected to GitHub, Vercel will automatically deploy:
- **Production**: Every push to `master` branch
- **Preview**: Every pull request

## 🔐 Security

- **Row Level Security (RLS)**: All database tables have RLS policies enabled
- **Authentication**: Supabase handles secure authentication with JWT tokens
- **API Keys**: Environment variables are never exposed to the client
- **HTTPS**: All production traffic is encrypted

## 📝 API Endpoints

### `GET /api/weather?city={cityName}`

Get current weather for a city.

**Parameters:**
- `city` (required): Name of the city

**Response:**
```json
{
  "temperature": 15.5,
  "feelsLike": 14.2,
  "humidity": 72,
  "pressure": 1013,
  "windSpeed": 3.5,
  "description": "partly cloudy",
  "city": "London",
  "country": "GB"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live App**: https://weather-hexhae99j-boris-5527s-projects.vercel.app
- **GitHub Repository**: https://github.com/boris-nikolov/weather-app
- **Supabase Dashboard**: https://supabase.com/dashboard/project/oepzdkcehaitgybcgpas

## 👤 Author

**boris-nikolov**
- GitHub: [@boris-nikolov](https://github.com/boris-nikolov)

## 🙏 Acknowledgments

- [OpenWeather API](https://openweathermap.org/) for weather data
- [Supabase](https://supabase.com/) for authentication and database
- [Vercel](https://vercel.com/) for hosting

