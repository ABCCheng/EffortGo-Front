export const convertCelsiusToKelvin = (temperature: number) => temperature + 273.15;
export const convertKelvinToCelsius = (temperature: number) => temperature - 273.15;

export const convertFahrenheitToKelvin = (temperature: number) => (temperature + 459.67) * (5 / 9);
export const convertKelvinToFahrenheit = (temperature: number) => temperature * (9 / 5) - 459.67;

export const convertRankineToKelvin = (temperature: number) => temperature * (5 / 9);
export const convertKelvinToRankine = (temperature: number) => temperature * (9 / 5);

