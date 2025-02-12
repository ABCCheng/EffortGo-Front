<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from 'vue-i18n';
import { debounce } from "lodash";
import { IconStar, IconStarFilled,
  IconSunrise, IconSunset,
  IconSun, IconSunFilled, IconCloud, IconCloudFilled, IconCloudRain, IconCloudStorm, IconSnowflake, IconMist
 } from '@tabler/icons-vue';
import { useThemeVars, useMessage } from 'naive-ui';

const theme = useThemeVars();
const message = useMessage();

const { locale } = useI18n();

interface CitySuggestion {
    name: string;
    tagname: string;
    fullname: string;
    showname: string;
    lat: number;
    lon: number;
}

const CACHE_KEY = 'global-weather-cache';
const storedFavorites = ref<CitySuggestion[]>(JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'));

const city = ref("");
const citySuggestions = ref<CitySuggestion[]>([]);
const selectedCity = ref<CitySuggestion | null>(null);
const weatherData = ref<any>(null);

const forecastData = ref<any[]>([]);
const currentPage = ref(1);
const itemsPerPage = 8;

const tagTypes = ['primary', 'info', 'success', 'warning', 'error'];

const getRandomTagType = (index: number) => {
  return tagTypes[index % tagTypes.length];
};


const onInputChange = (newValue: string) => {
    if (!newValue || newValue.includes("-")) {
        return;
    }
    city.value = newValue;
    fetchCities();
};

const onCitySelect = (selectedCityName: string) => {
  const foundCity = citySuggestions.value.find((city) => city.showname === selectedCityName);
  selectedCity.value = foundCity || null; 

  if (selectedCity.value) { 
      fetchWeather(selectedCity.value);
      fetchForecast(selectedCity.value);
      city.value = selectedCity.value.name;
  }
};

const onTagClick = (tagCity: CitySuggestion) => {
  if (tagCity) {
      selectedCity.value = tagCity;
      fetchWeather(selectedCity.value);
      fetchForecast(selectedCity.value);
  }
};

const isFavorite = computed(() => {
  if (!selectedCity.value) {
    return false;
  }
  return storedFavorites.value.some(city => city.fullname === selectedCity.value?.fullname);
})

const toggleFavorite = () => {
  if (!selectedCity.value) {
    return;
  }
  const exist = storedFavorites.value.some(city => city.fullname === selectedCity.value?.fullname);
  if (!exist) {
    if (storedFavorites.value.length >= 10) {
      message.warning((locale.value==='en' ? "You've reached the favorite limit!" : "收藏超过上限啦！"));
      return;
    }
    storedFavorites.value.push(selectedCity.value);
    localStorage.setItem(CACHE_KEY, JSON.stringify(storedFavorites.value));
  } else {
    removeFavorite(selectedCity.value.fullname);
  }
}

const removeFavorite = (fullname: string) => {
  const updatedFavorites = storedFavorites.value.filter(city => city.fullname !== fullname);
  storedFavorites.value = updatedFavorites;
  localStorage.setItem(CACHE_KEY, JSON.stringify(storedFavorites.value));
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
            showname: showname(city),
            tagname: tagname(city),
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
      cityname: `${selectedCity.showname}`,
      timezone: `UTC${data.timezone / 3600 >= 0 ? "+" : ""}${
        data.timezone / 3600
      }`,
      currentTime: formatFullTime(data.dt + data.timezone),
      sunrise: formatHHMMSSTime(data.sys.sunrise + data.timezone),
      sunset: formatHHMMSSTime(data.sys.sunset + data.timezone),
      description: locale.value==='en' ? data.weather[0].main : data.weather[0].description,
      weather: data.weather,
      main: data.main,
      wind: data.wind,
      feels_like: (locale.value==='en' ? 'Feels: ' : '体感: ') + `${ Math.round(data.main.feels_like) }°C`,
      humidity: (locale.value==='en' ? 'Humidity: ' : '湿度: ') + `${ Math.round(data.main.humidity) }%`
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

const showname = (city: any) => {
  if (city.country === 'TW') {
    city.country = 'CN';
    city.state = 'Taiwan'
  }
  if (city.name.includes('Diaoyu Island')) {
    city.country = 'CN';
  }

  if (locale.value==='en') {
    return `${city.name} - ${city.country}${city.state ? `, ${city.state}` : ""}`;
  }
  return `${city.name}${city.local_names?.zh ? ` ${city.local_names.zh}` : ""} - ${city.country}${city.state ? `, ${city.state}` : ""}`;
};

const tagname = (city: any) => {
  if (city.country === 'TW') {
    city.country = 'CN';
    city.state = 'Taiwan'
  }
  if (city.name.includes('Diaoyu Island')) {
    city.country = 'CN';
  }

  if (locale.value==='en') {
    return city.name;
  }
  return city.local_names?.zh ? city.local_names.zh : city.name;
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
  return locale.value==='en' ? `${month}-${day}(${week}) ${hours}h` : `${month}-${day}(${week}) ${hours}点`;
};

const weatherIconMap: Record<string, any> = {
  "01d": IconSun,
  "01n": IconSunFilled,
  "02d": IconCloud,
  "03d": IconCloud,
  "04d": IconCloud,
  "02n": IconCloudFilled,
  "03n": IconCloudFilled,
  "04n": IconCloudFilled,
  "09d": IconCloudRain,
  "09n": IconCloudRain,
  "10d": IconCloudRain,
  "10n": IconCloudRain,
  "11d": IconCloudStorm,
  "11n": IconCloudStorm,
  "13d": IconSnowflake,
  "13n": IconSnowflake,
  "50d": IconMist,
  "50n": IconMist,
};

const weatherIcon = (icon: string) => weatherIconMap[icon] || IconCloudFilled;

</script>

<style scoped>
.weather-icon {
  margin-right: 20px;
}
</style>

<template>
  <div mx-auto max-w-600px important:flex-1>
    <div flex flex-col items-center gap-2 mb-2>
      <n-auto-complete v-model:value="city" clearable
        :options="citySuggestions.map((suggestion) => ({label: `${suggestion.showname}`,value: `${suggestion.showname}`}))"
        blur-after-select @update:value="onInputChange" @select="onCitySelect"
        :placeholder="$t('tools.global-weather.searchPlaceHolder')" mx-auto max-w-600px>
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </n-auto-complete>

      <n-space>
        <n-tag size="small" round v-for="(favorite, index) in storedFavorites" :key="favorite.fullname" :type="getRandomTagType(index)" @click="onTagClick(favorite)">
          {{ favorite.tagname }}
        </n-tag>
      </n-space>
    </div>

    <c-card v-if="weatherData" style="position: relative; margin: 0; padding: 5px 15px;">
      <div flex flex-row items-center justify-center gap-5>
        <div flex flex-col items-center justify-center>
          <n-icon size="50" :component="weatherIcon(weatherData.weather[0].icon)" :color="theme.primaryColor" />
          <p style="margin: 0; padding: 0;">{{ weatherData.description}}</p>
          <p style="margin: 0; padding: 0;">{{ Math.round(weatherData.wind.speed) }}m/s {{
            Math.round(weatherData.main.temp) }}°C</p>
        </div>
        <div flex-1 flex-col>
          <h3 style="margin: 0; padding: 0;">{{ weatherData.cityname }}</h3>
          <p style="margin: 0; padding: 0;">{{ weatherData.timezone }}: {{ weatherData.currentTime }}</p>
          <div flex items-center gap-1>
            <n-icon size="18" :component="IconSunrise" :color="theme.primaryColor" />
            <p style="margin: 0; padding: 0;">{{ weatherData.sunrise }} </p>
            <n-icon ml-2 size="18" :component="IconSunset" :color="theme.primaryColor" />
            <p style="margin: 0; padding: 0;">{{ weatherData.sunset }} </p>
          </div>
          <div flex items-center gap-3>
            <p style="margin: 0; padding: 0;">{{ weatherData.feels_like }}</p>
            <p style="margin: 0; padding: 0;">{{ weatherData.humidity }}</p>
          </div>
        </div>
      </div>
      <n-button style="position: absolute; top: 5px; right: 5px;" size="small" data-track-label="Button_GlobalWeatherFavorite" @click="toggleFavorite" text variant="text">
        <n-icon size="20" :component="isFavorite ? IconStarFilled : IconStar" :color="theme.primaryColor" />
      </n-button>
    </c-card>

    <c-card v-if="forecastData.length" style="margin: 0; padding: 5px;">
      <div flex flex-col items-center justify-center>
        <ul class="w-full" style="margin: 0; padding: 0;">
          <li v-for="(forecast, index) in paginatedForecast" :key="index" class="items-center grid grid-cols-3 p-1">
            <span  class="text-left w-30">{{ forecast.datetime }}</span>
            <div flex items-center justify-start mx-auto w-full ml-5>
              <n-icon size="30" :component="weatherIcon(forecast.icon)" :color="theme.primaryColor" />
              <span class="text-left ml-1">{{ forecast.description }}</span>
            </div>
            <span class="text-right">{{ forecast.temp_min }}°C</span>
          </li>
        </ul>
        <n-pagination v-model:page="currentPage" :page-size="itemsPerPage"
          :page-count="Math.ceil(forecastData.length / itemsPerPage)" :show-size-picker="false"
          style="margin-top: 16px; text-align: center;" />
      </div>
    </c-card>
  </div>
</template>