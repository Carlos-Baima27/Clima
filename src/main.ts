import "./style.css";
import { fetchWeatherForCity } from "./services/openMeteo.ts";
import {
  formatLocalDate,
  formatPercentage,
  formatPrecipitation,
  formatTemperature,
  formatWindDirection,
  formatWindSpeed,
} from "./utils/formatters.ts";
import { describeDayPeriod, describeWeatherCode } from "./utils/weather.ts";
import type { WeatherData, WeatherState } from "./types/weather.ts";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Elemento principal da aplicação não encontrado.");
}

app.innerHTML = `
  <main class="weather-app">
    <header class="search-header">
      <div>
        <p class="eyebrow">Clima agora</p>
        <h1>Consulte o tempo da sua cidade</h1>
      </div>
      <form id="search-form" class="search-form">
        <label class="sr-only" for="city-input">Cidade</label>
        <input id="city-input" name="city" type="search" placeholder="Digite a cidade" autocomplete="address-level2" />
        <button id="search-button" type="submit">Buscar</button>
      </form>
    </header>
    <div id="status" class="status" role="status" aria-live="polite"></div>
    <section id="weather-content" class="weather-content" aria-live="polite">
      <div id="empty-state" class="empty-state">
        <span class="empty-icon" aria-hidden="true">☼</span>
        <h2>Encontre o clima de uma cidade</h2>
        <p>Digite um nome acima para consultar as condições atuais.</p>
      </div>
      <div id="weather-result" class="weather-result" hidden>
        <aside class="weather-sidebar">
          <p id="location-country" class="location-country"></p>
          <h2 id="location-name"></h2>
          <p id="location-timezone" class="location-timezone"></p>
          <p id="temperature" class="temperature"></p>
          <p id="weather-description" class="weather-description"></p>
          <div class="day-meta">
            <span id="current-date"></span>
            <span id="day-period"></span>
          </div>
        </aside>
        <div class="weather-details">
          <p class="section-label">Detalhes atuais</p>
          <div class="metrics-grid">
            <article class="metric"><span>Umidade</span><strong id="humidity"></strong></article>
            <article class="metric"><span>Sensação térmica</span><strong id="apparent-temperature"></strong></article>
            <article class="metric"><span>Precipitação</span><strong id="precipitation"></strong></article>
            <article class="metric"><span>Vento</span><strong id="wind-speed"></strong></article>
            <article class="metric"><span>Direção do vento</span><strong id="wind-direction"></strong></article>
            <article class="metric"><span>Código meteorológico</span><strong id="weather-code"></strong></article>
          </div>
        </div>
      </div>
    </section>
  </main>
`;

const form = document.querySelector<HTMLFormElement>("#search-form")!;
const input = document.querySelector<HTMLInputElement>("#city-input")!;
const button = document.querySelector<HTMLButtonElement>("#search-button")!;
const status = document.querySelector<HTMLDivElement>("#status")!;
const emptyState = document.querySelector<HTMLDivElement>("#empty-state")!;
const weatherResult =
  document.querySelector<HTMLDivElement>("#weather-result")!;

let state: WeatherState = { status: "empty" };

function setText(id: string, value: string): void {
  const element = document.querySelector<HTMLElement>(`#${id}`);
  if (element) {
    element.textContent = value;
  }
}

function renderWeather(data: WeatherData): void {
  const { location, current } = data;
  setText("location-country", location.countryCode);
  setText("location-name", location.name);
  setText("location-timezone", location.timezone);
  setText("temperature", formatTemperature(current.temperature));
  setText("weather-description", describeWeatherCode(current.weatherCode));
  setText("current-date", formatLocalDate(location.timezone));
  setText("day-period", describeDayPeriod(current.isDay));
  setText("humidity", formatPercentage(current.relativeHumidity));
  setText(
    "apparent-temperature",
    formatTemperature(current.apparentTemperature),
  );
  setText("precipitation", formatPrecipitation(current.precipitation));
  setText("wind-speed", formatWindSpeed(current.windSpeed));
  setText("wind-direction", formatWindDirection(current.windDirection));
  setText("weather-code", String(current.weatherCode));
}

function render(): void {
  const isLoading = state.status === "loading";
  const isSuccess = state.status === "success";
  const hasEmptyState = state.status === "empty";

  button.disabled = isLoading;
  input.disabled = isLoading;
  status.textContent = isLoading ? "Buscando clima..." : "";
  emptyState.hidden = !hasEmptyState;
  weatherResult.hidden = !isSuccess;

  if (isSuccess) {
    renderWeather(state.data);
  }
}

async function search(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const cityName = input.value.trim();
  if (!cityName || state.status === "loading") {
    return;
  }

  state = { status: "loading" };
  render();

  const data = await fetchWeatherForCity(cityName);
  state = data ? { status: "success", data } : { status: "empty" };
  render();
}

form.addEventListener("submit", (event) => {
  void search(event);
});

render();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
    <img src="${viteLogo}" class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>Get started</h1>
    <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
  </div>
  <button id="counter" type="button" class="counter"></button>
</section>

<div class="ticks"></div>

<section id="next-steps">
  <div id="docs">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
    <h2>Documentation</h2>
    <p>Your questions, answered</p>
    <ul>
      <li>
        <a href="https://vite.dev/" target="_blank">
          <img class="logo" src="${viteLogo}" alt="" />
          Explore Vite
        </a>
      </li>
      <li>
        <a href="https://www.typescriptlang.org" target="_blank">
          <img class="button-icon" src="${typescriptLogo}" alt="">
          Learn more
        </a>
      </li>
    </ul>
  </div>
  <div id="social">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
    <h2>Connect with us</h2>
    <p>Join the Vite community</p>
    <ul>
      <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
      <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
      <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
      <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
    </ul>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
