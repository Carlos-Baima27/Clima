const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: "Céu limpo",
  1: "Principalmente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Neblina",
  48: "Neblina com geada",
  51: "Garoa fraca",
  53: "Garoa moderada",
  55: "Garoa intensa",
  61: "Chuva fraca",
  63: "Chuva moderada",
  65: "Chuva intensa",
  71: "Neve fraca",
  73: "Neve moderada",
  75: "Neve intensa",
  80: "Pancadas de chuva fracas",
  81: "Pancadas de chuva moderadas",
  82: "Pancadas de chuva intensas",
  95: "Trovoada",
  96: "Trovoada com granizo fraco",
  99: "Trovoada com granizo intenso",
};

export function describeWeatherCode(code: number): string {
  return WEATHER_DESCRIPTIONS[code] ?? "Condição climática desconhecida";
}

export function describeDayPeriod(isDay: number): string {
  return isDay === 1 ? "Dia" : "Noite";
}

export function getDayPeriodIcon(isDay: number): string {
  return isDay === 1 ? "☀" : "☾";
}
