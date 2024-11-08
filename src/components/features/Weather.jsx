import { useState, useEffect } from "react";

// SVG icons for weather conditions
const weatherIcons = {
  clear: "☀", // Clear Sky
  cloudy: "☁", // Cloudy
  rainy: "🌧", // Rainy
  snowy: "❄", // Snowy
  windy: "💨", // Windy
};

// Workout suggestions based on weather
const getWorkoutSuggestion = (weatherCode) => {
  if (weatherCode === 0) {
    return "Perfect day for outdoor activities! Go for a run, cycling, or yoga in the park.";
  } else if (weatherCode >= 1 && weatherCode <= 3) {
    return "It’s a bit cloudy, but still good for light outdoor exercises like walking or stretching.";
  } else if (weatherCode >= 61 && weatherCode <= 67) {
    return "Rainy weather! Consider an indoor workout like strength training, yoga, or a home cardio session.";
  } else if (weatherCode >= 71 && weatherCode <= 77) {
    return "Snowy weather! Be cautious if outdoors. Activities like snow walking, hiking, or indoor workouts are best.";
  } else if (weatherCode >= 80 && weatherCode <= 86) {
    return "Windy outside! Opt for short outdoor workouts or stay inside with aerobic exercises.";
  }
  return "Weather is unpredictable. Consider an indoor workout for safety.";
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({
    city: "Your Location",
    coordinates: { latitude: 0, longitude: 0 },
  });

  // Fetch weather data using latitude and longitude from Open-Meteo
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      if (!response.ok) {
        throw new Error("Weather data could not be fetched");
      }
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      setError("Unable to fetch weather data.");
      setLoading(false);
    }
  };

  // Use Geolocation API to get user's current coordinates or fall back to New York
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            city: "Your Current Location",
            coordinates: { latitude, longitude },
          });
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error(
            "Location access denied, loading New York weather.",
            error
          );
          setLocation({
            city: "New York, USA",
            coordinates: { latitude: 40.7128, longitude: -74.006 },
          });
          fetchWeatherData(40.7128, -74.006); // Default location: New York City
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLocation({
        city: "New York, USA",
        coordinates: { latitude: 40.7128, longitude: -74.006 },
      });
      fetchWeatherData(40.7128, -74.006); // Load New York weather as fallback
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getWeatherIcon = (code) => {
    if (code === 0) return weatherIcons.clear; // Clear sky
    if (code >= 1 && code <= 3) return weatherIcons.cloudy; // Cloudy
    if (code >= 61 && code <= 67) return weatherIcons.rainy; // Rainy
    if (code >= 71 && code <= 77) return weatherIcons.snowy; // Snowy
    if (code >= 80 && code <= 86) return weatherIcons.windy; // Windy
    return "❓"; // Unknown weather
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-red-800 text-center">
          Current Weather
        </h2>

        {loading ? (
          <p className="text-lg text-red-600 text-center">
            Loading weather data...
          </p>
        ) : error ? (
          <p className="text-lg text-red-600 text-center">{error}</p>
        ) : weatherData ? (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-700">
                  {location.city}
                </h3>
                <p className="text-4xl font-bold text-red-900">
                  {Math.round(weatherData.current_weather.temperature)}°C
                </p>
                <p className="text-lg text-red-600">
                  Wind Speed: {weatherData.current_weather.windspeed.toFixed(1)}{" "}
                  km/h
                </p>
              </div>

              <div className="text-6xl">
                {getWeatherIcon(weatherData.current_weather.weathercode)}
              </div>
            </div>

            <div className="mt-6 p-4 border rounded-lg shadow-md bg-gray-50">
              <h4 className="text-xl font-bold text-red-800">Workout Tip</h4>
              <p className="text-lg text-red-700 mt-2">
                {getWorkoutSuggestion(weatherData.current_weather.weathercode)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-lg text-red-600 text-center">
            Unable to fetch weather data.
          </p>
        )}
      </div>
    </div>
  );
};

export default Weather;
