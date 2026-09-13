import type {
  CurrentWeather,
  CurrentWeatherApiResult,
  ForecastApiResponse,
  GeocodingApiResponse,
  GeocodingApiResult,
  GeocodingResult,
  WeatherData,
} from "../types/weather.ts";

const GEOCODING_ENDPOINT = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isGeocodingResult(value: unknown): value is GeocodingApiResult {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.name === undefined || typeof value.name === "string") &&
    (value.latitude === undefined || typeof value.latitude === "number") &&
    (value.longitude === undefined || typeof value.longitude === "number") &&
    (value.country_code === undefined ||
      typeof value.country_code === "string") &&
    (value.timezone === undefined || typeof value.timezone === "string")
  );
}

function isGeocodingResponse(value: unknown): value is GeocodingApiResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.results === undefined ||
    (Array.isArray(value.results) && value.results.every(isGeocodingResult))
  );
}

export async function searchCity(
  cityName: string,
): Promise<GeocodingResult | null> {
  const normalizedName = cityName.trim();
  if (!normalizedName) {
    return null;
  }

  const params = new URLSearchParams({
    name: normalizedName,
    count: "1",
    language: "pt",
    format: "json",
  });

  try {
    const response = await fetch(`${GEOCODING_ENDPOINT}?${params.toString()}`);
    if (!response.ok) {
      return null;
    }

    const payload: unknown = await response.json();
    if (!isGeocodingResponse(payload) || !payload.results?.[0]) {
      return null;
    }

    const result = payload.results[0];
    if (
      typeof result.name !== "string" ||
      typeof result.latitude !== "number" ||
      typeof result.longitude !== "number" ||
      typeof result.country_code !== "string" ||
      typeof result.timezone !== "string"
    ) {
      return null;
    }

    return {
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      countryCode: result.country_code,
      timezone: result.timezone,
    };
  } catch {
    return null;
  }
}

function isCurrentWeather(value: unknown): value is CurrentWeatherApiResult {
  if (!isRecord(value)) {
    return false;
  }

  const requiredFields = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "is_day",
    "wind_speed_10m",
    "wind_direction_10m",
    "precipitation_probability",
    "weather_code",
  ] as const;

  return requiredFields.every((field) => typeof value[field] === "number");
}

function isForecastResponse(value: unknown): value is ForecastApiResponse {
  return isRecord(value) && isCurrentWeather(value.current);
}

export async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<CurrentWeather | null> {
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !timezone.trim()
  ) {
    return null;
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,precipitation,weather_code",
    timezone,
  });

  try {
    const response = await fetch(`${FORECAST_ENDPOINT}?${params.toString()}`);
    if (!response.ok) {
      return null;
    }

    const payload: unknown = await response.json();
    if (!isForecastResponse(payload)) {
      return null;
    }

    const current = payload.current;
    if (
      !current ||
      typeof current.temperature_2m !== "number" ||
      typeof current.relative_humidity_2m !== "number" ||
      typeof current.apparent_temperature !== "number" ||
      typeof current.is_day !== "number" ||
      typeof current.wind_speed_10m !== "number" ||
      typeof current.wind_direction_10m !== "number" ||
      typeof current.precipitation_probability !== "number" ||
      typeof current.weather_code !== "number"
    ) {
      return null;
    }

    return {
      temperature: current.temperature_2m,
      relativeHumidity: current.relative_humidity_2m,
      apparentTemperature: current.apparent_temperature,
      isDay: current.is_day,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      precipitationProbability: current.precipitation_probability,
      precipitation:
        typeof current.precipitation === "number"
          ? current.precipitation
          : null,
      weatherCode: current.weather_code,
    };
  } catch {
    return null;
  }
}

export async function fetchWeatherForCity(
  cityName: string,
): Promise<WeatherData | null> {
  const location = await searchCity(cityName);
  if (!location) {
    return null;
  }

  const current = await fetchCurrentWeather(
    location.latitude,
    location.longitude,
    location.timezone,
  );
  if (!current) {
    return null;
  }

  return { location, current };
}
