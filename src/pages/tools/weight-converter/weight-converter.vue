<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { IconRefresh, IconArrowsRightLeft } from '@tabler/icons-vue';

const { locale } = useI18n();

const unitOptions = [
  { value: 'mg', zh: '毫克', en: 'Milligram', baseRate: 0.001 },
  { value: 'g', zh: '克', en: 'Gram', baseRate: 1 },
  { value: 'kg', zh: '千克', en: 'Kilogram', baseRate: 1000 },
  { value: 't', zh: '吨', en: 'Metric Ton', baseRate: 1000000 },
  { value: 'lb', zh: '(英)磅', en: 'Pound', baseRate: 453.5924 },
  { value: 'oz', zh: '盎司', en: 'Ounce', baseRate: 28.3495 },
  { value: 'ct', zh: '克拉', en: 'Carat', baseRate: 0.2 },
  { value: 'st', zh: '英石', en: 'Stone', baseRate: 6350.29318 },
  { value: 'long_ton', zh: '长吨', en: 'Long Ton(UK)', baseRate: 1016046.91 },
  { value: 'short_ton', zh: '短吨', en: 'Short Ton(US)', baseRate: 907184.74 },
  { value: 'grain', zh: '格令', en: 'Grain', baseRate: 0.06479891 },
  { value: 'dram', zh: '打兰', en: 'Dram', baseRate: 1.771845195 },
  { value: 'cwt', zh: '英担', en: 'Hundredweight(UK)', baseRate: 50802.34544 },
  { value: 'cwt/sh.cwt', zh: '美担', en: 'Hundredweight(US)', baseRate: 45359.237 },
  { value: 'q', zh: '公担', en: 'Quintal', baseRate: 100000 },
  { value: 'carat', zh: '克拉', en: 'Carat', baseRate: 0.2 },
  { value: 'mace', zh: '钱', en: 'Mace(China)', baseRate: 3.75 },
  { value: 'tael', zh: '两', en: 'Tael(China)', baseRate: 37.5 },
  { value: 'jin', zh: '斤', en: 'Jin(China)', baseRate: 500 },
  { value: 'dan', zh: '担', en: 'Dan(China)', baseRate: 50000 },
];

const fromUnit = ref('kg');
const toUnit = ref('lb');
const amount = ref(1);

const unitRates = ref([]);
const baseRates = ref<Record<string, number>>(
  unitOptions.reduce((acc, option) => {
    acc[option.value] = option.baseRate;
    return acc;
  }, {} as Record<string, number>)
);

const unitSelectOptions = computed(() =>
  unitOptions.map((option) => ({
    label: `${locale.value === 'zh' ? option.zh : option.en} (${option.value})`,
    value: option.value,
  }))
);

const convertedAmount = computed(() => {
  if (fromUnit.value === toUnit.value) {
    return amount.value.toFixed(4); // 
  }

  const fromRate = baseRates.value[fromUnit.value] || 1;
  const toRate = baseRates.value[toUnit.value] || 1;

  const result = (amount.value * fromRate) / toRate;
  return result.toFixed(4);
});

const getUnitLabel = (unitValue: string) => {
  const unit = unitOptions.find((item) => item.value === unitValue);
  if (!unit) return '';
  return `${locale.value === 'zh' ? unit.zh : unit.en} (${unit.value})`;
};

const updateUnitRates = () => {
  const fromRate = baseRates.value[fromUnit.value] || 1;

  const orderedRates = Object.entries(baseRates.value).sort(([unitA], [unitB]) => {
    if (unitA === fromUnit.value) return -1;
    if (unitB === fromUnit.value) return 1;
    return 0;
  });

  unitRates.value = orderedRates.map(([unit, baseRate]) => {
    const calculatedRate =  fromRate / baseRate;

    return {
      from: getUnitLabel(fromUnit.value),
      to: getUnitLabel(unit),
      rate: calculatedRate.toFixed(4),
    };
  });
};

const swapUnits = () => {
  const temp = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = temp;
  updateUnitRates();
};

watch(fromUnit, updateUnitRates);

onMounted(updateUnitRates);
</script>

<template>
  <div mx-auto max-w-860px important:flex-1>
    <div class="flex items-center justify-center mb-2 gap-2 flex-wrap">
      <n-select data-track-label="DropSelect_UnitRatesFromUnit" v-model:value="fromUnit" :options="unitSelectOptions" style="width: 270px;"
        class="unit-item" />
      <n-input-number v-model:value="amount" type="number" placeholder="" style="width: 130px;" class="unit-item" />
      <n-icon size="25" :component="IconArrowsRightLeft" @click="swapUnits" style="cursor: pointer" class="unit-icon" />
      <n-select data-track-label="DropSelect_UnitRatesToUnit" v-model:value="toUnit" :options="unitSelectOptions" style="width: 270px;"
        class="unit-item" />
      <n-input :value="convertedAmount" readonly style="width: 130px;" class="unit-item" />
    </div>

    <c-card style="margin: 0; padding: 0;">
      <ul style="margin: 0; padding: 0;">
        <li v-for="rate in unitRates" :key="rate.to" class="flex p-2 rate-item">
          <div class="w-3/5 text-left hide-on-small">{{ rate.from }}</div>
          <div class="w-2/5 text-left show-on-small sm:w-3/5">{{ rate.to }}</div>
          <div class="w-1/5 text-left show-on-small sm:w-2/5">{{ rate.rate }}</div>
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
  .unit-item {
    display: block;
    width: 100% !important;
    margin: 0 auto !important;
  }
  
  .unit-icon {
    display: block;
    margin: 0 auto;
  }

  .hide-on-small {
    display: none;
  }

  .show-on-small {
    display: block;
  }

  .sm\:w-3\/5 {
    width: 60%;
  }

  .sm\:w-2\/5 {
    width: 40%;
    
  }
}
</style>
