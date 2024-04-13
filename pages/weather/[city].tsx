// pages/weather.tsx

import {
  WeatherData,
  addFavorite,
  removeFavorite,
  selectFavorites,
} from "@/redux/weatherSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ForecastData {
  list: {
    dt_txt: string;
    main: {
      temp: number;
      humidity: number;
      temp_min: number;
      temp_max: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
  }[];
}

const WeatherPage = () => {
  const router = useRouter();
  console.log(router);
  const { lat, lon } = router.query;
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);

  const [isFavorite, setIsFavorite] = useState(false);
  //initialise favorite based on store value
  useEffect(() => {
    if (lat && lon) {
      const index = favorites.findIndex(
        (favorite) => favorite.name === weatherData?.name
      );
      if (index !== -1) {
        setIsFavorite(true);
      }
    }
  }, [lat, lon, favorites, weatherData]);

  const addToFavorites = (favorite: WeatherData) => {
    dispatch(addFavorite(favorite));
    setIsFavorite(true);
  };

  const removeFromFavorites = (weatherData: WeatherData) => {
    const index = favorites.findIndex(
      (favorite) => favorite.name === weatherData.name
    );
    if (index !== -1) {
      dispatch(removeFavorite(index));
      setIsFavorite(false);
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6ae6940ac422af604fcffddb16b86021&units=${unit}`
        );
        const weatherData: WeatherData = await weatherResponse.json();
        setWeatherData(weatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    const fetchForecastData = async () => {
      try {
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6ae6940ac422af604fcffddb16b86021&units=${unit}`
        );
        const forecastData: ForecastData = await forecastResponse.json();
        setForecastData(forecastData);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    if (lat && lon) {
      Promise.all([fetchWeatherData(), fetchForecastData()]).then(() =>
        setLoading(false)
      );
    }
  }, [lat, lon, unit]);

  const handleUnitChange = (selectedUnit: "metric" | "imperial") => {
    setUnit(selectedUnit);
  };

  if (loading) {
    return (
      <main className={`min-h-screen`}>
        <div className="max-w-4xl mx-auto">Loading...</div>{" "}
      </main>
    );
  }

  if (!weatherData || !forecastData) {
    return <div>Error loading weather data</div>;
  }

  return (
    <main className={`min-h-screen`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-md p-6 mb-6">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold mb-4">
              {weatherData.name} Weather
            </h1>
            {isFavorite ? (
              <button
                onClick={() => removeFromFavorites(weatherData)}
                className="bg-red-500 text-white px-4 py-2 rounded-md mt-2"
              >
                Remove from Favorites
              </button>
            ) : (
              <button
                onClick={() => addToFavorites(weatherData)}
                className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
              >
                Add to Favorites
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold">Current Weather</h2>
              <div className="flex">
                <div>
                  <p>
                    Temperature: {weatherData.main.temp}°
                    {unit === "metric" ? "C" : "F"}
                  </p>
                  <p>Description: {weatherData.weather[0].description}</p>
                  <p>Humidity: {weatherData.main.humidity}%</p>
                </div>
                <img
                  src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                  alt="Weather Icon"
                  className="w-20 h-20"
                />
              </div>

              <h2 className="text-lg font-semibold">Additional Details</h2>
              <p>Wind Speed: {weatherData.wind.speed} m/s</p>
              <p>Pressure: {weatherData.main.pressure} hPa</p>
              <p>
                Min Temperature: {weatherData.main.temp_min}°
                {unit === "metric" ? "C" : "F"}
              </p>
              <p>
                Max Temperature: {weatherData.main.temp_max}°
                {unit === "metric" ? "C" : "F"}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Sunrise & Sunset</h2>
              <p>
                Sunrise:{" "}
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
              </p>
              <p>
                Sunset:{" "}
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button
              className={`mr-4 ${
                unit === "metric"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-md`}
              onClick={() => handleUnitChange("metric")}
            >
              Celsius
            </button>
            <button
              className={`mr-4 ${
                unit === "imperial"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-md`}
              onClick={() => handleUnitChange("imperial")}
            >
              Fahrenheit
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Forecast</h2>
          <div className="grid grid-cols-1 gap-4">
            {forecastData.list.map((forecast, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold">{forecast.dt_txt}</h3>
                <div className="flex">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div>
                        <h5 className="text-xl font-semibold">
                          {forecast.weather[0].description}
                        </h5>
                        <p>
                          Temperature: {forecast.main.temp}°
                          {unit === "metric" ? "C" : "F"}
                        </p>

                        <p>Humidity: {forecast.main.humidity}%</p>
                      </div>
                      <img
                        src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                        alt="Weather Icon"
                        className="w-20 h-20"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p>Wind Speed: {forecast.wind.speed} m/s</p>
                    <p>
                      Min Temperature: {forecast.main.temp_min}°
                      {unit === "metric" ? "C" : "F"}
                    </p>
                    <p>
                      Max Temperature: {forecast.main.temp_max}°
                      {unit === "metric" ? "C" : "F"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default WeatherPage;
