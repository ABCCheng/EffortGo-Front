<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { IconRefresh, IconArrowsRightLeft } from '@tabler/icons-vue';

const { t, locale } = useI18n();

const currencyOptions = [
  { value: 'USD', zh: '美元', en: 'US Dollar', flag: '🇺🇸' },
  { value: 'CNY', zh: '人民币', en: 'Chinese Yuan Renminbi', flag: '🇨🇳' },
  { value: 'CAD', zh: '加拿大元', en: 'Canadian Dollar', flag: '🇨🇦' },
  { value: 'HKD', zh: '港元', en: 'Hong Kong Dollar', flag: '🇭🇰' },
  { value: 'EUR', zh: '欧元', en: 'Euro', flag: '🇪🇺' },
  { value: 'JPY', zh: '日元', en: 'Japanese Yen', flag: '🇯🇵' },
  { value: 'BGN', zh: '保加利亚列弗', en: 'Bulgarian Lev', flag: '🇧🇬' },
  { value: 'CZK', zh: '捷克克朗', en: 'Czech Koruna', flag: '🇨🇿' },
  { value: 'DKK', zh: '丹麦克朗', en: 'Danish Krone', flag: '🇩🇰' },
  { value: 'GBP', zh: '英镑', en: 'British Pound Sterling', flag: '🇬🇧' },
  { value: 'HUF', zh: '匈牙利福林', en: 'Hungarian Forint', flag: '🇭🇺' },
  { value: 'PLN', zh: '波兰兹罗提', en: 'Polish Zloty', flag: '🇵🇱' },
  { value: 'RON', zh: '罗马尼亚列伊', en: 'Romanian Leu', flag: '🇷🇴' },
  { value: 'SEK', zh: '瑞典克朗', en: 'Swedish Krona', flag: '🇸🇪' },
  { value: 'CHF', zh: '瑞士法郎', en: 'Swiss Franc', flag: '🇨🇭' },
  { value: 'ISK', zh: '冰岛克朗', en: 'Icelandic Krona', flag: '🇮🇸' },
  { value: 'NOK', zh: '挪威克朗', en: 'Norwegian Krone', flag: '🇳🇴' },
  { value: 'TRY', zh: '土耳其里拉', en: 'Turkish Lira', flag: '🇹🇷' },
  { value: 'AUD', zh: '澳大利亚元', en: 'Australian Dollar', flag: '🇦🇺' },
  { value: 'BRL', zh: '巴西雷亚尔', en: 'Brazilian Real', flag: '🇧🇷' },
  { value: 'IDR', zh: '印尼盾', en: 'Indonesian Rupiah', flag: '🇮🇩' },
  { value: 'ILS', zh: '以色列新谢克尔', en: 'Israeli New Shekel', flag: '🇮🇱' },
  { value: 'INR', zh: '印度卢比', en: 'Indian Rupee', flag: '🇮🇳' },
  { value: 'KRW', zh: '韩元', en: 'South Korean Won', flag: '🇰🇷' },
  { value: 'MXN', zh: '墨西哥比索', en: 'Mexican Peso', flag: '🇲🇽' },
  { value: 'MYR', zh: '马来西亚林吉特', en: 'Malaysian Ringgit', flag: '🇲🇾' },
  { value: 'NZD', zh: '新西兰元', en: 'New Zealand Dollar', flag: '🇳🇿' },
  { value: 'PHP', zh: '菲律宾比索', en: 'Philippine Peso', flag: '🇵🇭' },
  { value: 'SGD', zh: '新加坡元', en: 'Singapore Dollar', flag: '🇸🇬' },
  { value: 'THB', zh: '泰铢', en: 'Thai Baht', flag: '🇹🇭' },
  { value: 'ZAR', zh: '南非兰特', en: 'South African Rand', flag: '🇿🇦' },
];



const fromCurrency = ref('USD');
const toCurrency = ref('CNY');
const amount = ref(1);
const dataGetTime = ref('');
const exchangeRates = ref([]);
const euroRates = ref<Record<string, number>>({});

const currencySelectOptions = computed(() =>
  currencyOptions.map((option) => ({
    label: `${option.flag} ${locale.value === 'zh' ? option.zh : option.en} (${option.value})`,
    value: option.value,
  }))
);

const convertedAmount = computed(() => {
  if (fromCurrency.value === toCurrency.value) {
    return amount.value.toFixed(4); // 
  }

  const fromRate = euroRates.value[fromCurrency.value] || 1;
  const toRate = euroRates.value[toCurrency.value] || 1;

  const result = (amount.value * toRate) / fromRate;
  return result.toFixed(4);
});

