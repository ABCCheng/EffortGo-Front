<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from 'vue-i18n';
import { debounce } from "lodash";

const { locale } = useI18n();

interface CitySuggestion {
    name: string;
    fullname: string;
    lat: number;
    lon: number;
}

const city = ref("");
const citySuggestions = ref<CitySuggestion[]>([]);
const weatherData = ref<any>(null);

const forecastData = ref<any[]>([]);
const currentPage = ref(1);
const itemsPerPage = 8;

const onInputChange = (newValue: string) => {
    if (newValue.includes("-")) {
        return;
    }
    city.value = newValue;
    fetchCities();
};

const onCitySelect = (selectedCityName: string) => {
    const selectedCity = citySuggestions.value.find((city) => city.fullname === selectedCityName);
    if (selectedCity) {
        fetchWeather(selectedCity);
        fetchForecast(selectedCity);
        city.value = selectedCity.name;
    }
};

const paginatedForecast = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return forecastData.value.slice(startIndex, startIndex + itemsPerPage);
});

const fetchCities = debounce(async () => {
    citySuggestions.value = [];
    if (city.value.length <= 2) {
        return;
    }
    
    const response = await fetch(`/openweathermap-api/geo/1.0/direct?q=${city.value}&limit=10&lang=${locale.value}`);
    const data = await response.json();
    if (Array.isArray(data)) {
        citySuggestions.value = data.map((city: any) => ({
            fullname: fullname(city),
            name: city.name,
            lat: city.lat,
            lon: city.lon,
        }));
    } 
}, 1000);

// current weather
const fetchWeather = async (selectedCity: CitySuggestion) => {
  const response = await fetch(
    `/openweathermap-api/data/2.5/weather?lat=${selectedCity.lat}&lon=${selectedCity.lon}&units=metric&lang=${locale.value}`
  );
  const data = await response.json();
  if (data) {
    weatherData.value = {
      cityname: `${selectedCity.fullname}`,
      timezone: `UTC${data.timezone / 3600 >= 0 ? "+" : ""}${
        data.timezone / 3600
      }`,
      currentTime: formatFullTime(data.dt + data.timezone),
      sunrise: (locale.value==='en' ? 'Sunrise: ' : '日出: ') + formatHHMMSSTime(data.sys.sunrise + data.timezone),
      sunset: (locale.value==='en' ? 'Sunset: ' : '日落: ') + formatHHMMSSTime(data.sys.sunset + data.timezone),
      description: locale.value==='en' ? data.weather[0].main : data.weather[0].description,
      weather: data.weather,
      main: data.main,
      wind: data.wind,
    };
  }
};

const fetchForecast = async (selectedCity: CitySuggestion) => {
  const response = await fetch(
    `/openweathermap-api/data/2.5/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&units=metric&lang=${locale.value}`
  );
  const data = await response.json();
  if (data && Array.isArray(data.list)) {
    forecastData.value = data.list.map((item: any) => ({
      datetime: formatForecastTime(item.dt + data.city.timezone),
      icon: item.weather[0].icon,
      description: locale.value==='en' ? item.weather[0].main : item.weather[0].description,
      temp_min: Math.round(item.main.temp_min),
      temp_max: Math.round(item.main.temp_max),
    }));
  }
};

const fullname = (city: any) => {
  if (city.country === 'TW') {
    city.country = 'CN';
    city.state = 'Taiwan'
  }
  if (city.name.includes('Diaoyu Island')) {
    city.country = 'CN';
  }
  return `${city.name}${city.local_names?.zh ? ` ${city.local_names.zh}` : ""} - ${city.country}${city.state ? `, ${city.state}` : ""}`;
};

const formatFullTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const isoString = date.toISOString();
  
  const year = isoString.slice(0, 4); 
  const month = isoString.slice(5, 7);
  const day = isoString.slice(8, 10); 
  const hours = isoString.slice(11, 13); 
  const minutes = isoString.slice(14, 16);
  const seconds = isoString.slice(17, 19);
  
  const weekDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  const weekDays_zh = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const week = locale.value==='en' ? weekDays[date.getUTCDay()] : weekDays_zh[date.getUTCDay()];

  // yyyy-mm-dd HH:MM:SS week
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${week}`;
};

const formatHHMMSSTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  
  const isoString = date.toISOString();
  
  const hours = isoString.slice(11, 13);
  const minutes = isoString.slice(14, 16);
  const seconds = isoString.slice(17, 19);

  //HH:MM:SS
  return `${hours}:${minutes}:${seconds}`;
};

const formatForecastTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const isoString = date.toISOString();
  
  const month = isoString.slice(5, 7);
  const day = isoString.slice(8, 10); 
  const hours = isoString.slice(11, 13);
  
  const weekDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  const weekDays_zh = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const week = locale.value==='en' ? weekDays[date.getUTCDay()] : weekDays_zh[date.getUTCDay()];

  // mm-dd(week) HH:MM:SS week
  return `${month}-${day}(${week}) ${hours}h`;
};



const weatherIconUrl = (icon: string) =>`/icons-weather/${icon}@2x.png`;
</script>

<style scoped>
.weather-icon {
  margin-right: 20px;
}
</style>

<template>
    <div mx-auto max-w-full important:flex-1>
        <div flex items-center gap-3 mb-3>
            <n-auto-complete v-model:value="city" clearable
                :options="citySuggestions.map((suggestion) => ({label: `${suggestion.fullname}`,value: `${suggestion.fullname}`}))"
                @update:value="onInputChange" @select="onCitySelect" :placeholder="$t('tools.global-weather.searchPlaceHolder')" mx-auto max-w-600px>
                <template #prefix>
                    <icon-mdi-search mr-6px color-black op-70 dark:color-white />
                </template>
            </n-auto-complete>
        </div>
        
        <n-card v-if="weatherData" mx-auto max-w-600px>
            <div flex flex-row items-center justify-center gap-5>
                <div flex flex-col items-center justify-center>
                    <img :src="weatherIconUrl(weatherData.weather[0].icon)" alt="Weather Icon" class="weather-icon"
                        style="width: 100px; height: 100px; margin: -25px; padding: 0;" />
                    <p style="margin: 0; padding: 0;">{{ weatherData.description}}</p>
                    <p style="margin: 0; padding: 0;">{{ Math.round(weatherData.wind.speed) }}m/s {{ Math.round(weatherData.main.temp) }}°C</p>
                </div>
                <div flex-1 flex-col>
                    <h3 style="margin: 0; padding: 0;">{{ weatherData.cityname }}</h3>
                    <p style="margin: 0; padding: 0;">{{ weatherData.timezone }}: {{ weatherData.currentTime }}</p>
                    <p style="margin: 0; padding: 0;">{{ weatherData.sunrise }} </p>
                    <p style="margin: 0; padding: 0;">{{ weatherData.sunset }} </p>
                </div>
            </div>
        </n-card>

        <n-card v-if="forecastData.length" mx-auto max-w-600px>
            <div flex flex-col items-center justify-center>
                <ul class="w-full" style="margin: 0; padding: 0;">
                    <li v-for="(forecast, index) in paginatedForecast" :key="index" class="w-full flex items-center p-1">
                        <span class="flex-1 text-left">{{ forecast.datetime }}</span>
                        <img :src="weatherIconUrl(forecast.icon)" alt="Weather Icon" class="w-40px h-40px" />
                        <span class="flex-0 text-left">{{ forecast.description }}</span>
                        <span class="flex-1 text-right">{{ forecast.temp_min }}°C / {{ forecast.temp_max }}°C</span>
                    </li>
                </ul>
                <n-pagination v-model:page="currentPage" :page-size="itemsPerPage"
                    :page-count="Math.ceil(forecastData.length / itemsPerPage)" :show-size-picker="false"
                    style="margin-top: 16px; text-align: center;" />
            </div>
        </n-card>

    </div>
</template>