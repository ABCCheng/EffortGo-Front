<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { IconRefresh, IconArrowsRightLeft } from '@tabler/icons-vue';
import { formatNumber } from '@/utils/convert';

const { locale } = useI18n();

const unitOptions = [
  { value: 'm/s', zh: '米/秒', en: 'Meter/Second', baseRate: 1 },
  { value: 'km/h', zh: '千米/小时', en: 'Kilometer/Hour', baseRate: 0.2777777778 },
  { value: 'mph', zh: '迈(英里/小时)', en: 'Mile/Hour', baseRate: 0.44704 },
  { value: 'ft/s', zh: '英尺/秒', en: 'Foot/Second', baseRate: 0.3048 },
  { value: 'knot', zh: '节(海里/小时)', en: 'Knot(Nautical Mile/Hour)', baseRate: 0.5144444444 },
  { value: 'mach', zh: '马赫(音速)', en: 'Mach(Speed of Sound)', baseRate: 343 },
  { value: 'c', zh: '光速', en: 'Speed of Light', baseRate: 299792458 },
];

const fromUnit = ref('km/h');
const toUnit = ref('mph');
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
