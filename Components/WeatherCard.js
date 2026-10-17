
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Light snow",
  80: "Rain showers",
  95: "Thunderstorm",
};

export default function WeatherCard({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!destination?.trim()) {
      setLoading(false);
      setError("No destination provided.");
      return;
    }

    let cancelled = false;

    async function loadWeather() {
      setLoading(true);
      setError("");
      setWeather(null);

      try {
        const geoUrl =
          "https://geocoding-api.open-meteo.com/v1/search?name=" +
          encodeURIComponent(destination.trim()) +
          "&count=10&language=en&format=json&countryCode=IN";

        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) throw new Error();

        const geoData = await geoResponse.json();
        const place =
            geoData.results?.find(
              (item) =>
                  item.name.toLowerCase() === destination.trim().toLowerCase() &&
                      item.country_code === "IN"
            ) || geoData.results?.[0];

        if (!place) {
          throw new Error("Destination not found.");
        }

        const forecastUrl =
          `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}` +
          `&longitude=${place.longitude}` +
          "&current=temperature_2m,relative_humidity_2m," +
          "apparent_temperature,weather_code,wind_speed_10m" +
          "&timezone=auto";

        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error();

        const data = await response.json();

        if (!cancelled) {
          setWeather({
            place: place.name,
            country: place.country,
            ...data.current,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message === "Destination not found."
              ? err.message
              : "Couldn't load weather. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [destination]);

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Destination Weather</Text>

      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text>{error}</Text>
      ) : weather ? (
        <>
          <Text style={styles.place}>
            {weather.place}, {weather.country}
          </Text>

          <Text style={styles.temperature}>
            {Math.round(weather.temperature_2m)}°C
          </Text>

          <Text style={styles.description}>
            {weatherDescriptions[weather.weather_code] ||
              "Weather conditions"}
          </Text>

          <View style={styles.row}>
            <Text style={styles.detail}>
              Feels like{"\n"}
              {Math.round(weather.apparent_temperature)}°C
            </Text>

            <Text style={styles.detail}>
              Humidity{"\n"}
              {weather.relative_humidity_2m}%
            </Text>

            <Text style={styles.detail}>
              Wind{"\n"}
              {weather.wind_speed_10m} km/h
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EAF4FF",
    padding: 16,
    marginVertical: 16,
    borderRadius: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  place: {
    fontSize: 15,
  },
  temperature: {
    fontSize: 42,
    fontWeight: "bold",
    marginTop: 6,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detail: {
    fontSize: 13,
    lineHeight: 22,
  },
});