const getCurrencyLabel = (currencyValue: string) => {
  const currency = currencyOptions.find((item) => item.value === currencyValue);
  if (!currency) return '';
  return `${currency.flag} ${locale.value === 'zh' ? currency.zh : currency.en} (${currency.value})`;
};

const fetchExchangeRates = async () => {
  try {
    const response = await fetch('/europa-xml/stats/eurofxref/eurofxref-daily.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    const rates: Record<string, number> = {};
    const cubeNodes = xmlDoc.getElementsByTagName('Cube');

    rates['EUR'] = 1;
    for (let i = 0; i < cubeNodes.length; i++) {
      const cube = cubeNodes[i];
      if (cube.getAttribute('time')) {
        dataGetTime.value = cube.getAttribute('time')!;
      }
      if (cube.getAttribute('currency')) {
        const currency = cube.getAttribute('currency')!;
        const rate = parseFloat(cube.getAttribute('rate')!);
        rates[currency] = rate;
      }
    }
    euroRates.value = rates;
    updateExchangeRates();
  } catch (error) {
  }
};


const updateExchangeRates = () => {
  const fromRate = euroRates.value[fromCurrency.value] || 1;

  const orderedRates = Object.entries(euroRates.value).sort(([currencyA], [currencyB]) => {
    if (currencyA === fromCurrency.value) return -1;
    if (currencyB === fromCurrency.value) return 1;
    return 0;
  });

  exchangeRates.value = orderedRates.map(([currency, euroRate]) => {
    const calculatedRate = euroRate / fromRate;

    return {
      from: getCurrencyLabel(fromCurrency.value),
      to: getCurrencyLabel(currency),
      rate: calculatedRate.toFixed(4),
    };
  });
};

const swapCurrencies = () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  updateExchangeRates();
};

watch(fromCurrency, updateExchangeRates);

onMounted(fetchExchangeRates);
</script>

<template>
  <div mx-auto max-w-860px important:flex-1>
    <div class="flex items-center mb-1 gap-2 flex-wrap">
      <h4 class="text-lg m-0 p-0">
        {{ dataGetTime ? t('tools.exchangerates.dataUpdateTime') + ' ' + dataGetTime : t('tools.exchangerates.dataUpdateFailed') }}
      </h4>
      <n-icon data-track-label="Button_ExchangeRatesRefresh" v-if="!dataGetTime" size="25" :component="IconRefresh" @click="fetchExchangeRates"
        style="cursor: pointer; padding: 0; margin: 0" />
    </div>

    <div class="flex items-center justify-center mb-2 gap-2 flex-wrap">
      <n-select data-track-label="DropSelect_ExchangeRatesFromCurrency" v-model:value="fromCurrency" :options="currencySelectOptions" style="width: 270px;"
        class="currency-item" />
      <n-input-number v-model:value="amount" type="number" placeholder="" style="width: 130px;" class="currency-item" />
      <n-icon size="25" :component="IconArrowsRightLeft" @click="swapCurrencies" style="cursor: pointer" class="currency-icon" />
      <n-select v-model:value="toCurrency" :options="currencySelectOptions" style="width: 270px;"
        class="currency-item" />
      <n-input :value="convertedAmount" readonly style="width: 130px;" class="currency-item" />
    </div>

    <c-card style="margin: 0; padding: 0;">
      <ul style="margin: 0; padding: 0;">
        <li v-for="rate in exchangeRates" :key="rate.to" class="flex p-2 rate-item">
          <div class="w-3/5 text-left hide-on-small">{{ rate.from }}</div>
          <div class="w-2/5 text-left show-on-small sm:w-3/4">{{ rate.to }}</div>
          <div class="w-1/5 text-left show-on-small sm:w-1/4">{{ rate.rate }}</div>
        </li>
      </ul>
    </c-card>
  </div>
</template>

<style scoped>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}


.hide-on-small {
  display: block;
}

@media screen and (max-width: 900px) {
  .currency-item {
    display: block;
    width: 100% !important;
    margin: 0 auto !important;
  }
  
  .currency-icon {
    display: block;
    margin: 0 auto;
  }

  .hide-on-small {
    display: none;
  }

  .show-on-small {
    display: block;
  }

  .sm\:w-3\/4 {
    width: 75%;
  }

  .sm\:w-1\/4 {
    width: 25%;
    
  }
}
</style>
