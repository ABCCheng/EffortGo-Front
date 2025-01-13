<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { IconRefresh, IconArrowsRightLeft } from '@tabler/icons-vue';
import { formatNumber } from '@/utils/convert';

const { locale } = useI18n();

const unitOptions = [
  { value: 'mm', zh: '毫米', en: 'Millimeter', baseRate: 0.001 },
  { value: 'cm', zh: '厘米', en: 'Centimeter', baseRate: 0.01 },
  { value: 'm', zh: '米', en: 'Meter', baseRate: 1 },
  { value: 'km', zh: '千米', en: 'Kilometer', baseRate: 1000 },
  { value: 'in', zh: '英寸', en: 'Inch', baseRate: 0.0254 },
  { value: 'ft', zh: '英尺', en: 'Foot', baseRate: 0.3048 },
  { value: 'yd', zh: '码', en: 'Yard', baseRate: 0.9144 },
  { value: 'mi', zh: '英里(迈)', en: 'Mile', baseRate: 1609.344 },
  { value: 'nmi', zh: '海里', en: 'Nautical Mile', baseRate: 1852 },
  { value: 'ly', zh: '光年', en: 'Light Year', baseRate: 9.4607e15 },
  { value: 'li', zh: '里', en: 'Li(China)', baseRate: 500 },
  { value: 'zhang', zh: '丈', en: 'Zhang(China)', baseRate: 3.3333333333 },
  { value: 'chi', zh: '尺', en: 'Chi(China)', baseRate: 0.3333333333 },
  { value: 'cun', zh: '寸', en: 'Cun(China)', baseRate: 0.0333333333 },
];

const fromUnit = ref('m');
const toUnit = ref('ft');
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
  return formatNumber(result);
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
      rate: formatNumber(calculatedRate),
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
