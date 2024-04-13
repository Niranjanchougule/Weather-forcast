// pages/favorites.tsx

import { useDispatch, useSelector } from "react-redux";
import {
  WeatherData,
  removeFavorite,
  selectFavorites,
} from "../redux/weatherSlice";
import { useEffect, useState } from "react";

const FavoritesPage = () => {
  // using isClient because we are using local storage we need run our logic only on browser
  const [isClient, setIsClient] = useState(false);
  const storeState = useSelector(selectFavorites);
  const dispatch = useDispatch();
  const removeFromFavorites = (index: number) => {
    dispatch(removeFavorite(index));
  };
  useEffect(() => {
    setIsClient(true);
  }, []);

  // On server do nothing
  if (!isClient) {
    return <div>Loading...</div>;
  }
  return (
    <main className={`min-h-screen`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Favorites</h1>
        {storeState.length === 0 ? (
          <p>No favorites added yet.</p>
        ) : (
          storeState.map((favorite, index) => (
            <div key={index} className="bg-white shadow-md rounded-md p-4 mb-4">
              <h2 className="text-lg font-semibold">{favorite.name}</h2>
              <>
                <p>Temperature: {favorite.main.temp}°C</p>
                <p>Description: {favorite.weather[0].description}</p>
                <p>Humidity: {favorite.main.humidity}%</p>
              </>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mt-2"
                onClick={() => removeFromFavorites(index)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default FavoritesPage;
