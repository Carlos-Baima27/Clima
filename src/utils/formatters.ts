const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

export function formatTemperature(value: number): string {
  return `${decimalFormatter.format(value)} °C`;
}

export function formatPercentage(value: number): string {
  return `${numberFormatter.format(value)}%`;
}

export function formatPrecipitation(value: number | null): string {
  return value === null
    ? "Indisponível"
    : `${decimalFormatter.format(value)} mm`;
}

export function formatWindSpeed(value: number): string {
  return `${decimalFormatter.format(value)} km/h`;
}

export function formatWindDirection(value: number): string {
  return `${numberFormatter.format(value)}°`;
}

export function formatLocalDate(timezone: string, date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
      timeZone: timezone,
    }).format(date);
  } catch {
    return "Data indisponível";
  }
}
