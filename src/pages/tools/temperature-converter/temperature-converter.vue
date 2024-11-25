<script setup lang="ts">
import _ from 'lodash';
import {
  convertCelsiusToKelvin,
  convertFahrenheitToKelvin,
  convertKelvinToCelsius,
  convertKelvinToFahrenheit,
  convertKelvinToRankine,
  convertRankineToKelvin,
} from './temperature-converter.models';

const { t } = useI18n();

type TemperatureScale = 'kelvin' | 'celsius' | 'fahrenheit' | 'rankine' ;

const units = reactive<
  Record<
    string | TemperatureScale,
    { title: () => string; unit: string; ref: number; toKelvin: (v: number) => number; fromKelvin: (v: number) => number }
  >
      >({
        kelvin: {
          title: () => t('tools.temperature-converter.kelvin'),
          unit: 'K',
          ref: 0,
          toKelvin: _.identity,
          fromKelvin: _.identity,
        },
        celsius: {
          title: () => t('tools.temperature-converter.celsius'),
          unit: '°C = K - 273.15',
          ref: 0,
          toKelvin: convertCelsiusToKelvin,
          fromKelvin: convertKelvinToCelsius,
        },
        fahrenheit: {
          title: () => t('tools.temperature-converter.fahrenheit'),
          unit: '°F = (K x 9/5) - 459.67',
          ref: 0,
          toKelvin: convertFahrenheitToKelvin,
          fromKelvin: convertKelvinToFahrenheit,
        },
        rankine: {
          title: () => t('tools.temperature-converter.rankine'),
          unit: '°R = K x 9/5',
          ref: 0,
          toKelvin: convertRankineToKelvin,
          fromKelvin: convertKelvinToRankine,
        }
      });

function update(key: TemperatureScale) {
  const { ref: value, toKelvin } = units[key];

  const kelvins = toKelvin(value) ?? 0;

  _.chain(units)
    .omit(key)
    .forEach(({ fromKelvin }, index) => {
      units[index].ref = Math.floor((fromKelvin(kelvins) ?? 0) * 100) / 100;
    })
    .value();
}

update('kelvin');
</script>

<template>
  <div>
    <n-input-group v-for="[key, { title, unit }] in Object.entries(units)" :key="key" mb-3 w-full>
      <n-input-group-label style="width: 100px">
        {{ title() }}
      </n-input-group-label>

      <n-input-number
        v-model:value="units[key].ref"
        style="flex: 1"
        @update:value="() => update(key as TemperatureScale)"
      />

      <n-input-group-label style="width: 180px">
        {{ unit }}
      </n-input-group-label>
    </n-input-group>
  </div>
</template>
