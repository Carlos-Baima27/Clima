export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  countryCode: string;
  timezone: string;
}

export interface GeocodingApiResult {
  name?: string;
  latitude?: number;
  longitude?: number;
  country_code?: string;
  timezone?: string;
}

export interface GeocodingApiResponse {
  results?: GeocodingApiResult[];
}

export interface CurrentWeather {
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  isDay: number;
  windSpeed: number;
  windDirection: number;
  precipitationProbability: number;
  precipitation: number | null;
  weatherCode: number;
}

export interface CurrentWeatherApiResult {
  temperature_2m?: number;
  relative_humidity_2m?: number;
  apparent_temperature?: number;
  is_day?: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
  precipitation_probability?: number;
  precipitation?: number;
  weather_code?: number;
}

export interface ForecastApiResponse {
  current?: CurrentWeatherApiResult;
}

export interface WeatherData {
  location: GeocodingResult;
  current: CurrentWeather;
}

export type WeatherState =
  | { status: "empty" }
  | { status: "loading" }
  | { status: "success"; data: WeatherData };
