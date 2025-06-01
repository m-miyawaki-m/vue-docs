<template>
  <v-container class="d-flex align-center" style="width: 100%;">
    <!-- プルダウンでセンサー種別選択 -->
    <v-select
      v-model="selectedType"
      :items="typeOptions"
      label="センサー種別"
      dense
      outlined
      style="max-width: 150px; margin-right: 16px"
    />
    <!-- センサーON/OFFチャート -->
    <div style="flex: 1;">
      <apexchart
        type="rangeBar"
        height="300"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface RangeBarItem {
  name: string;
  data: { x: string; y: [number, number] }[];
}

export default defineComponent({
  name: 'SensorOnOffChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    data: {
      type: Object as () => Record<string, RangeBarItem>,
      required: true
    },
    timeRange: {
      type: Object as () => { min: number; max: number },
      required: true
    },
    missileRange: {
      type: Object as () => { start: number; end: number },
      required: true
    }
  },
  setup(props) {
    // プルダウンで選ばれたセンサー種別
    const selectedType = ref(Object.keys(props.data)[0])
    const typeOptions = Object.keys(props.data)

    // 現在選択中のセンサーデータを1件だけ渡す
    const chartSeries = computed(() => {
      const selected = props.data[selectedType.value]
      return selected ? [selected] : []
    })

    const chartOptions = computed(() => ({
      chart: {
        type: 'rangeBar',
        toolbar: { show: false },
        zoom: { enabled: false },
        height: 300,
        animations: { enabled: false }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          rangeBarGroupRows: true
        }
      },
      xaxis: {
        type: 'datetime',
        min: props.missileRange.start,
        max: props.missileRange.end,
        labels: {
          datetimeUTC: false,
          format: 'HH:mm'
        }
      },
      tooltip: {
        x: { format: 'yyyy-MM-dd HH:mm' }
      }
    }))

    return {
      selectedType,
      typeOptions,
      chartSeries,
      chartOptions
    }
  }
})
</script>
